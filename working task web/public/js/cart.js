document.addEventListener('DOMContentLoaded', function () {
    const CART_KEY = 'outfittersCart';
    const cartTableBody = document.getElementById('cartItems');
    const cartTotalEl = document.getElementById('cartTotal');
    const emptyMessageEl = document.getElementById('emptyCartMessage');
    const checkoutButton = document.getElementById('checkoutButton');
    const summaryContainer = document.getElementById('checkoutSummary');
    const orderMessage = document.getElementById('orderMessage');

    const loadCart = () => {
        try {
            return JSON.parse(localStorage.getItem(CART_KEY) || '[]');
        } catch (err) {
            return [];
        }
    };

    const saveCart = (cart) => {
        localStorage.setItem(CART_KEY, JSON.stringify(cart));
        updateCartCount();
    };

    const updateCartCount = () => {
        const cartCountEl = document.getElementById('cartCount');
        if (!cartCountEl) return;
        const cart = loadCart();
        const quantity = cart.reduce((sum, item) => sum + (item.quantity || 0), 0);
        cartCountEl.textContent = quantity;
        cartCountEl.style.display = quantity > 0 ? 'inline-flex' : 'none';
    };

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'PKR', maximumFractionDigits: 0 }).format(value);
    };

    const renderCart = () => {
        const cart = loadCart();
        if (!cartTableBody || !cartTotalEl || !emptyMessageEl) return;

        cartTableBody.innerHTML = '';

        if (cart.length === 0) {
            emptyMessageEl.style.display = 'block';
            cartTotalEl.textContent = 'PKR 0';
            if (checkoutButton) checkoutButton.disabled = true;
            return;
        }

        emptyMessageEl.style.display = 'none';
        let total = 0;

        cart.forEach(item => {
            const row = document.createElement('tr');
            const itemTotal = item.price * item.quantity;
            total += itemTotal;

            row.innerHTML = `
                <td><img src="${item.image}" alt="${item.name}" class="cart-thumb"> ${item.name}</td>
                <td>${formatCurrency(item.price)}</td>
                <td>
                    <button class="cart-action btn-small" data-action="decrease" data-id="${item.id}">-</button>
                    <span class="cart-qty">${item.quantity}</span>
                    <button class="cart-action btn-small" data-action="increase" data-id="${item.id}">+</button>
                </td>
                <td>${formatCurrency(itemTotal)}</td>
                <td><button class="cart-action btn-small remove-btn" data-action="remove" data-id="${item.id}">Remove</button></td>
            `;
            cartTableBody.appendChild(row);
        });

        cartTotalEl.textContent = formatCurrency(total);
        if (checkoutButton) checkoutButton.disabled = false;
    };

    const renderCheckoutSummary = () => {
        if (!summaryContainer) return;
        const cart = loadCart();

        if (cart.length === 0) {
            summaryContainer.innerHTML = '<p>Your cart is empty. Add items before proceeding to checkout.</p>';
            return;
        }

        let html = '<div class="checkout-summary-card"><h3>Order Summary</h3><ul class="checkout-item-list">';
        let total = 0;

        cart.forEach(item => {
            total += item.price * item.quantity;
            html += `<li><strong>${item.name}</strong> × ${item.quantity} — ${formatCurrency(item.price * item.quantity)}</li>`;
        });

        html += `</ul><p class="checkout-total"><strong>Total:</strong> ${formatCurrency(total)}</p>`;
        html += '<button id="confirmOrderButton" class="button primary">Place Order</button></div>';
        summaryContainer.innerHTML = html;

        const confirmButton = document.getElementById('confirmOrderButton');
        if (confirmButton) {
            confirmButton.addEventListener('click', () => {
                localStorage.removeItem(CART_KEY);
                updateCartCount();
                summaryContainer.innerHTML = '<div class="order-success"><h3>Order placed successfully!</h3><p>Thank you for your purchase. Your order is now being processed.</p></div>';
                if (orderMessage) orderMessage.style.display = 'block';
            });
        }
    };

    document.body.addEventListener('click', function (event) {
        const target = event.target.closest('.cart-action');
        if (!target) return;

        const action = target.dataset.action;
        const itemId = target.dataset.id;
        const cart = loadCart();
        const itemIndex = cart.findIndex(item => item.id === itemId);
        if (itemIndex === -1) return;

        if (action === 'increase') {
            cart[itemIndex].quantity += 1;
        } else if (action === 'decrease') {
            cart[itemIndex].quantity = Math.max(1, cart[itemIndex].quantity - 1);
        } else if (action === 'remove') {
            cart.splice(itemIndex, 1);
        }

        saveCart(cart);
        renderCart();
        renderCheckoutSummary();
    });

    renderCart();
    renderCheckoutSummary();
    updateCartCount();
});