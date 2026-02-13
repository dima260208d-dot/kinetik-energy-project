"""API для Kinetic Universe — управление персонажами, трюками, кинетиками, уведомлениями, достижениями."""

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

def create_notification(cur, character_id, title, message, ntype='info'):
    cur.execute(
        "INSERT INTO character_notifications (character_id, title, message, notification_type) "
        "VALUES (%s, %s, %s, %s)",
        (character_id, title, message, ntype)
    )

def check_achievements(cur, character_id):
    cur.execute("SELECT * FROM characters WHERE id = %s", (character_id,))
    char = cur.fetchone()
    if not char:
        return []

    cur.execute("SELECT achievement_id FROM character_achievements WHERE character_id = %s", (character_id,))
    earned_ids = {r['achievement_id'] for r in cur.fetchall()}

    cur.execute("SELECT * FROM achievements ORDER BY id")
    all_achievements = cur.fetchall()

    cur.execute("SELECT COUNT(*) as cnt FROM character_tricks WHERE character_id = %s", (character_id,))
    tricks_count = cur.fetchone()['cnt']

    newly_earned = []
    for ach in all_achievements:
        if ach['id'] in earned_ids:
            continue

        met = False
        if ach['requirement_type'] == 'character_created':
            met = True
        elif ach['requirement_type'] == 'tricks_count':
            met = tricks_count >= ach['requirement_value']
        elif ach['requirement_type'] == 'level':
            met = char['level'] >= ach['requirement_value']
        elif ach['requirement_type'] == 'games_won':
            met = char.get('games_won', 0) >= ach['requirement_value']

        if met:
            cur.execute(
                "INSERT INTO character_achievements (character_id, achievement_id) VALUES (%s, %s) ON CONFLICT DO NOTHING RETURNING id",
                (character_id, ach['id'])
            )
            inserted = cur.fetchone()
            if inserted:
                newly_earned.append(ach)
                if ach['reward_kinetics'] > 0:
                    cur.execute(
                        "UPDATE characters SET kinetics = kinetics + %s WHERE id = %s",
                        (ach['reward_kinetics'], character_id)
                    )
                    cur.execute(
                        "INSERT INTO kinetics_transactions (character_id, amount, transaction_type, source, description) "
                        "VALUES (%s, %s, 'earn', 'achievement', %s)",
                        (character_id, ach['reward_kinetics'], f'Достижение: {ach["name"]}')
                    )
                create_notification(cur, character_id,
                    f'Достижение: {ach["name"]}!',
                    f'{ach["description"]}. Награда: +{ach["reward_kinetics"]} кинетиков',
                    'achievement')

    return newly_earned

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

    if method == 'GET' and action == 'my_character':
        uid = qs.get('user_id', user_id)
        cur.execute("SELECT * FROM characters WHERE user_id = %s", (uid,))
        char = cur.fetchone()
        conn.close()
        if not char:
            return resp(404, {'error': 'not_found'})
        return resp(200, {'character': char})

    if method == 'GET' and action == 'all_characters':
        cur.execute("SELECT * FROM characters ORDER BY level DESC, experience DESC LIMIT 100")
        chars = cur.fetchall()
        conn.close()
        return resp(200, {'characters': chars})

    if method == 'GET' and action == 'tricks':
        sport = qs.get('sport_type', '')
        if sport:
            cur.execute("SELECT * FROM tricks WHERE sport_type = %s ORDER BY difficulty, id", (sport,))
        else:
            cur.execute("SELECT * FROM tricks ORDER BY sport_type, difficulty, id")
        tricks = cur.fetchall()
        conn.close()
        return resp(200, {'tricks': tricks})

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

    if method == 'GET' and action == 'transactions':
        char_id = qs.get('character_id', '')
        cur.execute(
            "SELECT * FROM kinetics_transactions WHERE character_id = %s ORDER BY created_at DESC LIMIT 100",
            (char_id,)
        )
        txs = cur.fetchall()
        conn.close()
        return resp(200, {'transactions': txs})

    if method == 'GET' and action == 'notifications':
        char_id = qs.get('character_id', '')
        cur.execute(
            "SELECT * FROM character_notifications WHERE character_id = %s ORDER BY created_at DESC LIMIT 50",
            (char_id,)
        )
        notifs = cur.fetchall()
        cur.execute(
            "SELECT COUNT(*) as cnt FROM character_notifications WHERE character_id = %s AND is_read = false",
            (char_id,)
        )
        unread = cur.fetchone()['cnt']
        conn.close()
        return resp(200, {'notifications': notifs, 'unread_count': unread})

    if method == 'GET' and action == 'achievements':
        char_id = qs.get('character_id', '')
        cur.execute("SELECT * FROM achievements ORDER BY id")
        all_ach = cur.fetchall()
        cur.execute("SELECT achievement_id, earned_at FROM character_achievements WHERE character_id = %s", (char_id,))
        earned = {r['achievement_id']: r['earned_at'] for r in cur.fetchall()}

        cur.execute("SELECT COUNT(*) as cnt FROM character_tricks WHERE character_id = %s", (char_id,))
        tricks_count = cur.fetchone()['cnt']
        cur.execute("SELECT * FROM characters WHERE id = %s", (char_id,))
        char = cur.fetchone()

        result = []
        for ach in all_ach:
            is_earned = ach['id'] in earned
            progress = 0
            if ach['requirement_type'] == 'character_created':
                progress = 1
            elif ach['requirement_type'] == 'tricks_count':
                progress = min(tricks_count, ach['requirement_value'])
            elif ach['requirement_type'] == 'level':
                progress = min(char['level'] if char else 0, ach['requirement_value'])
            elif ach['requirement_type'] == 'games_won':
                progress = min(char.get('games_won', 0) if char else 0, ach['requirement_value'])

            result.append({
                **ach,
                'is_earned': is_earned,
                'earned_at': str(earned[ach['id']]) if is_earned else None,
                'progress': progress
            })

        conn.close()
        return resp(200, {'achievements': result})

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
        create_notification(cur, char['id'], 'Добро пожаловать!', f'Персонаж {char["name"]} создан! Тебе начислено 100 кинетиков.', 'welcome')
        check_achievements(cur, char['id'])
        conn.commit()
        conn.close()
        return resp(201, {'character': char})

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

        if amount > 0:
            create_notification(cur, char_id,
                f'+{amount} кинетиков!',
                desc or 'Начисление кинетиков',
                'kinetics')
        else:
            create_notification(cur, char_id,
                f'{amount} кинетиков',
                desc or 'Списание кинетиков',
                'kinetics')

        conn.commit()
        conn.close()
        return resp(200, {'character': char, 'transaction': tx})

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

            create_notification(cur, char_id,
                f'Подтверждено {len(trick_ids)} трюков!',
                f'+{total_exp} XP, +{total_kin} кинетиков',
                'tricks')
        else:
            cur.execute("SELECT * FROM characters WHERE id = %s", (char_id,))
            char = cur.fetchone()

        newly = check_achievements(cur, char_id)
        conn.commit()
        conn.close()
        return resp(200, {'character': char, 'total_exp': total_exp, 'total_kinetics': total_kin, 'new_achievements': newly})

    if method == 'POST' and action == 'game_complete':
        char_id = body['character_id']
        earned_xp = body.get('earned_xp', 0)
        earned_kin = body.get('earned_kinetics', 0)
        game_name = body.get('game_name', 'game')
        won = body.get('won', True)
        score = body.get('score', 0)

        won_increment = 1 if won else 0
        cur.execute(
            "UPDATE characters SET experience = experience + %s, kinetics = kinetics + %s, "
            "games_played = games_played + 1, games_won = games_won + %s, "
            "level = LEAST(FLOOR((experience + %s) / 100) + 1, 100), updated_at = NOW() "
            "WHERE id = %s RETURNING *",
            (earned_xp, earned_kin, won_increment, earned_xp, char_id)
        )
        char = cur.fetchone()

        cur.execute(
            "INSERT INTO game_results (character_id, game_name, won, earned_xp, earned_kinetics, score) "
            "VALUES (%s, %s, %s, %s, %s, %s)",
            (char_id, game_name, won, earned_xp, earned_kin, score)
        )

        if earned_kin > 0:
            cur.execute(
                "INSERT INTO kinetics_transactions (character_id, amount, transaction_type, source, description) "
                "VALUES (%s, %s, 'earn', 'game', %s)",
                (char_id, earned_kin, f'Мини-игра: {game_name}')
            )

        newly = check_achievements(cur, char_id)
        conn.commit()
        conn.close()
        return resp(200, {'character': char, 'new_achievements': newly})

    if method == 'POST' and action == 'mark_notifications_read':
        char_id = body['character_id']
        notif_ids = body.get('notification_ids', [])
        if notif_ids:
            placeholders = ','.join(['%s'] * len(notif_ids))
            cur.execute(
                f"UPDATE character_notifications SET is_read = true WHERE id IN ({placeholders}) AND character_id = %s",
                notif_ids + [char_id]
            )
        else:
            cur.execute(
                "UPDATE character_notifications SET is_read = true WHERE character_id = %s AND is_read = false",
                (char_id,)
            )
        conn.commit()
        conn.close()
        return resp(200, {'ok': True})

    if method == 'POST' and action == 'purchase_customization':
        char_id = body['character_id']
        item_type = body['item_type']
        item_value = body.get('item_value')
        cost = body.get('cost', 0)

        cur.execute("SELECT * FROM characters WHERE id = %s", (char_id,))
        char = cur.fetchone()
        if not char:
            conn.close()
            return resp(404, {'error': 'character_not_found'})

        if char['kinetics'] < cost:
            conn.close()
            return resp(400, {'error': 'not_enough_kinetics', 'needed': cost, 'have': char['kinetics']})

        update_field = None
        if item_type == 'hairstyle':
            update_field = 'hairstyle'
        elif item_type == 'hair_color':
            update_field = 'hair_color'
        elif item_type == 'body_type':
            update_field = 'body_type'
        elif item_type == 'name':
            update_field = 'name'
        elif item_type == 'sport_type':
            update_field = 'sport_type'
        elif item_type == 'avatar_url':
            update_field = 'avatar_url'

        if not update_field:
            conn.close()
            return resp(400, {'error': 'invalid_item_type'})

        cur.execute(
            f"UPDATE characters SET {update_field} = %s, kinetics = kinetics - %s, updated_at = NOW() WHERE id = %s RETURNING *",
            (item_value, cost, char_id)
        )
        char = cur.fetchone()

        cur.execute(
            "INSERT INTO kinetics_transactions (character_id, amount, transaction_type, source, description) "
            "VALUES (%s, %s, 'spend', 'shop', %s)",
            (char_id, -cost, f'Покупка: {item_type}')
        )

        create_notification(cur, char_id,
            'Покупка в магазине!',
            f'Вы изменили {item_type} за {cost} кинетиков',
            'purchase')

        conn.commit()
        conn.close()
        return resp(200, {'character': char})

    conn.close()
    return resp(404, {'error': 'unknown_action', 'action': action})
