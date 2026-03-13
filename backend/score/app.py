import json
import base64
import urllib.request
import urllib.error
import boto3# type: ignore
import os
import time  # For generating timestamps

# Initialize S3 and DynamoDB clients
s3_client = boto3.client('s3', region_name='ap-southeast-2')
dynamodb = boto3.resource('dynamodb', region_name='ap-southeast-2')

def lambda_handler(event, context):
    try:
        # 1. Parse frontend data (redundant code cleaned)
        body = json.loads(event.get('body', '{}'))
        file_name = body.get('fileName')
        reference_text = body.get('referenceText')
        user_id = body.get('userId')  # Rocket Get directly

        if not file_name or not reference_text or not user_id:
            return build_response(400, {"error": "Missing fileName, referenceText or userId parameters"})

        # 2. Read configuration from environment variables
        bucket_name = os.environ['S3_BUCKET_NAME']
        speech_key = os.environ['SPEECH_KEY']
        speech_region = os.environ['SPEECH_REGION']
        table_name = os.environ.get('DYNAMODB_TABLE_NAME')

        # 3. Read audio
        s3_response = s3_client.get_object(Bucket=bucket_name, Key=file_name)
        audio_data = s3_response['Body'].read()

        # 4. Construct Header
        pronAssessmentParamsJson = json.dumps({
            "ReferenceText": reference_text,
            "GradingSystem": "HundredMark",
            "Granularity": "Phoneme",
            "Dimension": "Comprehensive",
            "Format": "Detailed"  # Rocket Extremely critical: Force detailed report in request header!
        })
        pronAssessmentHeader = base64.b64encode(pronAssessmentParamsJson.encode('utf-8')).decode('utf-8')

        # 5. Rocket Core fix 1: Add &format=detailed to force Azure to return word and phoneme details!
        url = f"https://{speech_region}.stt.speech.microsoft.com/speech/recognition/conversation/cognitiveservices/v1?language=en-US&format=detailed"
        headers = {
            "Ocp-Apim-Subscription-Key": speech_key,
            "Content-Type": "audio/wav; codecs=audio/pcm; samplerate=16000",
            "Accept": "application/json",
            "Pronunciation-Assessment": pronAssessmentHeader
        }

        # 6. Request Azure API
        print("Requesting Azure API...")
        req = urllib.request.Request(url, data=audio_data, headers=headers, method='POST')

        with urllib.request.urlopen(req) as response:
            result_json = json.loads(response.read().decode('utf-8'))
            print("Azure scoring successful!")
            print(f"Eye Azure raw response data: {json.dumps(result_json)}")
            # ==========================================
            # Data cleaning and writing to DynamoDB
            # ==========================================
            try:
                # Extract core data
                nbest = result_json.get('NBest', [{}])[0]

                # Rocket Fix: Get scores directly, don't nest values anymore!
                pron_score = nbest.get('PronScore', 0)
                words_data = nbest.get('Words', [])

                weak_words = []
                weak_phonemes = set() # 用 set 自动去重更优雅
                phoneme_scores_map = {} # 🚀 新增：专门记录每个音素在本句话的最低分

                # 遍历所有单词和音素，找出弱项并记录最低分
                for word_obj in words_data:
                    word_score = word_obj.get('AccuracyScore', 100)
                    if word_score < 80:
                        weak_words.append(word_obj.get('Word', ''))

                    for phoneme_obj in word_obj.get('Phonemes', []):
                        p = phoneme_obj.get('Phoneme', '')
                        p_score = phoneme_obj.get('AccuracyScore', 100)
                        
                        # 记录低于 80 分的弱势音素
                        if p_score < 80:
                            weak_phonemes.add(p)

                        # 🚀 核心逻辑：记录/更新这个音素的【最低分】
                        # 如果已经在 map 里了，就和当前分数比大小，保留更低的那个
                        if p in phoneme_scores_map:
                            phoneme_scores_map[p] = min(phoneme_scores_map[p], int(p_score))
                        else:
                            # 第一次遇到这个音素，直接记录
                            phoneme_scores_map[p] = int(p_score)

                # 写入 DynamoDB 表
                table = dynamodb.Table(table_name)
                table.put_item(
                    Item={
                        'userId': user_id,
                        'timestamp': int(time.time()),
                        'score': int(pron_score),
                        'referenceText': reference_text if reference_text else f"Topic: {topic_text}",
                        'weakWords': weak_words,
                        'weakPhonemes': list(weak_phonemes), 
                        # 🚀 新增字段：直接把字典存进去！DynamoDB 原生支持 Map 类型
                        'phonemeScores': phoneme_scores_map 
                    }
                )
                print(f"Check mark History record successfully written to DynamoDB, weak phonemes: {list(set(weak_phonemes))}")

            except Exception as db_error:
                print(f"Warning sign Writing to DynamoDB failed: {str(db_error)}")

            # ==========================================
            # Rocket Perfect backward compatibility! Repackage detailed score into simple format to prevent frontend blank screen
            result_json['PronunciationAssessment'] = {
                "AccuracyScore": nbest.get('AccuracyScore', 0),
                "FluencyScore": nbest.get('FluencyScore', 0),
                "CompletenessScore": nbest.get('CompletenessScore', 0),
                "PronScore": nbest.get('PronScore', 0)
            }

            # ==========================================
            # Rocket Core fix 3: Lossless backward compatibility! Extract nested scores to ensure no frontend blank screen errors
            if 'PronunciationAssessment' not in result_json and 'NBest' in result_json and len(result_json['NBest']) > 0:
                result_json['PronunciationAssessment'] = result_json['NBest'][0].get('PronunciationAssessment', {})
            # ==========================================

            return build_response(200, result_json)

    except urllib.error.HTTPError as e:
        error_msg = e.read().decode('utf-8')
        print(f"Azure API error: {error_msg}")
        return build_response(e.code, {"error": "Azure API call failed", "details": error_msg})
    except Exception as e:
        print(f"Lambda internal error: {str(e)}")
        return build_response(500, {"error": "Internal server error", "details": str(e)})

def build_response(status_code, body):
    return {
        'statusCode': status_code,
        'headers': {
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json'
        },
        'body': json.dumps(body)
    }