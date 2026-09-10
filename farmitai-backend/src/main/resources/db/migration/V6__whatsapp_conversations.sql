CREATE TABLE whatsapp_accounts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL UNIQUE REFERENCES users (id) ON DELETE CASCADE,
    phone_number VARCHAR(20) NOT NULL UNIQUE,
    whatsapp_id VARCHAR(80),
    status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',
    linked_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT whatsapp_accounts_status_check CHECK (status IN ('ACTIVE', 'INACTIVE'))
);

CREATE TABLE conversations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users (id) ON DELETE CASCADE,
    channel VARCHAR(20) NOT NULL,
    started_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    last_message_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT conversations_channel_check CHECK (channel IN ('WHATSAPP', 'APP'))
);

CREATE INDEX conversations_user_id_idx ON conversations (user_id);
CREATE INDEX conversations_last_message_idx ON conversations (last_message_at DESC);
CREATE UNIQUE INDEX conversations_user_channel_idx ON conversations (user_id, channel);

CREATE TABLE messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    conversation_id UUID NOT NULL REFERENCES conversations (id) ON DELETE CASCADE,
    sender VARCHAR(20) NOT NULL,
    message_type VARCHAR(20) NOT NULL DEFAULT 'TEXT',
    content TEXT,
    media_url VARCHAR(1024),
    status VARCHAR(20) NOT NULL DEFAULT 'DELIVERED',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT messages_sender_check CHECK (sender IN ('FARMER', 'BOT', 'ADMIN', 'SYSTEM')),
    CONSTRAINT messages_type_check CHECK (message_type IN ('TEXT', 'IMAGE', 'AUDIO', 'DOCUMENT')),
    CONSTRAINT messages_status_check CHECK (status IN ('QUEUED', 'DELIVERED', 'FAILED', 'READ'))
);

CREATE INDEX messages_conversation_id_idx ON messages (conversation_id, created_at);
