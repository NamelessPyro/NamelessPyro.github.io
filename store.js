// Shopping cart functionality
let cart = [];

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

// Initialize cart display
document.addEventListener('DOMContentLoaded', function() {
    updateCart();
});
