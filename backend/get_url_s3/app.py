import json
import boto3# type: ignore
import uuid
import os
from botocore.config import Config# type: ignore

# Initialize S3 client
s3_client = boto3.client(
    's3',
    region_name='ap-southeast-2',
    endpoint_url='https://s3.ap-southeast-2.amazonaws.com',
    config=Config(signature_version='s3v4')
)
def lambda_handler(event, context):
    try:
        # Read S3 Bucket name from environment variable
        bucket_name = os.environ['S3_BUCKET_NAME']

        # Generate a random and unique filename for the audio to be uploaded
        file_name = f"audio_{uuid.uuid4().hex}.wav"

        # Core: Generate presigned URL, restrict to PUT method only, and declare file type must be wav
        presigned_url = s3_client.generate_presigned_url(
            'put_object',
            Params={
                'Bucket': bucket_name,
                'Key': file_name,
                'ContentType': 'audio/wav'
            },
            ExpiresIn=300  # URL valid for 300 seconds (5 minutes)
        )

        # Return standard CORS response
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*', # Solve CORS issues
                'Content-Type': 'application/json'
            },
            'body': json.dumps({
                'upload_url': presigned_url,
                'file_name': file_name
            })
        }

    except Exception as e:
        print(f"Failed to generate URL: {str(e)}")
        return {
            'statusCode': 500,
            'headers': {
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': 'Unable to generate upload link', 'details': str(e)})
        }