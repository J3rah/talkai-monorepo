-- Check current subscription plans
SELECT name, price_id, price_amount FROM subscription_plans ORDER BY price_amount;

-- Update to the correct price IDs that match your Stripe dashboard
-- Centered plan: $12.99/month
UPDATE subscription_plans 
SET price_id = 'price_1RVF0YIgpnvoGs6ar1THKsjc'
WHERE name = 'Centered';

-- Grounded plan: $29.99/month
UPDATE subscription_plans 
SET price_id = 'price_1RVF0gIgpnvoGs6aO3dN74Em'
WHERE name = 'Grounded';

-- Verify the updates
SELECT name, price_id, price_amount FROM subscription_plans ORDER BY price_amount; 