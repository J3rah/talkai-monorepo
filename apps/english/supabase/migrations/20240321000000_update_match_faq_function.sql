-- Drop the existing match_faq function
DROP FUNCTION IF EXISTS match_faq(vector, double precision, integer);

-- Create the match_faq function with the correct parameter name
CREATE OR REPLACE FUNCTION match_faq(
    query_embedding vector,
    similarity_threshold double precision,
    match_count integer
)
RETURNS TABLE (
    id bigint,
    question text,
    answer text,
    similarity double precision
)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT
        faq_embeddings.id,
        faq_embeddings.question,
        faq_embeddings.answer,
        1 - (faq_embeddings.embedding <=> query_embedding) as similarity
    FROM faq_embeddings
    WHERE 1 - (faq_embeddings.embedding <=> query_embedding) > similarity_threshold
    ORDER BY faq_embeddings.embedding <=> query_embedding
    LIMIT match_count;
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION match_faq(vector, double precision, integer) TO authenticated; 