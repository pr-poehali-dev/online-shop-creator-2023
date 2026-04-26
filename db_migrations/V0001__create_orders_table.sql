
CREATE TABLE t_p19686366_online_shop_creator_.orders (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMP DEFAULT NOW(),

    -- Контакт клиента
    client_name VARCHAR(200),
    client_phone VARCHAR(30),
    client_email VARCHAR(200),

    -- Заказ
    total_amount INTEGER NOT NULL,
    bonus_discount INTEGER DEFAULT 0,
    promo_discount INTEGER DEFAULT 0,
    promo_code VARCHAR(50),
    final_amount INTEGER NOT NULL,
    payment_method VARCHAR(100),
    bonuses_earned INTEGER DEFAULT 0,

    -- Статус
    status VARCHAR(50) DEFAULT 'new',

    -- Товары (JSON массив)
    items JSONB NOT NULL
);

CREATE INDEX idx_orders_phone ON t_p19686366_online_shop_creator_.orders (client_phone);
CREATE INDEX idx_orders_created ON t_p19686366_online_shop_creator_.orders (created_at DESC);
CREATE INDEX idx_orders_status ON t_p19686366_online_shop_creator_.orders (status);
