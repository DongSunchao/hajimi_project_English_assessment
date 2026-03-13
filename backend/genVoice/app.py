import os
import json
import boto3 # type: ignore
import urllib.request
import base64
from urllib.error import HTTPError

s3_client = boto3.client('s3')
s3_bucket_name = os.environ.get('S3_BUCKET_NAME')

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

def clone_and_speak(audio_bytes, text_to_speak, filename="user_sample.webm"):
    """ElevenLabs real-time voice cloning engine"""
    api_key = os.environ.get('ELEVENLABS_API_KEY')
    if not api_key:
        raise ValueError("Missing ELEVENLABS_API_KEY")

    headers = {"xi-api-key": api_key}
    voice_id = None
    
    try:
        # 1. Quickly create a temporary cloned voice
        print("1. Cloning voice...")
        boundary = '----WebKitFormBoundary7MA4YWxkTrZu0gW'
        body = []
        body.append(f'--{boundary}\r\nContent-Disposition: form-data; name="name"\r\n\r\nTemp_Voice\r\n'.encode('utf-8'))
        body.append(f'--{boundary}\r\nContent-Disposition: form-data; name="files"; filename="{filename}"\r\nContent-Type: audio/wav\r\n\r\n'.encode('utf-8'))
        body.append(audio_bytes)
        body.append(f'\r\n--{boundary}--\r\n'.encode('utf-8'))
        
        req_add = urllib.request.Request(
            "https://api.elevenlabs.io/v1/voices/add",
            data=b"".join(body),
            headers={**headers, "Content-Type": f"multipart/form-data; boundary={boundary}"},
            method="POST"
        )
        res_add = urllib.request.urlopen(req_add, timeout=30)
        voice_id = json.loads(res_add.read().decode('utf-8')).get('voice_id')

        # 2. Synthesize the requested speech
        print(f"2. Synthesizing speech, Voice ID: {voice_id}")
        tts_payload = {
            "text": text_to_speak,
            "model_id": "eleven_multilingual_v2",
            "voice_settings": {"stability": 0.5, "similarity_boost": 0.9}
        }
        req_tts = urllib.request.Request(
            f"https://api.elevenlabs.io/v1/text-to-speech/{voice_id}?output_format=mp3_44100_128",
            data=json.dumps(tts_payload).encode('utf-8'),
            headers={**headers, "Content-Type": "application/json"},
            method="POST"
        )
        res_tts = urllib.request.urlopen(req_tts, timeout=30)
        audio_base64 = base64.b64encode(res_tts.read()).decode('utf-8')
        
        return f"data:audio/mp3;base64,{audio_base64}"

    finally:
        # 3. Critical: delete the temporary voice after use to avoid occupying free-tier resources
        if voice_id:
            try:
                print(f"3. Deleting Voice ID: {voice_id}")
                req_del = urllib.request.Request(f"https://api.elevenlabs.io/v1/voices/{voice_id}", headers=headers, method="DELETE")
                urllib.request.urlopen(req_del, timeout=10)
            except Exception as e:
                print(f"Delete failed: {e}")

def lambda_handler(event, context):
    http_method = event.get('httpMethod') or event.get('requestContext', {}).get('http', {}).get('method', '')
    if http_method == 'OPTIONS':
        return build_response(200, {})

    try:
        body = json.loads(event.get('body', '{}'))
        file_name = body.get('fileName')
        target_text = body.get('text') # This is the tongue-twister text sent from the frontend

        if not file_name or not target_text:
            return build_response(400, {"error": "Missing fileName or text parameter"})

        if not s3_bucket_name:
            return build_response(500, {"error": "Missing S3_BUCKET_NAME env var"})

        # Fetch the user's original clean recording from S3
        s3_response = s3_client.get_object(Bucket=s3_bucket_name, Key=file_name)
        user_audio_bytes = s3_response['Body'].read()

        # Call the clone engine
        cloned_audio_base64 = clone_and_speak(user_audio_bytes, target_text, filename=file_name)

        if cloned_audio_base64:
            return build_response(200, {"audio_base64": cloned_audio_base64})
        else:
            return build_response(500, {"error": "Voice cloning failed."})

    except HTTPError as e:
        # 🚀 Important: read and surface the detailed ElevenLabs error message
        detailed_error = e.read().decode('utf-8')
        print(f"ElevenLabs detailed error: {detailed_error}")
        return build_response(400, {"error": f"ElevenLabs Detail: {detailed_error}"})

    except Exception as e:
        print(f"genVoice internal error: {e}")
        return build_response(500, {"error": str(e)})