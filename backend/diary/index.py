'''
Business: API для управления электронным дневником ученика - CRUD операции для записей, планирования занятий, медиа файлов
Args: event - dict с httpMethod, body, queryStringParameters, pathParams
      context - объект с атрибутами request_id, function_name
Returns: HTTP response dict с данными дневника
'''

import json
import os
from typing import Dict, Any, List, Optional
from datetime import datetime, date
import psycopg2
from psycopg2.extras import RealDictCursor

def get_db_connection():
    """Создает подключение к БД"""
    dsn = os.environ.get('DATABASE_URL')
    return psycopg2.connect(dsn, cursor_factory=RealDictCursor)

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    method: str = event.get('httpMethod', 'GET')
    path: str = event.get('path', '')
    
    # CORS preflight
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-User-Id, X-Role',
                'Access-Control-Max-Age': '86400'
            },
            'body': ''
        }
    
    headers = {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
    }
    
    try:
        conn = get_db_connection()
        cur = conn.cursor()
        
        # Получаем роль пользователя из заголовков
        user_id = event.get('headers', {}).get('X-User-Id')
        user_role = event.get('headers', {}).get('X-Role', 'student')
        
        # GET /diary/entries - получить записи дневника
        if method == 'GET' and 'entries' in path:
            student_id = event.get('queryStringParameters', {}).get('student_id')
            
            if user_role == 'director':
                # Директор видит все записи
                if student_id:
                    cur.execute(
                        "SELECT de.*, u1.name as student_name, u2.name as trainer_name "
                        "FROM diary_entries de "
                        "JOIN users u1 ON de.student_id = u1.id "
                        "LEFT JOIN users u2 ON de.trainer_id = u2.id "
                        "WHERE de.student_id = %s ORDER BY de.entry_date DESC",
                        (student_id,)
                    )
                else:
                    cur.execute(
                        "SELECT de.*, u1.name as student_name, u2.name as trainer_name "
                        "FROM diary_entries de "
                        "JOIN users u1 ON de.student_id = u1.id "
                        "LEFT JOIN users u2 ON de.trainer_id = u2.id "
                        "ORDER BY de.entry_date DESC LIMIT 100"
                    )
            elif user_role == 'trainer':
                # Тренер видит записи своих учеников
                cur.execute(
                    "SELECT de.*, u1.name as student_name, u2.name as trainer_name "
                    "FROM diary_entries de "
                    "JOIN users u1 ON de.student_id = u1.id "
                    "LEFT JOIN users u2 ON de.trainer_id = u2.id "
                    "WHERE de.trainer_id = %s ORDER BY de.entry_date DESC",
                    (user_id,)
                )
            else:
                # Ученик/родитель видит только свои записи
                cur.execute(
                    "SELECT de.*, u1.name as student_name, u2.name as trainer_name "
                    "FROM diary_entries de "
                    "JOIN users u1 ON de.student_id = u1.id "
                    "LEFT JOIN users u2 ON de.trainer_id = u2.id "
                    "WHERE de.student_id = %s ORDER BY de.entry_date DESC",
                    (student_id or user_id,)
                )
            
            entries = cur.fetchall()
            
            # Получаем медиа для каждой записи
            for entry in entries:
                cur.execute(
                    "SELECT * FROM diary_media WHERE diary_entry_id = %s",
                    (entry['id'],)
                )
                entry['media'] = cur.fetchall()
            
            return {
                'statusCode': 200,
                'headers': headers,
                'isBase64Encoded': False,
                'body': json.dumps({'entries': entries}, default=str)
            }
        
        # POST /diary/entries - создать запись (только тренер)
        if method == 'POST' and 'entries' in path:
            if user_role not in ['trainer', 'director']:
                return {
                    'statusCode': 403,
                    'headers': headers,
                    'isBase64Encoded': False,
                    'body': json.dumps({'error': 'Только тренер может создавать записи'})
                }
            
            body_data = json.loads(event.get('body', '{}'))
            
            cur.execute(
                "INSERT INTO diary_entries (student_id, trainer_id, lesson_plan_id, entry_date, comment, homework, grade, attendance) "
                "VALUES (%s, %s, %s, %s, %s, %s, %s, %s) RETURNING *",
                (
                    body_data['student_id'],
                    user_id,
                    body_data.get('lesson_plan_id'),
                    body_data.get('entry_date', date.today()),
                    body_data['comment'],
                    body_data.get('homework'),
                    body_data.get('grade'),
                    body_data.get('attendance', 'present')
                )
            )
            entry = cur.fetchone()
            
            # Добавляем медиа если есть
            media_list = []
            if body_data.get('media'):
                for media in body_data['media']:
                    cur.execute(
                        "INSERT INTO diary_media (diary_entry_id, media_type, media_url, thumbnail_url, description) "
                        "VALUES (%s, %s, %s, %s, %s) RETURNING *",
                        (entry['id'], media['type'], media['url'], media.get('thumbnail'), media.get('description'))
                    )
                    media_list.append(cur.fetchone())
            
            conn.commit()
            entry['media'] = media_list
            
            return {
                'statusCode': 201,
                'headers': headers,
                'isBase64Encoded': False,
                'body': json.dumps({'entry': entry}, default=str)
            }
        
        # GET /diary/plans - получить планы занятий
        if method == 'GET' and 'plans' in path:
            group_id = event.get('queryStringParameters', {}).get('group_id')
            
            if group_id:
                cur.execute(
                    "SELECT lp.*, u.name as trainer_name, sg.name as group_name "
                    "FROM lesson_plans lp "
                    "LEFT JOIN users u ON lp.trainer_id = u.id "
                    "LEFT JOIN student_groups sg ON lp.group_id = sg.id "
                    "WHERE lp.group_id = %s ORDER BY lp.lesson_date DESC",
                    (group_id,)
                )
            else:
                cur.execute(
                    "SELECT lp.*, u.name as trainer_name, sg.name as group_name "
                    "FROM lesson_plans lp "
                    "LEFT JOIN users u ON lp.trainer_id = u.id "
                    "LEFT JOIN student_groups sg ON lp.group_id = sg.id "
                    "ORDER BY lp.lesson_date DESC LIMIT 50"
                )
            
            plans = cur.fetchall()
            
            return {
                'statusCode': 200,
                'headers': headers,
                'isBase64Encoded': False,
                'body': json.dumps({'plans': plans}, default=str)
            }
        
        # POST /diary/plans - создать план занятия (только тренер)
        if method == 'POST' and 'plans' in path:
            if user_role not in ['trainer', 'director']:
                return {
                    'statusCode': 403,
                    'headers': headers,
                    'isBase64Encoded': False,
                    'body': json.dumps({'error': 'Только тренер может создавать планы'})
                }
            
            body_data = json.loads(event.get('body', '{}'))
            
            cur.execute(
                "INSERT INTO lesson_plans (group_id, trainer_id, lesson_date, topic, description, goals, materials, status) "
                "VALUES (%s, %s, %s, %s, %s, %s, %s, %s) RETURNING *",
                (
                    body_data['group_id'],
                    user_id,
                    body_data['lesson_date'],
                    body_data['topic'],
                    body_data.get('description'),
                    body_data.get('goals'),
                    body_data.get('materials'),
                    body_data.get('status', 'planned')
                )
            )
            plan = cur.fetchone()
            conn.commit()
            
            return {
                'statusCode': 201,
                'headers': headers,
                'isBase64Encoded': False,
                'body': json.dumps({'plan': plan}, default=str)
            }
        
        # GET /diary/students - получить список учеников
        if method == 'GET' and 'students' in path:
            if user_role == 'director':
                cur.execute("SELECT * FROM users WHERE role = 'student' ORDER BY name")
            elif user_role == 'trainer':
                # Тренер видит только своих учеников
                cur.execute(
                    "SELECT DISTINCT u.* FROM users u "
                    "JOIN student_group_members sgm ON u.id = sgm.student_id "
                    "JOIN student_groups sg ON sgm.group_id = sg.id "
                    "WHERE sg.trainer_id = %s AND u.role = 'student' ORDER BY u.name",
                    (user_id,)
                )
            else:
                cur.execute("SELECT * FROM users WHERE id = %s", (user_id,))
            
            students = cur.fetchall()
            
            return {
                'statusCode': 200,
                'headers': headers,
                'isBase64Encoded': False,
                'body': json.dumps({'students': students}, default=str)
            }
        
        # GET /diary/groups - получить группы
        if method == 'GET' and 'groups' in path:
            if user_role == 'director':
                cur.execute(
                    "SELECT sg.*, u.name as trainer_name FROM student_groups sg "
                    "LEFT JOIN users u ON sg.trainer_id = u.id ORDER BY sg.name"
                )
            elif user_role == 'trainer':
                cur.execute(
                    "SELECT sg.*, u.name as trainer_name FROM student_groups sg "
                    "LEFT JOIN users u ON sg.trainer_id = u.id "
                    "WHERE sg.trainer_id = %s ORDER BY sg.name",
                    (user_id,)
                )
            else:
                # Ученик видит только свои группы
                cur.execute(
                    "SELECT sg.*, u.name as trainer_name FROM student_groups sg "
                    "LEFT JOIN users u ON sg.trainer_id = u.id "
                    "JOIN student_group_members sgm ON sg.id = sgm.group_id "
                    "WHERE sgm.student_id = %s ORDER BY sg.name",
                    (user_id,)
                )
            
            groups = cur.fetchall()
            
            return {
                'statusCode': 200,
                'headers': headers,
                'isBase64Encoded': False,
                'body': json.dumps({'groups': groups}, default=str)
            }
        
        cur.close()
        conn.close()
        
        return {
            'statusCode': 404,
            'headers': headers,
            'isBase64Encoded': False,
            'body': json.dumps({'error': 'Endpoint not found'})
        }
        
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': headers,
            'isBase64Encoded': False,
            'body': json.dumps({'error': str(e)})
        }
