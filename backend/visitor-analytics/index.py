import json
import os
from datetime import datetime
from typing import Dict, Any, Optional

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: Track website visitors and collect analytics data
    Args: event - dict with httpMethod, body, headers, queryStringParameters
          context - object with request_id attribute
    Returns: HTTP response dict with visitor tracking results
    '''
    method: str = event.get('httpMethod', 'GET')
    
    # Handle CORS OPTIONS request
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-User-Id, X-Visitor-Id, User-Agent',
                'Access-Control-Max-Age': '86400'
            },
            'isBase64Encoded': False,
            'body': ''
        }
    
    # Only allow POST for tracking
    if method != 'POST':
        return {
            'statusCode': 405,
            'headers': {'Access-Control-Allow-Origin': '*'},
            'isBase64Encoded': False,
            'body': json.dumps({'error': 'Method not allowed'})
        }
    
    try:
        # Parse request data
        body_data = json.loads(event.get('body', '{}'))
        headers = event.get('headers', {})
        
        # Extract visitor data
        visitor_uuid = body_data.get('visitorId', 'unknown-visitor')
        user_agent = headers.get('user-agent', '')
        ip_address = headers.get('x-forwarded-for', '').split(',')[0].strip() or headers.get('x-real-ip', 'unknown')
        referrer = body_data.get('referrer', '')
        landing_page = body_data.get('landingPage', '/')
        current_page = body_data.get('currentPage', '/')
        
        # Parse UTM parameters
        utm_params = body_data.get('utm', {})
        utm_source = utm_params.get('source', '')
        utm_medium = utm_params.get('medium', '')
        utm_campaign = utm_params.get('campaign', '')
        
        # Device detection (basic)
        device_type = 'desktop'
        if 'mobile' in user_agent.lower():
            device_type = 'mobile'
        elif 'tablet' in user_agent.lower():
            device_type = 'tablet'
        
        # Browser detection (basic)
        browser = 'unknown'
        if 'chrome' in user_agent.lower():
            browser = 'Chrome'
        elif 'firefox' in user_agent.lower():
            browser = 'Firefox'
        elif 'safari' in user_agent.lower():
            browser = 'Safari'
        elif 'edge' in user_agent.lower():
            browser = 'Edge'
        
        # Simple analytics tracking without database for now
        tracking_data = {
            'visitor_id': visitor_uuid,
            'page': current_page,
            'timestamp': datetime.now().isoformat(),
            'user_agent': user_agent,
            'device': device_type,
            'browser': browser,
            'referrer': referrer,
            'utm_source': utm_source,
            'utm_medium': utm_medium,
            'utm_campaign': utm_campaign
        }
        
        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'isBase64Encoded': False,
            'body': json.dumps({
                'success': True,
                'visitorId': visitor_uuid,
                'sessionId': f'session-{datetime.now().timestamp()}',
                'isNewVisitor': True,
                'message': 'Analytics data recorded successfully',
                'data': tracking_data
            })
        }
        
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'isBase64Encoded': False,
            'body': json.dumps({
                'success': False,
                'error': str(e)
            })
        }