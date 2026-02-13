"""API для Kinetic Universe — управление персонажами, трюками, кинетиками. Сохранение прогресса в БД."""

import json
import os
from typing import Dict, Any
from datetime import datetime
import psycopg2
from psycopg2.extras import RealDictCursor

def get_db():
    return psycopg2.connect(os.environ['DATABASE_URL'], cursor_factory=RealDictCursor)

def resp(status, body):
    return {
        'statusCode': status,
        'headers': {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        },
        'body': json.dumps(body, default=str)
    }

def handler(event: Dict[str, Any], context) -> Dict[str, Any]:
    method = event.get('httpMethod', 'GET')

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

    headers = event.get('headers', {})
    user_id = headers.get('X-User-Id', '')
    user_role = headers.get('X-Role', 'client')
    qs = event.get('queryStringParameters', {}) or {}
    body = json.loads(event.get('body', '{}') or '{}')
    action = qs.get('action', body.get('action', ''))

    conn = get_db()
    cur = conn.cursor()

    # GET ?action=my_character&user_id=xxx
    if method == 'GET' and action == 'my_character':
        uid = qs.get('user_id', user_id)
        cur.execute("SELECT * FROM characters WHERE user_id = %s", (uid,))
        char = cur.fetchone()
        conn.close()
        if not char:
            return resp(404, {'error': 'not_found'})
        return resp(200, {'character': char})

    # GET ?action=all_characters
    if method == 'GET' and action == 'all_characters':
        cur.execute("SELECT * FROM characters ORDER BY level DESC, experience DESC LIMIT 100")
        chars = cur.fetchall()
        conn.close()
        return resp(200, {'characters': chars})

    # GET ?action=tricks&sport_type=skate
    if method == 'GET' and action == 'tricks':
        sport = qs.get('sport_type', '')
        if sport:
            cur.execute("SELECT * FROM tricks WHERE sport_type = %s ORDER BY difficulty, id", (sport,))
        else:
            cur.execute("SELECT * FROM tricks ORDER BY sport_type, difficulty, id")
        tricks = cur.fetchall()
        conn.close()
        return resp(200, {'tricks': tricks})

    # GET ?action=mastered_tricks&character_id=xxx
    if method == 'GET' and action == 'mastered_tricks':
        char_id = qs.get('character_id', '')
        cur.execute(
            "SELECT ct.*, t.name, t.sport_type, t.category, t.difficulty, t.experience_reward, t.kinetics_reward, t.description "
            "FROM character_tricks ct JOIN tricks t ON ct.trick_id = t.id "
            "WHERE ct.character_id = %s", (char_id,)
        )
        mastered = cur.fetchall()
        conn.close()
        return resp(200, {'mastered_tricks': mastered})

    # POST action=create_character
    if method == 'POST' and action == 'create_character':
        cur.execute("SELECT id FROM characters WHERE user_id = %s", (body['user_id'],))
        if cur.fetchone():
            conn.close()
            return resp(400, {'error': 'character_exists'})

        cur.execute(
            "INSERT INTO characters (user_id, name, sport_type, riding_style, body_type, hairstyle, hair_color, avatar_url, kinetics) "
            "VALUES (%s, %s, %s, %s, %s, %s, %s, %s, 100) RETURNING *",
            (
                body['user_id'], body['name'], body['sport_type'], body.get('riding_style', 'freestyle'),
                body.get('body_type', 1), body.get('hairstyle', 1), body.get('hair_color', '#000000'),
                body.get('avatar_url', '')
            )
        )
        char = cur.fetchone()
        conn.commit()
        conn.close()
        return resp(201, {'character': char})

    # POST action=update_character
    if method == 'POST' and action == 'update_character':
        fields = []
        values = []
        for key in ['name', 'level', 'experience', 'balance', 'speed', 'courage', 'kinetics', 'avatar_url', 'body_type', 'hairstyle', 'hair_color']:
            if key in body:
                fields.append(f"{key} = %s")
                values.append(body[key])
        if not fields:
            conn.close()
            return resp(400, {'error': 'no_fields'})
        fields.append("updated_at = NOW()")
        values.append(body.get('character_id', 0))
        cur.execute(f"UPDATE characters SET {', '.join(fields)} WHERE id = %s RETURNING *", values)
        char = cur.fetchone()
        conn.commit()
        conn.close()
        return resp(200, {'character': char})

    # POST action=add_kinetics (admin)
    if method == 'POST' and action == 'add_kinetics':
        char_id = body['character_id']
        amount = body['amount']
        source = body.get('source', 'admin')
        desc = body.get('description', '')
        created_by = body.get('created_by', user_id)
        tx_type = 'earn' if amount > 0 else 'spend'

        cur.execute(
            "UPDATE characters SET kinetics = kinetics + %s, updated_at = NOW() WHERE id = %s RETURNING *",
            (amount, char_id)
        )
        char = cur.fetchone()
        if not char:
            conn.close()
            return resp(404, {'error': 'character_not_found'})

        cur.execute(
            "INSERT INTO kinetics_transactions (character_id, amount, transaction_type, source, description, created_by) "
            "VALUES (%s, %s, %s, %s, %s, %s) RETURNING *",
            (char_id, amount, tx_type, source, desc, created_by)
        )
        tx = cur.fetchone()
        conn.commit()
        conn.close()
        return resp(200, {'character': char, 'transaction': tx})

    # POST action=confirm_tricks (admin)
    if method == 'POST' and action == 'confirm_tricks':
        char_id = body['character_id']
        trick_ids = body['trick_ids']
        confirmed_by = body.get('confirmed_by', user_id)

        total_exp = 0
        total_kin = 0

        for tid in trick_ids:
            cur.execute("SELECT * FROM tricks WHERE id = %s", (tid,))
            trick = cur.fetchone()
            if not trick:
                continue
            cur.execute(
                "INSERT INTO character_tricks (character_id, trick_id, confirmed_by) "
                "VALUES (%s, %s, %s) ON CONFLICT (character_id, trick_id) DO NOTHING RETURNING id",
                (char_id, tid, confirmed_by)
            )
            inserted = cur.fetchone()
            if inserted:
                total_exp += trick['experience_reward']
                total_kin += trick['kinetics_reward']

        if total_exp > 0 or total_kin > 0:
            cur.execute(
                "UPDATE characters SET experience = experience + %s, kinetics = kinetics + %s, "
                "level = LEAST(FLOOR((experience + %s) / 100) + 1, 100), updated_at = NOW() "
                "WHERE id = %s RETURNING *",
                (total_exp, total_kin, total_exp, char_id)
            )
            char = cur.fetchone()

            cur.execute(
                "INSERT INTO kinetics_transactions (character_id, amount, transaction_type, source, description, created_by) "
                "VALUES (%s, %s, 'earn', 'tricks', %s, %s)",
                (char_id, total_kin, f'Подтверждено {len(trick_ids)} трюков', confirmed_by)
            )
        else:
            cur.execute("SELECT * FROM characters WHERE id = %s", (char_id,))
            char = cur.fetchone()

        conn.commit()
        conn.close()
        return resp(200, {'character': char, 'total_exp': total_exp, 'total_kinetics': total_kin})

    # POST action=game_complete
    if method == 'POST' and action == 'game_complete':
        char_id = body['character_id']
        earned_xp = body.get('earned_xp', 0)
        earned_kin = body.get('earned_kinetics', 0)
        game_name = body.get('game_name', 'game')

        cur.execute(
            "UPDATE characters SET experience = experience + %s, kinetics = kinetics + %s, "
            "level = LEAST(FLOOR((experience + %s) / 100) + 1, 100), updated_at = NOW() "
            "WHERE id = %s RETURNING *",
            (earned_xp, earned_kin, earned_xp, char_id)
        )
        char = cur.fetchone()
        if not char:
            conn.close()
            return resp(404, {'error': 'character_not_found'})

        if earned_kin > 0:
            cur.execute(
                "INSERT INTO kinetics_transactions (character_id, amount, transaction_type, source, description) "
                "VALUES (%s, %s, 'earn', %s, %s)",
                (char_id, earned_kin, game_name, f'Награда за игру: {game_name}')
            )

        conn.commit()
        conn.close()
        return resp(200, {'character': char})

    # GET ?action=transactions&character_id=xxx
    if method == 'GET' and action == 'transactions':
        char_id = qs.get('character_id', '')
        cur.execute(
            "SELECT * FROM kinetics_transactions WHERE character_id = %s ORDER BY created_at DESC LIMIT 50",
            (char_id,)
        )
        txs = cur.fetchall()
        conn.close()
        return resp(200, {'transactions': txs})

    conn.close()
    return resp(404, {'error': 'unknown_action'})