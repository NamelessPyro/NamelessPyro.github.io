// Shopping cart functionality
let cart = [];

// Initialize Stripe
const stripe = Stripe('pk_live_51Suj9P5sRTWkYJXbZFjb6dnNEwnBDPNYyjUQHCB0fsuGmTQuZ54pgfodOIIb3j4jChEXl4jWLduNJW1Ruk7xol7Y00SU5HCe6I');

function addToCart(productName, price) {
    cart.push({ name: productName, price: price });
    updateCart();
    showNotification(`${productName} added to cart!`);
}

function removeFromCart(index) {
    cart.splice(index, 1);
    updateCart();
}

function updateCart() {
    const cartItemsDiv = document.getElementById('cart-items');
    const cartCount = document.getElementById('cart-count');
    const cartTotal = document.getElementById('cart-total');

    if (cart.length === 0) {
        cartItemsDiv.innerHTML = '<p class="empty-cart">Your cart is empty</p>';
        cartCount.textContent = '0';
        cartTotal.textContent = '0.00';
        return;
    }

    let html = '<div class="cart-items-list">';
    let total = 0;

    cart.forEach((item, index) => {
        html += `
            <div class="cart-item">
                <div class="item-info">
                    <p class="item-name">${item.name}</p>
                    <p class="item-price">$${item.price.toFixed(2)}</p>
                </div>
                <button class="remove-btn" onclick="removeFromCart(${index})">
                    <i class="fas fa-trash"></i> Remove
                </button>
            </div>
        `;
        total += item.price;
    });

    html += '</div>';
    cartItemsDiv.innerHTML = html;
    cartCount.textContent = cart.length;
    cartTotal.textContent = total.toFixed(2);
}

function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.classList.add('show');
    }, 10);

    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 2000);
}

function proceedToStripe() {
    if (cart.length === 0) {
        showNotification('Your cart is empty!');
        return;
    }

    // Create line items for Stripe Checkout
    const lineItems = cart.map(item => {
        let priceId = '';
        
        // Map product names to Stripe Price IDs
        if (item.name === 'NamelessPyro Profile Image') {
            priceId = 'price_1Suj9P5sRTWkYJXbAbCdEfGh'; // Profile image price ID
        } else if (item.name === 'Classic T-Shirt') {
            priceId = 'price_1Suj9P5sRTWkYJXbIjKlMnOp'; // T-shirt price ID
        } else if (item.name === 'Coffee Mug') {
            priceId = 'price_1Suj9P5sRTWkYJXbQrStUvWx'; // Mug price ID
        }
        // Add more products as needed
        
        return {
            price: priceId,
            quantity: 1
        };
    });

    // Redirect to Stripe Checkout
    // You need to create a backend endpoint that creates a Checkout Session
    // For now, use Stripe's Payment Link feature
    redirectToPayment();
}

function redirectToPayment() {
    // This is a simplified solution - in production, you'd use a backend
    const total = cart.reduce((sum, item) => sum + item.price, 0);
    const amountInCents = Math.round(total * 100);
    
    // Create a simple redirect to Stripe (you'll need to set up Payment Links)
    // For now, show instructions
    showNotification('Redirecting to payment...');
    
    // Calculate total and redirect
    setTimeout(() => {
        // Create a dynamic checkout - this requires backend setup
        // As a temporary solution, open Stripe hosted checkout
        const sessionData = {
            items: cart.map(item => ({
                name: item.name,
                amount: Math.round(item.price * 100),
                currency: 'usd'
            }))
        };
        
        // Redirect to a Stripe Payment Link (create one manually on Stripe dashboard)
        // https://dashboard.stripe.com/payment-links
        window.location.href = 'checkout-redirect.html?total=' + Math.round(total * 100);
    }, 500);
}

// Initialize cart display
document.addEventListener('DOMContentLoaded', function() {
    updateCart();
});
