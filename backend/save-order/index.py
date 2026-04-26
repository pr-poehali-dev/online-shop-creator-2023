import json
import os
import psycopg2  # psycopg2-binary


def handler(event: dict, context) -> dict:
    """Сохраняет заказ в базу данных. Принимает данные заказа и контакты клиента."""

    if event.get("httpMethod") == "OPTIONS":
        return {
            "statusCode": 200,
            "headers": {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "POST, OPTIONS",
                "Access-Control-Allow-Headers": "Content-Type",
                "Access-Control-Max-Age": "86400",
            },
            "body": "",
        }

    body = json.loads(event.get("body") or "{}")

    client_name = body.get("client_name", "").strip()
    client_phone = body.get("client_phone", "").strip()
    client_email = body.get("client_email", "").strip() or None
    items = body.get("items", [])
    total_amount = int(body.get("total_amount", 0))
    bonus_discount = int(body.get("bonus_discount", 0))
    promo_discount = int(body.get("promo_discount", 0))
    promo_code = body.get("promo_code", None)
    final_amount = int(body.get("final_amount", 0))
    payment_method = body.get("payment_method", "")
    bonuses_earned = int(body.get("bonuses_earned", 0))

    if not client_phone or not items:
        return {
            "statusCode": 400,
            "headers": {"Access-Control-Allow-Origin": "*"},
            "body": json.dumps({"error": "Не указан телефон или список товаров"}),
        }

    conn = psycopg2.connect(os.environ["DATABASE_URL"])
    cur = conn.cursor()

    schema = "t_p19686366_online_shop_creator_"

    cur.execute(
        f"""
        INSERT INTO {schema}.orders
            (client_name, client_phone, client_email, items,
             total_amount, bonus_discount, promo_discount, promo_code,
             final_amount, payment_method, bonuses_earned, status)
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, 'new')
        RETURNING id, created_at
        """,
        (
            client_name, client_phone, client_email, json.dumps(items, ensure_ascii=False),
            total_amount, bonus_discount, promo_discount, promo_code,
            final_amount, payment_method, bonuses_earned,
        ),
    )
    row = cur.fetchone()
    conn.commit()
    cur.close()
    conn.close()

    return {
        "statusCode": 200,
        "headers": {"Access-Control-Allow-Origin": "*"},
        "body": json.dumps({
            "success": True,
            "order_id": row[0],
            "created_at": row[1].isoformat(),
        }),
    }