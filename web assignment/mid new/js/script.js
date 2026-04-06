document.addEventListener("DOMContentLoaded", function () {

    /* ========== HAMBURGER MENU ========== */
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    const links = document.querySelectorAll('.nav-links a');

    hamburger.addEventListener('click', function () {
        navLinks.classList.toggle('active');
        hamburger.classList.toggle('active');
    });

    links.forEach(function(link) {
        link.addEventListener('click', function () {
            navLinks.classList.remove('active');
            hamburger.classList.remove('active');
        });
    });

    /* ========== CAROUSEL FUNCTIONALITY ========== */
    
    class Carousel {
        constructor() {
            this.wrapper = document.querySelector('.carousel-wrapper');
            this.carousel = document.querySelector('.products-carousel');
            this.items = document.querySelectorAll('.carousel-item');
            this.totalItems = this.items.length;
            this.currentIndex = 0;
            this.autoplayInterval = null;
            this.itemWidth = 0;
            this.itemsPerPage = this.getItemsPerPage();
            
            this.init();
        }
        
        init() {
            if (!this.carousel || !this.wrapper) return;
            
            // Buttons
            const prevBtn = document.getElementById('prevBtn');
            const nextBtn = document.getElementById('nextBtn');
            
            if (prevBtn && nextBtn) {
                prevBtn.addEventListener('click', () => this.prevSlide());
                nextBtn.addEventListener('click', () => this.nextSlide());
            }
            
            // Hover to pause autoplay
            this.wrapper.addEventListener('mouseenter', () => this.stopAutoplay());
            this.wrapper.addEventListener('mouseleave', () => this.startAutoplay());
            
            // Window resize listener
            window.addEventListener('resize', () => {
                this.itemsPerPage = this.getItemsPerPage();
            });
            
            // Initialize carousel dimensions
            setTimeout(() => this.calculateItemWidth(), 100);
            
            // Update counter and start autoplay
            this.updateCounter();
            this.startAutoplay();
        }
        
        getItemsPerPage() {
            const width = window.innerWidth;
            if (width <= 768) return 1;        // Mobile
            else if (width <= 1024) return 2;   // Tablet
            else return 3;                      // Desktop
        }
        
        calculateItemWidth() {
            if (this.items[0]) {
                this.itemWidth = this.items[0].offsetWidth + 25; // Including gap
            }
        }
        
        prevSlide() {
            this.currentIndex = (this.currentIndex - 1 + this.totalItems) % this.totalItems;
            this.updateCarousel();
        }
        
        nextSlide() {
            this.currentIndex = (this.currentIndex + 1) % this.totalItems;
            this.updateCarousel();
        }
        
        updateCarousel() {
            this.calculateItemWidth();
            this.updateCounter();
            
            // Scroll smoothly to the current index
            if (this.wrapper && this.itemWidth > 0) {
                const scrollPosition = this.currentIndex * this.itemWidth;
                this.wrapper.scrollLeft = scrollPosition;
            }
        }
        
        updateCounter() {
            const counter = document.getElementById('slideCounter');
            if (counter) {
                const displayIndex = (this.currentIndex % this.totalItems) + 1;
                counter.textContent = `Showing ${displayIndex} of ${this.totalItems}`;
            }
        }
        
        startAutoplay() {
            if (this.autoplayInterval) return;
            
            this.autoplayInterval = setInterval(() => {
                this.nextSlide();
            }, 5000);
        }
        
        stopAutoplay() {
            if (this.autoplayInterval) {
                clearInterval(this.autoplayInterval);
                this.autoplayInterval = null;
            }
        }
    }
    
    // Initialize carousel
    const carousel = new Carousel();

});