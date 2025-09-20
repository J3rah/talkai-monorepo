-- Update subscription plans with correct Stripe price IDs

-- Update Centered plan with new $12.99/month price ID
UPDATE subscription_plans 
SET price_id = 'price_1RVF0YIgpnvoGs6ar1THKsjc'
WHERE name = 'Centered';

-- Update Grounded plan with new $29.99/month price ID
UPDATE subscription_plans 
SET price_id = 'price_1RVF0gIgpnvoGs6aO3dN74Em'
WHERE name = 'Grounded';

-- Verify the updates
SELECT name, price_amount, price_id FROM subscription_plans ORDER BY price_amount; 