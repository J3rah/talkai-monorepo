-- Update subscription plans with the REAL Stripe price IDs we just created

-- Update Centered plan with the real Stripe price ID
UPDATE subscription_plans 
SET price_id = 'price_1Rb5usIgpnvoGs6ag7t0kXA9'
WHERE name = 'Centered';

-- Update Grounded plan with the real Stripe price ID  
UPDATE subscription_plans 
SET price_id = 'price_1Rb5xdIgpnvoGs6azz1ChQgc'
WHERE name = 'Grounded';

-- Verify the updates
SELECT name, price_id, price_amount FROM subscription_plans ORDER BY price_amount; 