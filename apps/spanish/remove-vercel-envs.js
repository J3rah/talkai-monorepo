const { execSync } = require('child_process');

const envVars = [
    "STRIPE_PRICE_PRO",
    "NEXT_PUBLIC_STRIPE_PRICE_ENTERPRISE",
    "STRIPE_PRICE_ENTERPRISE",
    "NEXT_PUBLIC_PAYPAL_CLIENT_ID",
    "PAYPAL_CLIENT_ID",
    "NEXT_PUBLIC_PAYPAL_PLAN_IDS",
    "NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME",
    "NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET",
    "CLOUDINARY_URL",
    "OPENAI_API_KEY",
    "NEXT_PUBLIC_APP_URL",
    "NEXT_PUBLIC_RECAPTCHA_SITE_KEY",
    "NEXT_PUBLIC_HUME_SASS_CONFIG_ID",
    "HUME_SASS_CONFIG_ID",
    "NEXT_PUBLIC_HUME_JACKSPARROW_CONFIG_ID",
    "HUME_JACKSPARROW_CONFIG_ID",
    "NEXT_PUBLIC_HUME_SECRET_KEY",
    "SUPABASE_AUTH_SMS_TWILIO_AUTH_TOKEN",
    "NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY",
    "STRIPE_SECRET_KEY",
    "NEXT_PUBLIC_STRIPE_PRICE_STARTER",
    "STRIPE_PRICE_STARTER",
    "NEXT_PUBLIC_STRIPE_PRICE_PRO",
    "SUPABASE_ANON_KEY",
    "SUPABASE_URL",
    "HUME_CONFIG_ID",
    "HUME_MALE_CONFIG_ID",
    "HUME_FEMALE_CONFIG_ID",
    "HUME_CALM_CONFIG_ID"
  ];

const environments = ['production', 'preview', 'development'];

envVars.forEach(name => {
  environments.forEach(env => {
    try {
      console.log(`Removing ${name} from ${env}...`);
      execSync(`vercel env rm ${name} ${env} --yes`, { stdio: 'inherit' });
    } catch (err) {
      console.error(`Failed to remove ${name} from ${env}:`, err.message);
    }
  });
});