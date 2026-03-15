import os
import json
import boto3# type: ignore
import urllib.request
from boto3.dynamodb.conditions import Key# type: ignore

dynamodb = boto3.resource('dynamodb')

table_name = os.environ.get('DYNAMODB_TABLE_NAME')
table = dynamodb.Table(table_name)

def build_response(status_code, body):
    return {
        'statusCode': status_code,
        'headers': {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Headers': 'Content-Type',
            'Access-Control-Allow-Methods': 'OPTIONS,POST'
        },
        'body': json.dumps(body, ensure_ascii=False)
    }

def lambda_handler(event, context):
    http_method = event.get('httpMethod') or event.get('requestContext', {}).get('http', {}).get('method', '')

    # (CORS)
    if http_method == 'OPTIONS':
        return build_response(200, {})

    try:
        body = json.loads(event.get('body', '{}'))
        user_id = body.get('userId')
        recognized_text = body.get('recognizedText', '')

        # 🚀 deep is default mode
        mode = body.get('mode', 'deep')
        
        if not user_id:
            return build_response(400, {"error": "Missing userId"})

        # ==========================================
        # Thunder Quick Mode
        # ==========================================
        if mode == 'quick':
            prompt = f"""
            User just completed an English oral practice, the recognized text is: "{recognized_text}".
            Please give him a short, enthusiastic, and energetic encouragement in English, and provide a general pronunciation tip about this English sentence (no more than 40 words).
            Please strictly return in JSON format:
            {{
                "quick_tip": "Your short encouragement and tips"
            }}
            """

        # ==========================================
        # Brain Depth History Analysis (Deep Mode) - Your original powerful logic
        # ==========================================
        else:
            try:
                db_res = table.query(
                    KeyConditionExpression=Key('userId').eq(user_id),
                    ScanIndexForward=False, # Reverse order, most recent at [0]
                    Limit=5
                )
                history_items = db_res.get('Items', [])
            except Exception as e:
                print("Failed to read DynamoDB, may lack permissions or table name is incorrect:", e)
                history_items = []

            if not history_items:
                return build_response(200, {
                    "greeting": "Hello there! It seems this is your first time letting me help diagnose your pronunciation, or you haven't completed the latest recording assessment yet.",
                    "tongue_twister": "No data, no drama. Please record your voice first!",
                    "tip": "Please first click the recording button above to complete a Microsoft Azure pronunciation assessment, so I can generate a targeted tongue twister for you!",
                    "practice_sentences": []
                })

            # Latest status for this session
            current_run = history_items[0]
            current_weak_phonemes = current_run.get('weakPhonemes', [])
            current_weak_words = current_run.get('weakWords', [])

            # Refine historical weak points (exclude the last one)
            historical_weak_phonemes = []
            for item in history_items[1:]:
                historical_weak_phonemes.extend(item.get('weakPhonemes', []))
            historical_weak_phonemes = list(set(historical_weak_phonemes)) # Deduplicate

            prompt = f"""
            You are an extremely professional top-tier English pronunciation private tutor.
            User's latest pronunciation text is: "{recognized_text}"
            His weakest words in this pronunciation are: {current_weak_words}
            His weakest phonemes in this pronunciation are: {current_weak_phonemes}
            The historical phonemes he often mispronounces in past practice sessions are: {historical_weak_phonemes}

            Please perform the following tasks and strictly return in JSON format:
            1. greeting: Give feedback based on his history. If he didn't make historical errors this time (latest weak points don't include historical weak points), praise him for making huge progress! If he's still making the same mistakes, encourage him gently.
            2. tongue_twister: For his weakest phoneme this time ({current_weak_phonemes}), immediately compose a pure English tongue twister containing lots of that phoneme.
            3. tip: In one English sentence, tell him how to form this sound in the mouth (e.g., tongue position, whether to vibrate vocal cords).
            4. practice_sentences: Provide him with two contextualized English sentences to practice these weak phonemes.

            Return example:
            {{
                "greeting": "Wow! I noticed that the 'th' sound you've always struggled with is completely mastered this time! But the 'r' sound is a bit weak this time.",
                "tongue_twister": "Red lories, yellow lories, really loudly.",
                "tip": "When pronouncing the 'r' sound, curl your tongue tip up close to the palate, but never touch it. Meanwhile, definitely vibrate your vocal cords!",
                "practice_sentences": [
                    "Professional workplace communication English sentence containing the above weak phonemes",
                    "Daily casual chat English sentence containing the above weak phonemes"
                ]
            }}
            """

        # ==========================================
        # 3. Call Gemini 2.5 Flash (shared model channel)
        # ==========================================
        gemini_key = os.environ.get('GEMINI_API_KEY')
        url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key={gemini_key}"

        payload = {
            "contents": [{"parts": [{"text": prompt}]}],
            "generationConfig": {
                "responseMimeType": "application/json"
            }
        }

        req = urllib.request.Request(url, data=json.dumps(payload).encode('utf-8'), headers={'Content-Type': 'application/json'})

        max_retries = 2 
        ai_response_text = None

        for attempt in range(max_retries):
            try:
                response = urllib.request.urlopen(req, timeout=45)
                result = json.loads(response.read().decode('utf-8'))
                ai_response_text = result['candidates'][0]['content']['parts'][0]['text']
                break  

            except urllib.error.HTTPError as e:
                # 🛡️ for 503/429 error code 
                if e.code in [503, 429, 500] and attempt < max_retries - 1:
                    print(f"⚠️ something wrong in Google (error code {e.code})，1 second for {attempt + 1}th try...")
                    import time
                    time.sleep(1) 
                    continue
                else:
                    print(f"❌ API totallty wrong or no usrage for AI: HTTP {e.code}")
                    break

            except Exception as e:
                print(f"❌ unexpected error: {e}")
                break

        # ==========================================
        # 🟢 normal return process
        # ==========================================
        if ai_response_text:
            try:
                return build_response(200, json.loads(ai_response_text))
            except Exception as parse_error:
                print(f"❌ no legal json parse error:  {parse_error}")

        # ==========================================
        # 🛡️  2： (Fallback) for unprecess 
        # ==========================================
        
        print("⚠️  AI （Fallback） ")
        fallback_response = {}
        current_mode = locals().get('mode', 'quick') 

        if current_mode == 'quick':
            fallback_response = {
                "quick_tip": "Wow, what a great try! The AI is taking a quick nap, but keep up the good work! 🌟"
            }
        else:
            fallback_response = {
                "quick_tip": "Great effort! Your rhythm is getting better.",
                "detailed_diagnosis": "Our AI brain is processing massive data right now, but analyzing your acoustic features, you're doing a fantastic job.",
                "tongue_twister": "Practice makes perfect when you pronounce with passion and purpose.",
                "current_weak_phonemes": [] 
            }

        #fake 200 error
        return build_response(200, fallback_response)

    except Exception as fatal_error:
        print(f"AI Tutor interal error: {fatal_error}")
        return build_response(500, {"error": str(fatal_error)})