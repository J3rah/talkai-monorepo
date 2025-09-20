-- Enable the pgvector extension if not already enabled
CREATE EXTENSION IF NOT EXISTS vector;

-- Create the faq_embeddings table
CREATE TABLE IF NOT EXISTS faq_embeddings (
    id BIGSERIAL PRIMARY KEY,
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    embedding vector(1536) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create an index for faster similarity search
CREATE INDEX IF NOT EXISTS faq_embeddings_embedding_idx ON faq_embeddings 
USING ivfflat (embedding vector_cosine_ops)
WITH (lists = 100);

-- Grant necessary permissions
GRANT SELECT ON faq_embeddings TO authenticated;
GRANT INSERT, UPDATE, DELETE ON faq_embeddings TO authenticated;

-- Insert some sample FAQs
INSERT INTO faq_embeddings (question, answer, embedding) VALUES
(
    'What is this service?',
    'This is an AI-powered therapy service that provides emotional support and mental wellness conversations. It uses advanced AI to understand and respond to your emotions while maintaining a safe and private environment.',
    '[0.1, 0.2, 0.3]'::vector
),
(
    'How does the service work?',
    'The service uses voice recognition and emotion analysis to understand your feelings and provide appropriate responses. You can speak naturally with the AI therapist, and it will adapt its responses based on your emotional state.',
    '[0.2, 0.3, 0.4]'::vector
),
(
    'Is my privacy protected?',
    'Yes, we take your privacy seriously. All conversations are encrypted and securely stored. Your emotion metrics are only accessible to you, and you can delete your account and all associated data at any time.',
    '[0.3, 0.4, 0.5]'::vector
); 