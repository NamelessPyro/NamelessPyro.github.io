# How to Set Up Real Stripe Payments

Your store is configured with Stripe, but to actually process payments and deliver digital products, you need to set up Stripe Payment Links. Here's how:

## Step 1: Create Stripe Products

1. Go to https://dashboard.stripe.com/products
2. Click "Add product"
3. Create these products:
   - **NamelessPyro Profile Image** - $0.50
   - **Classic T-Shirt** - $24.99
   - **Coffee Mug** - $14.99
   - **Snapback Cap** - $19.99
   - **Gaming Mousepad** - $29.99
   - **Digital Wallpaper Pack** - $4.99
   - **Sticker Pack** - $6.99

## Step 2: Create Prices

For each product, Stripe will create a "Price" automatically. You'll need the Price ID.

1. Go to https://dashboard.stripe.com/prices
2. For each product, you'll see a Price ID (format: `price_xxxxx`)
3. Copy the Price IDs

## Step 3: Update Your Store Code

Open `store.js` and update the `proceedToStripe()` function with your Price IDs:

```javascript
if (item.name === 'NamelessPyro Profile Image') {
    priceId = 'price_1Suj9P...'; // Your actual Price ID
} else if (item.name === 'Classic T-Shirt') {
    priceId = 'price_1Suj9P...'; // Your actual Price ID
}
```

## Step 4: Set Up Payment Links (Easiest)

For a quick solution without backend code:

1. Go to https://dashboard.stripe.com/payment-links
2. Click "Create payment link"
3. Add all your products
4. Set up success URL: `https://NamelessPyro.github.io/download.html`
5. Copy the Payment Link URL
6. Update store.js to redirect to this link

## Step 5: The Proper Solution (Recommended)

For full functionality, set up a backend server that:

### Node.js + Express Example:

```javascript
const express = require('express');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

app.post('/create-checkout-session', async (req, res) => {
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: req.body.items.map(item => ({
      price: item.priceId,
      quantity: 1,
    })),
    mode: 'payment',
    success_url: 'https://NamelessPyro.github.io/download.html',
    cancel_url: 'https://NamelessPyro.github.io/store.html',
  });
  
  res.json({ sessionId: session.id });
});
```

## Quick Workaround (Temporary)

If you want payments to work immediately:

1. Create a single Payment Link on Stripe dashboard
2. In store.js, replace the `redirectToPayment()` function with:

```javascript
function redirectToPayment() {
    // Replace with your actual Payment Link from Stripe
    window.location.href = 'https://buy.stripe.com/your-link-here';
}
```

## Testing

Use these test cards:
- **Visa**: `4242 4242 4242 4242`
- **MasterCard**: `5555 5555 5555 4444`
- **Expiry**: Any future date (e.g., 12/25)
- **CVC**: Any 3 digits (e.g., 123)

## Support

- Stripe Checkout Docs: https://stripe.com/docs/payments/checkout
- Stripe Payment Links: https://stripe.com/docs/payment-links
- Stripe Support: https://support.stripe.com
