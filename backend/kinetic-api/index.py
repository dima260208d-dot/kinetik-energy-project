"""API для Kinetic Universe — персонажи, трюки, турниры, покупки, тренировки, профили."""

import json
import os
from datetime import datetime, timedelta, date
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

def create_notification(cur, character_id, title, message, ntype='info', data=None):
    cur.execute(
        "INSERT INTO character_notifications (character_id, title, message, notification_type, data) "
        "VALUES (%s, %s, %s, %s, %s)",
        (character_id, title, message, ntype, json.dumps(data) if data else None)
    )

def get_current_week():
    today = date.today()
    monday = today - timedelta(days=today.weekday())
    sunday = monday + timedelta(days=6)
    return monday, sunday

def get_or_create_tournament(cur):
    monday, sunday = get_current_week()
    month_key = monday.strftime('%Y-%m')
    cur.execute("SELECT * FROM tournaments WHERE week_start = %s", (monday,))
    tournament = cur.fetchone()
    if not tournament:
        cur.execute(
            "INSERT INTO tournaments (week_start, week_end, month_key, status) "
            "VALUES (%s, %s, %s, 'active') RETURNING *",
            (monday, sunday, month_key)
        )
        tournament = cur.fetchone()
        cur.execute("SELECT id FROM characters")
        all_chars = cur.fetchall()
        for ch in all_chars:
            create_notification(cur, ch['id'],
                'Новый турнир начался!',
                f'Еженедельный турнир {monday.strftime("%d.%m")} - {sunday.strftime("%d.%m")}. Вступи за 100 кинетиков!',
                'tournament', {'tournament_id': tournament['id']})
    return tournament

def recalc_tournament_scores(cur, tournament_id):
    cur.execute("SELECT * FROM tournament_entries WHERE tournament_id = %s", (tournament_id,))
    entries = cur.fetchall()
    cur.execute("SELECT * FROM tournaments WHERE id = %s", (tournament_id,))
    t = cur.fetchone()
    if not t:
        return
    ws = t['week_start']
    we = t['week_end'] + timedelta(days=1)

    for entry in entries:
        cid = entry['character_id']
        cur.execute(
            "SELECT COUNT(*) as cnt FROM game_results WHERE character_id = %s AND created_at >= %s AND created_at < %s",
            (cid, ws, we)
        )
        games = cur.fetchone()['cnt']
        cur.execute(
            "SELECT COUNT(*) as cnt FROM character_tricks WHERE character_id = %s AND confirmed_at >= %s AND confirmed_at < %s",
            (cid, ws, we)
        )
        tricks = cur.fetchone()['cnt']
        cur.execute(
            "SELECT COUNT(*) as cnt FROM training_visits WHERE character_id = %s AND visit_date >= %s AND visit_date <= %s",
            (cid, ws, t['week_end'])
        )
        trainings = cur.fetchone()['cnt']

        total = games * 10 + tricks * 25 + trainings * 30
        cur.execute(
            "UPDATE tournament_entries SET games_score=%s, tricks_score=%s, training_score=%s, score=%s WHERE id=%s",
            (games * 10, tricks * 25, trainings * 30, total, entry['id'])
        )

    cur.execute(
        "SELECT id FROM tournament_entries WHERE tournament_id = %s ORDER BY score DESC",
        (tournament_id,)
    )
    rows = cur.fetchall()
    for i, row in enumerate(rows):
        cur.execute("UPDATE tournament_entries SET rank = %s WHERE id = %s", (i + 1, row['id']))

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
                    cur.execute("UPDATE characters SET kinetics = kinetics + %s WHERE id = %s", (ach['reward_kinetics'], character_id))
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


def handler(event, context):
    """Kinetic Universe API"""
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

    qs = event.get('queryStringParameters', {}) or {}
    body = json.loads(event.get('body', '{}') or '{}')
    action = qs.get('action', body.get('action', ''))

    conn = get_db()
    cur = conn.cursor()

    # === GET ENDPOINTS ===

    if method == 'GET' and action == 'my_character':
        uid = qs.get('user_id', '')
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
            result.append({**ach, 'is_earned': is_earned, 'earned_at': str(earned[ach['id']]) if is_earned else None, 'progress': progress})
        conn.close()
        return resp(200, {'achievements': result})

    if method == 'GET' and action == 'purchased_items':
        char_id = qs.get('character_id', '')
        cur.execute("SELECT * FROM purchased_items WHERE character_id = %s ORDER BY purchased_at DESC", (char_id,))
        items = cur.fetchall()
        conn.close()
        return resp(200, {'items': items})

    if method == 'GET' and action == 'current_tournament':
        tournament = get_or_create_tournament(cur)
        cur.execute(
            "SELECT te.*, c.name as character_name, c.avatar_url, c.sport_type, c.level "
            "FROM tournament_entries te JOIN characters c ON te.character_id = c.id "
            "WHERE te.tournament_id = %s ORDER BY te.score DESC, te.joined_at ASC",
            (tournament['id'],)
        )
        entries = cur.fetchall()
        conn.commit()
        conn.close()
        return resp(200, {'tournament': tournament, 'entries': entries})

    if method == 'GET' and action == 'leaderboard':
        period = qs.get('period', 'weekly')
        if period == 'weekly':
            monday, sunday = get_current_week()
            cur.execute(
                "SELECT te.*, c.name as character_name, c.avatar_url, c.sport_type, c.level "
                "FROM tournament_entries te "
                "JOIN tournaments t ON te.tournament_id = t.id "
                "JOIN characters c ON te.character_id = c.id "
                "WHERE t.week_start = %s ORDER BY te.score DESC LIMIT 50",
                (monday,)
            )
        else:
            month_key = date.today().strftime('%Y-%m')
            cur.execute(
                "SELECT c.id as character_id, c.name as character_name, c.avatar_url, c.sport_type, c.level, "
                "SUM(te.score) as score, SUM(te.games_score) as games_score, "
                "SUM(te.tricks_score) as tricks_score, SUM(te.training_score) as training_score "
                "FROM tournament_entries te "
                "JOIN tournaments t ON te.tournament_id = t.id "
                "JOIN characters c ON te.character_id = c.id "
                "WHERE t.month_key = %s "
                "GROUP BY c.id, c.name, c.avatar_url, c.sport_type, c.level "
                "ORDER BY score DESC LIMIT 50",
                (month_key,)
            )
        entries = cur.fetchall()
        conn.close()
        return resp(200, {'entries': entries, 'period': period})

    if method == 'GET' and action == 'public_profile':
        char_id = qs.get('character_id', '')
        cur.execute("SELECT id, user_id, name, sport_type, sport_types, riding_style, level, experience, balance, speed, courage, body_type, hairstyle, hair_color, avatar_url, kinetics, games_won, games_played, age, trainer_name, created_at FROM characters WHERE id = %s", (char_id,))
        char = cur.fetchone()
        if not char:
            conn.close()
            return resp(404, {'error': 'not_found'})
        cur.execute("SELECT COUNT(*) as cnt FROM character_tricks WHERE character_id = %s", (char_id,))
        tricks_count = cur.fetchone()['cnt']
        cur.execute("SELECT achievement_id FROM character_achievements WHERE character_id = %s", (char_id,))
        achievements_count = len(cur.fetchall())
        cur.execute("SELECT COUNT(*) as cnt FROM training_visits WHERE character_id = %s", (char_id,))
        training_count = cur.fetchone()['cnt']
        cur.execute(
            "SELECT te.score, te.rank, t.week_start, t.week_end "
            "FROM tournament_entries te JOIN tournaments t ON te.tournament_id = t.id "
            "WHERE te.character_id = %s ORDER BY t.week_start DESC LIMIT 10",
            (char_id,)
        )
        tournament_history = cur.fetchall()
        conn.close()
        return resp(200, {
            'character': char,
            'stats': {
                'tricks_learned': tricks_count,
                'achievements_earned': achievements_count,
                'training_visits': training_count,
                'tournament_history': tournament_history
            }
        })

    if method == 'GET' and action == 'training_visits':
        char_id = qs.get('character_id', '')
        cur.execute("SELECT * FROM training_visits WHERE character_id = %s ORDER BY visit_date DESC LIMIT 100", (char_id,))
        visits = cur.fetchall()
        conn.close()
        return resp(200, {'visits': visits})

    # === POST ENDPOINTS ===

    if method == 'POST' and action == 'create_character':
        cur.execute("SELECT id FROM characters WHERE user_id = %s", (body['user_id'],))
        if cur.fetchone():
            conn.close()
            return resp(400, {'error': 'character_exists'})
        sport = body['sport_type']
        age = body.get('age')
        cur.execute(
            "INSERT INTO characters (user_id, name, sport_type, riding_style, body_type, hairstyle, hair_color, avatar_url, kinetics, sport_types, age) "
            "VALUES (%s, %s, %s, %s, %s, %s, %s, %s, 100, %s, %s) RETURNING *",
            (
                body['user_id'], body['name'], sport, body.get('riding_style', 'freestyle'),
                body.get('body_type', 1), body.get('hairstyle', 1), body.get('hair_color', '#000000'),
                body.get('avatar_url', ''), [sport], age
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
        for key in ['name', 'level', 'experience', 'balance', 'speed', 'courage', 'kinetics', 'avatar_url', 'body_type', 'hairstyle', 'hair_color', 'age', 'trainer_name']:
            if key in body:
                fields.append(f"{key} = %s")
                values.append(body[key])
        if 'sport_types' in body:
            fields.append("sport_types = %s")
            values.append(body['sport_types'])
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
        created_by = body.get('created_by', '')
        tx_type = 'earn' if amount > 0 else 'spend'
        cur.execute("UPDATE characters SET kinetics = kinetics + %s, updated_at = NOW() WHERE id = %s RETURNING *", (amount, char_id))
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
            create_notification(cur, char_id, f'+{amount} кинетиков!', desc or 'Начисление кинетиков', 'kinetics')
        else:
            create_notification(cur, char_id, f'{amount} кинетиков', desc or 'Списание кинетиков', 'kinetics')
        conn.commit()
        conn.close()
        return resp(200, {'character': char, 'transaction': tx})

    if method == 'POST' and action == 'confirm_tricks':
        char_id = body['character_id']
        trick_ids = body['trick_ids']
        confirmed_by = body.get('confirmed_by', '')
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
            create_notification(cur, char_id, f'Подтверждено {len(trick_ids)} трюков!', f'+{total_exp} XP, +{total_kin} кинетиков', 'tricks')
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
            cur.execute(f"UPDATE character_notifications SET is_read = true WHERE id IN ({placeholders}) AND character_id = %s", notif_ids + [char_id])
        else:
            cur.execute("UPDATE character_notifications SET is_read = true WHERE character_id = %s AND is_read = false", (char_id,))
        conn.commit()
        conn.close()
        return resp(200, {'ok': True})

    if method == 'POST' and action == 'purchase_item':
        char_id = body['character_id']
        item_type = body['item_type']
        item_value = str(body.get('item_value', ''))
        item_name = body.get('item_name', item_type)
        cost = body.get('cost', 0)

        cur.execute("SELECT * FROM characters WHERE id = %s", (char_id,))
        char = cur.fetchone()
        if not char:
            conn.close()
            return resp(404, {'error': 'character_not_found'})
        if char['kinetics'] < cost:
            conn.close()
            return resp(400, {'error': 'not_enough_kinetics', 'needed': cost, 'have': char['kinetics']})

        cur.execute(
            "SELECT id FROM purchased_items WHERE character_id = %s AND item_type = %s AND item_value = %s",
            (char_id, item_type, item_value)
        )
        if cur.fetchone():
            conn.close()
            return resp(400, {'error': 'already_purchased'})

        cur.execute(
            "INSERT INTO purchased_items (character_id, item_type, item_value, item_name, cost) "
            "VALUES (%s, %s, %s, %s, %s) RETURNING *",
            (char_id, item_type, item_value, item_name, cost)
        )
        item = cur.fetchone()

        cur.execute("UPDATE characters SET kinetics = kinetics - %s, updated_at = NOW() WHERE id = %s RETURNING *", (cost, char_id))
        char = cur.fetchone()

        cur.execute(
            "INSERT INTO kinetics_transactions (character_id, amount, transaction_type, source, description) "
            "VALUES (%s, %s, 'spend', 'shop', %s)",
            (char_id, -cost, f'Покупка: {item_name}')
        )
        create_notification(cur, char_id, f'Покупка: {item_name}!', f'Куплено за {cost} кинетиков', 'purchase')
        conn.commit()
        conn.close()
        return resp(200, {'character': char, 'item': item})

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
            return resp(400, {'error': 'not_enough_kinetics'})

        cur.execute(
            "SELECT id FROM purchased_items WHERE character_id = %s AND item_type = %s AND item_value = %s",
            (char_id, item_type, str(item_value))
        )
        already_owned = cur.fetchone()

        actual_cost = 0 if already_owned else cost

        if actual_cost > 0:
            cur.execute(
                "INSERT INTO purchased_items (character_id, item_type, item_value, item_name, cost) "
                "VALUES (%s, %s, %s, %s, %s) ON CONFLICT (character_id, item_type, item_value) DO NOTHING",
                (char_id, item_type, str(item_value), f'{item_type}:{item_value}', actual_cost)
            )

        update_field = None
        if item_type == 'hairstyle':
            update_field = 'hairstyle'
        elif item_type == 'hair_color':
            update_field = 'hair_color'
        elif item_type == 'body_type':
            update_field = 'body_type'
        elif item_type == 'name':
            update_field = 'name'
        elif item_type == 'avatar_url':
            update_field = 'avatar_url'

        if not update_field:
            conn.close()
            return resp(400, {'error': 'invalid_item_type'})

        if actual_cost > 0:
            cur.execute(
                f"UPDATE characters SET {update_field} = %s, kinetics = kinetics - %s, updated_at = NOW() WHERE id = %s RETURNING *",
                (item_value, actual_cost, char_id)
            )
            cur.execute(
                "INSERT INTO kinetics_transactions (character_id, amount, transaction_type, source, description) "
                "VALUES (%s, %s, 'spend', 'shop', %s)",
                (char_id, -actual_cost, f'Покупка: {item_type}')
            )
            create_notification(cur, char_id, 'Покупка в магазине!', f'Вы изменили {item_type} за {actual_cost} кинетиков', 'purchase')
        else:
            cur.execute(
                f"UPDATE characters SET {update_field} = %s, updated_at = NOW() WHERE id = %s RETURNING *",
                (item_value, char_id)
            )

        char = cur.fetchone()
        conn.commit()
        conn.close()
        return resp(200, {'character': char, 'was_free': already_owned is not None})

    if method == 'POST' and action == 'add_sport':
        char_id = body['character_id']
        new_sport = body['sport_type']
        cost = body.get('cost', 100)

        cur.execute("SELECT * FROM characters WHERE id = %s", (char_id,))
        char = cur.fetchone()
        if not char:
            conn.close()
            return resp(404, {'error': 'character_not_found'})

        current_sports = char.get('sport_types') or [char['sport_type']]
        if new_sport in current_sports:
            conn.close()
            return resp(400, {'error': 'sport_already_added'})

        if char['kinetics'] < cost:
            conn.close()
            return resp(400, {'error': 'not_enough_kinetics'})

        new_sports = current_sports + [new_sport]
        cur.execute(
            "UPDATE characters SET sport_types = %s, kinetics = kinetics - %s, updated_at = NOW() WHERE id = %s RETURNING *",
            (new_sports, cost, char_id)
        )
        char = cur.fetchone()

        cur.execute(
            "INSERT INTO kinetics_transactions (character_id, amount, transaction_type, source, description) "
            "VALUES (%s, %s, 'spend', 'shop', %s)",
            (char_id, -cost, f'Добавлен вид спорта: {new_sport}')
        )
        create_notification(cur, char_id, f'Новый вид спорта!', f'Добавлен {new_sport}. Новые трюки уже ждут тебя!', 'info')
        conn.commit()
        conn.close()
        return resp(200, {'character': char})

    if method == 'POST' and action == 'join_tournament':
        char_id = body['character_id']
        tournament = get_or_create_tournament(cur)
        tid = tournament['id']

        cur.execute("SELECT id FROM tournament_entries WHERE tournament_id = %s AND character_id = %s", (tid, char_id))
        if cur.fetchone():
            conn.commit()
            conn.close()
            return resp(400, {'error': 'already_joined'})

        fee = tournament['entry_fee']
        cur.execute("SELECT kinetics FROM characters WHERE id = %s", (char_id,))
        char = cur.fetchone()
        if not char or char['kinetics'] < fee:
            conn.commit()
            conn.close()
            return resp(400, {'error': 'not_enough_kinetics'})

        cur.execute("UPDATE characters SET kinetics = kinetics - %s, updated_at = NOW() WHERE id = %s RETURNING *", (fee, char_id))
        char = cur.fetchone()
        cur.execute(
            "INSERT INTO tournament_entries (tournament_id, character_id) VALUES (%s, %s) RETURNING *",
            (tid, char_id)
        )
        entry = cur.fetchone()

        cur.execute(
            "INSERT INTO kinetics_transactions (character_id, amount, transaction_type, source, description) "
            "VALUES (%s, %s, 'spend', 'tournament', %s)",
            (char_id, -fee, f'Вступление в турнир #{tid}')
        )
        create_notification(cur, char_id, 'Турнир!', f'Вы вступили в еженедельный турнир!', 'tournament')

        recalc_tournament_scores(cur, tid)
        conn.commit()
        conn.close()
        return resp(200, {'character': char, 'entry': entry})

    if method == 'POST' and action == 'add_training_visit':
        char_id = body['character_id']
        visit_date = body.get('visit_date', str(date.today()))
        confirmed_by = body.get('confirmed_by', '')
        notes = body.get('notes', '')

        cur.execute(
            "INSERT INTO training_visits (character_id, visit_date, confirmed_by, notes) "
            "VALUES (%s, %s, %s, %s) RETURNING *",
            (char_id, visit_date, confirmed_by, notes)
        )
        visit = cur.fetchone()
        create_notification(cur, char_id, 'Тренировка засчитана!', f'Посещение тренировки {visit_date} зачислено', 'info')
        conn.commit()
        conn.close()
        return resp(200, {'visit': visit})

    if method == 'POST' and action == 'set_trainer':
        char_id = body['character_id']
        trainer_name = body.get('trainer_name', '')
        cur.execute("UPDATE characters SET trainer_name = %s, updated_at = NOW() WHERE id = %s RETURNING *", (trainer_name, char_id))
        char = cur.fetchone()
        conn.commit()
        conn.close()
        return resp(200, {'character': char})

    if method == 'POST' and action == 'set_age':
        char_id = body['character_id']
        age = body.get('age', 0)
        cur.execute("UPDATE characters SET age = %s, updated_at = NOW() WHERE id = %s RETURNING *", (age, char_id))
        char = cur.fetchone()
        conn.commit()
        conn.close()
        return resp(200, {'character': char})

    if method == 'POST' and action == 'send_weekly_results':
        monday, sunday = get_current_week()
        prev_monday = monday - timedelta(days=7)
        cur.execute("SELECT * FROM tournaments WHERE week_start = %s", (prev_monday,))
        prev_tournament = cur.fetchone()
        if not prev_tournament:
            conn.close()
            return resp(404, {'error': 'no_previous_tournament'})

        recalc_tournament_scores(cur, prev_tournament['id'])

        cur.execute(
            "SELECT te.*, c.name as character_name FROM tournament_entries te "
            "JOIN characters c ON te.character_id = c.id "
            "WHERE te.tournament_id = %s ORDER BY te.score DESC",
            (prev_tournament['id'],)
        )
        entries = cur.fetchall()
        for entry in entries:
            data = {
                'type': 'weekly_results',
                'tournament_id': prev_tournament['id'],
                'rank': entry['rank'],
                'score': entry['score'],
                'games_score': entry['games_score'],
                'tricks_score': entry['tricks_score'],
                'training_score': entry['training_score'],
                'total_participants': len(entries),
                'week': f"{prev_monday.strftime('%d.%m')} - {(prev_monday + timedelta(days=6)).strftime('%d.%m')}"
            }
            place = entry['rank'] or 0
            create_notification(cur, entry['character_id'],
                f'Итоги недели: {place} место!',
                f'Турнир {prev_monday.strftime("%d.%m")} - {(prev_monday + timedelta(days=6)).strftime("%d.%m")}: {entry["score"]} очков',
                'weekly_results', data)

        conn.commit()
        conn.close()
        return resp(200, {'sent': len(entries)})

    if method == 'GET' and action == 'accessories':
        char_id = qs.get('character_id', '')
        cur.execute("SELECT * FROM accessories WHERE is_available = true ORDER BY price")
        items = cur.fetchall()
        if char_id:
            cur.execute("SELECT accessory_id, is_equipped FROM character_accessories WHERE character_id = %s", (char_id,))
            owned = {r['accessory_id']: r['is_equipped'] for r in cur.fetchall()}
            for item in items:
                item['owned'] = item['id'] in owned
                item['equipped'] = owned.get(item['id'], False)
        conn.close()
        return resp(200, {'accessories': items})

    if method == 'POST' and action == 'buy_accessory':
        char_id = body['character_id']
        acc_id = body['accessory_id']

        cur.execute("SELECT * FROM characters WHERE id = %s", (char_id,))
        char = cur.fetchone()
        if not char:
            conn.close()
            return resp(404, {'error': 'character_not_found'})

        cur.execute("SELECT * FROM accessories WHERE id = %s AND is_available = true", (acc_id,))
        acc = cur.fetchone()
        if not acc:
            conn.close()
            return resp(404, {'error': 'accessory_not_found'})

        cur.execute("SELECT id FROM character_accessories WHERE character_id = %s AND accessory_id = %s", (char_id, acc_id))
        if cur.fetchone():
            conn.close()
            return resp(400, {'error': 'already_owned'})

        if char['kinetics'] < acc['price']:
            conn.close()
            return resp(400, {'error': 'not_enough_kinetics', 'needed': acc['price'], 'have': char['kinetics']})

        cur.execute("UPDATE characters SET kinetics = kinetics - %s, updated_at = NOW() WHERE id = %s RETURNING *", (acc['price'], char_id))
        char = cur.fetchone()
        cur.execute("INSERT INTO character_accessories (character_id, accessory_id) VALUES (%s, %s)", (char_id, acc_id))
        cur.execute(
            "INSERT INTO kinetics_transactions (character_id, amount, transaction_type, source, description) "
            "VALUES (%s, %s, 'spend', 'shop', %s)",
            (char_id, -acc['price'], f'Аксессуар: {acc["name"]}')
        )
        create_notification(cur, char_id, f'Новый аксессуар: {acc["name"]}!', f'{acc["description"]}', 'purchase')
        conn.commit()
        conn.close()
        return resp(200, {'character': char, 'accessory': acc})

    conn.close()
    return resp(404, {'error': 'unknown_action', 'action': action})