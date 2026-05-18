/**
 * Products Page JavaScript
 * Handles interactive features for the product catalog
 */

document.addEventListener('DOMContentLoaded', function () {

    // ─────────────────────────────────────────────
    // AUTO-SUBMIT FILTER FORM ON SELECT CHANGE
    // ─────────────────────────────────────────────
    const filterForm = document.getElementById('filterForm');
    if (filterForm) {
        const selects = filterForm.querySelectorAll('select');
        selects.forEach(select => {
            select.addEventListener('change', () => {
                filterForm.submit();
            });
        });
    }

    // ─────────────────────────────────────────────
    // SMOOTH SCROLL TO TOP WHEN PAGINATION CHANGES
    // ─────────────────────────────────────────────
    const pageLinks = document.querySelectorAll('.page-btn, .page-num, .clear-btn');
    pageLinks.forEach(link => {
        link.addEventListener('click', () => {
            setTimeout(() => {
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            }, 100);
        });
    });

    // ─────────────────────────────────────────────
    // ADD TO CART FUNCTIONALITY
    // ─────────────────────────────────────────────
    const userId = window.OUTFITTERS_USER?.id || '';
    const CART_KEY = 'outfittersCart' + (userId ? `_${userId}` : '_guest');

    const loadCart = () => {
        try {
            return JSON.parse(localStorage.getItem(CART_KEY) || '[]');
        } catch (err) {
            return [];
        }
    };

    const saveCart = (cart) => {
        localStorage.setItem(CART_KEY, JSON.stringify(cart));
    };

    const updateCartCount = () => {
        const cartCountEl = document.getElementById('cartCount');
        if (!cartCountEl) return;
        const cart = loadCart();
        const quantity = cart.reduce((sum, item) => sum + (item.quantity || 0), 0);
        cartCountEl.textContent = quantity;
        cartCountEl.style.display = quantity > 0 ? 'inline-flex' : 'none';
    };

    const addToCartButtons = document.querySelectorAll('.add-to-cart-btn');
    addToCartButtons.forEach(btn => {
        btn.addEventListener('click', function (e) {
            if (this.disabled) return;

            const productId = this.dataset.id;
            const productName = this.dataset.name;
            const productPrice = parseFloat(this.dataset.price) || 0;
            const productImage = this.dataset.image || '';
            const cart = loadCart();
            const existingItem = cart.find(item => item.id === productId);

            if (existingItem) {
                existingItem.quantity = (existingItem.quantity || 0) + 1;
            } else {
                cart.push({
                    id: productId,
                    name: productName,
                    price: productPrice,
                    image: productImage,
                    quantity: 1
                });
            }

            saveCart(cart);
            updateCartCount();

            const originalText = this.textContent;
            this.textContent = '✓ ADDED';
            this.style.background = '#4caf50';

            setTimeout(() => {
                this.textContent = originalText;
                this.style.background = '';
            }, 1500);
        });
    });

    updateCartCount();

    // ─────────────────────────────────────────────
    // IMAGE LAZY LOADING WITH ERROR HANDLING
    // ─────────────────────────────────────────────
    const images = document.querySelectorAll('.card-img');
    images.forEach(img => {
        img.addEventListener('error', function () {
            this.src = '/images/placeholder.png';
        });
    });

});
