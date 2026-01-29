# Stripe Setup Guide for NamelessPyro Store

## Quick Start

This store includes Stripe payment integration. Follow these steps to activate it:

### 1. Create a Stripe Account
- Go to https://stripe.com
- Sign up for a free account
- Verify your email

### 2. Get Your API Keys
- Go to https://dashboard.stripe.com/apikeys
- You'll see two keys:
  - **Publishable Key** (starts with `pk_test_` or `pk_live_`)
  - **Secret Key** (starts with `sk_test_` or `sk_live_`) - Keep this safe!

### 3. Update Your Store
- Open `store.js`
- Find line: `const stripe = Stripe('pk_test_...');`
- Replace the key with your Publishable Key from Stripe

### 4. Test Payments (Development)
Use Stripe's test card numbers:
- **Visa**: `4242 4242 4242 4242`
- **MasterCard**: `5555 5555 5555 4444`
- **Amex**: `3782 822463 10005`
- **Expiry**: Any future date (e.g., 12/25)
- **CVC**: Any 3 digits (e.g., 123)

### 5. For Production
When you're ready to accept real payments:
- Switch to Live keys on Stripe Dashboard
- Update the key in `store.js` to your live Publishable Key
- Complete Stripe's verification requirements

## Important Notes

⚠️ **Security**: 
- Never expose your Secret Key in frontend code
- The current implementation handles client-side validation only
- For a production store, you'll need a backend server to:
  - Create Payment Intents with your Secret Key
  - Verify payments
  - Process orders securely

## Backend Integration (Recommended for Production)

For production use, you should:
1. Create a backend API (Node.js, Python, etc.)
2. Have the frontend send cart data to your backend
3. Your backend uses the Secret Key to create Payment Intents
4. Store orders in a database
5. Send confirmation emails

Example backend technologies:
- Node.js + Express
- Python + Flask
- Ruby on Rails
- Any language with Stripe SDK

## Support
- Stripe Documentation: https://stripe.com/docs
- Stripe Support: https://support.stripe.com
