-- Create a function to generate embeddings for FAQs
CREATE OR REPLACE FUNCTION generate_faq_embedding(question text, answer text)
RETURNS vector
LANGUAGE plpgsql
AS $$
DECLARE
    combined_text text;
    embedding vector;
BEGIN
    -- Combine question and answer for better context
    combined_text := question || ' ' || answer;
    
    -- Call the OpenAI API to generate embedding
    -- Note: This is a placeholder. In practice, you would need to:
    -- 1. Call the OpenAI API from your application
    -- 2. Store the embedding in the database
    -- 3. Use the stored embedding for similarity search
    
    -- For now, we'll use a simple vector for testing
    embedding := '[0.1, 0.2, 0.3]'::vector;
    
    RETURN embedding;
END;
$$;

-- Create a trigger to automatically generate embeddings
CREATE OR REPLACE FUNCTION update_faq_embedding()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.embedding IS NULL THEN
        NEW.embedding := generate_faq_embedding(NEW.question, NEW.answer);
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create the trigger
DROP TRIGGER IF EXISTS faq_embedding_trigger ON faq_embeddings;
CREATE TRIGGER faq_embedding_trigger
    BEFORE INSERT OR UPDATE ON faq_embeddings
    FOR EACH ROW
    EXECUTE FUNCTION update_faq_embedding(); 