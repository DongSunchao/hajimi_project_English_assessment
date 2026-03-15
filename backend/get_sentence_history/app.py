import json
import boto3
import os
from boto3.dynamodb.conditions import Key
from decimal import Decimal

class DecimalEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, Decimal):
            return float(obj) if obj % 1 else int(obj)
        return super(DecimalEncoder, self).default(obj)

dynamodb = boto3.resource('dynamodb', region_name='ap-southeast-2')

def build_response(status_code, body):
    return {
        'statusCode': status_code,
        'headers': {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Headers': 'Content-Type',
            'Access-Control-Allow-Methods': 'OPTIONS,POST'
        },
        'body': json.dumps(body, cls=DecimalEncoder, ensure_ascii=False)
    }

def lambda_handler(event, context):
    # 🛡️ 依然是咱们昨晚血战过的 CORS OPTIONS 拦截器
    http_method = event.get('httpMethod') or event.get('requestContext', {}).get('http', {}).get('method', '')
    if http_method == 'OPTIONS':
        return build_response(200, {})

    try:
        body = json.loads(event.get('body', '{}'))
        user_id = body.get('userId')

        if not user_id:
            return build_response(400, {"error": "Missing userId parameter"})

        table_name = os.environ['DYNAMODB_TABLE_NAME']
        table = dynamodb.Table(table_name)

        # 🚀 核心查询逻辑
        response = table.query(
            KeyConditionExpression=Key('userId').eq(user_id),
            ScanIndexForward=False,  # False 代表降序（时间倒序），最新的记录排在最前面！
            Limit=20                 # 为了前端性能，最多只取最近的 20 条历史记录
        )

        items = response.get('Items', [])
        
        # 成功返回历史数组
        return build_response(200, {"history": items})

    except Exception as e:
        print(f"❌ 读取历史记录失败: {str(e)}")
        return build_response(500, {"error": "Internal server error", "details": str(e)})