document.addEventListener('DOMContentLoaded', function () {
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    const links = document.querySelectorAll('.nav-links a');

    if (hamburger && navLinks) {
        hamburger.addEventListener('click', function () {
            navLinks.classList.toggle('active');
            hamburger.classList.toggle('active');
        });
    }

    if (links) {
        links.forEach(function(link) {
            link.addEventListener('click', function () {
                navLinks.classList.remove('active');
                hamburger.classList.remove('active');
            });
        });
    }

    const CART_KEY = 'outfittersCart';

    const loadCart = () => {
        try {
            return JSON.parse(localStorage.getItem(CART_KEY) || '[]');
        } catch (err) {
            return [];
        }
    };

    const updateCartCount = () => {
        const cartCountEl = document.getElementById('cartCount');
        if (!cartCountEl) return;
        const cart = loadCart();
        const quantity = cart.reduce((sum, item) => sum + (item.quantity || 0), 0);
        cartCountEl.textContent = quantity;
        cartCountEl.style.display = quantity > 0 ? 'inline-flex' : 'none';
    };

    updateCartCount();
});