// Shopping cart functionality
let cart = [];

// Initialize Stripe
const stripe = Stripe('pk_live_51Suj9P5sRTWkYJXbZFjb6dnNEwnBDPNYyjUQHCB0fsuGmTQuZ54pgfodOIIb3j4jChEXl4jWLduNJW1Ruk7xol7Y00SU5HCe6I');
let elements, cardElement;

function initializeStripe() {
    elements = stripe.elements();
    cardElement = elements.create('card');
    cardElement.mount('#card-element');

    // Handle card errors
    cardElement.on('change', function(event) {
        const displayError = document.getElementById('card-errors');
        if (event.error) {
            displayError.textContent = event.error.message;
        } else {
            displayError.textContent = '';
        }
    });
}

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

function openCheckout() {
    if (cart.length === 0) {
        showNotification('Your cart is empty!');
        return;
    }

    const modal = document.getElementById('checkout-modal');
    const total = cart.reduce((sum, item) => sum + item.price, 0);
    document.getElementById('checkout-total').textContent = total.toFixed(2);
    modal.style.display = 'block';

    // Initialize Stripe if not already done
    if (!elements) {
        initializeStripe();
    }
}

function closeCheckout() {
    const modal = document.getElementById('checkout-modal');
    modal.style.display = 'none';
}

async function handlePayment() {
    const payBtn = document.getElementById('pay-btn');
    payBtn.disabled = true;
    payBtn.textContent = 'Processing...';

    const email = document.getElementById('email').value;
    const name = document.getElementById('name').value;
    const address = document.getElementById('address').value;
    const city = document.getElementById('city').value;
    const zip = document.getElementById('zip').value;

    if (!email || !name || !address || !city || !zip) {
        showNotification('Please fill in all fields');
        payBtn.disabled = false;
        payBtn.textContent = 'Pay with Stripe';
        return;
    }

    // Validate card element
    if (!cardElement) {
        showNotification('Card element not loaded. Please refresh the page.');
        payBtn.disabled = false;
        payBtn.textContent = 'Pay with Stripe';
        return;
    }

    const total = cart.reduce((sum, item) => sum + item.price, 0);

    try {
        // Create payment method with card details
        const { error, paymentMethod } = await stripe.createPaymentMethod({
            type: 'card',
            card: cardElement,
            billing_details: {
                name: name,
                email: email,
                address: {
                    line1: address,
                    city: city,
                    postal_code: zip
                }
            }
        });

        if (error) {
            // Display error from Stripe
            const errorElement = document.getElementById('card-errors');
            errorElement.textContent = error.message;
            showNotification('Card error: ' + error.message);
            payBtn.disabled = false;
            payBtn.textContent = 'Pay with Stripe';
        } else {
            // Payment method created successfully
            showNotification('✓ Order confirmed! Thank you for your purchase.');
            clearCheckout(payBtn);
        }
    } catch (err) {
        showNotification('Error: ' + err.message);
        payBtn.disabled = false;
        payBtn.textContent = 'Pay with Stripe';
    }
}

function clearCheckout(payBtn) {
    setTimeout(() => {
        cart = [];
        updateCart();
        closeCheckout();
        payBtn.disabled = false;
        payBtn.textContent = 'Pay with Stripe';
        document.getElementById('email').value = '';
        document.getElementById('name').value = '';
        document.getElementById('address').value = '';
        document.getElementById('city').value = '';
        document.getElementById('zip').value = '';
    }, 1500);
}

// Close modal when clicking outside
window.onclick = function(event) {
    const modal = document.getElementById('checkout-modal');
    if (event.target === modal) {
        closeCheckout();
    }
}

// Initialize cart display
document.addEventListener('DOMContentLoaded', function() {
    updateCart();
});
