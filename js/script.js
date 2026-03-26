document.addEventListener('DOMContentLoaded', () => {
    // Mobile Menu Toggle (Placeholder for future)
    // const menuBtn = document.querySelector('.menu-btn');
    // const navLinks = document.querySelector('.nav-links');

    // Cart State
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartCountElement = document.querySelector('.cart-count');

    // Update Cart Count UI
    function updateCartCount() {
        if (cartCountElement) {
            const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
            cartCountElement.textContent = totalItems;
            
            // Add a little pop animation when updated
            cartCountElement.style.transform = 'scale(1.2)';
            setTimeout(() => {
                cartCountElement.style.transform = 'scale(1)';
            }, 200);
        }
    }

    // Add to Cart Functionality (For product pages and featured sections)
    const addToCartBtns = document.querySelectorAll('.add-to-cart-btn');
    
    addToCartBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const productCard = e.target.closest('.product-card');
            if(!productCard) return;

            // In a real app, you'd get these from data attributes or a backend
            const productId = productCard.dataset.id || Math.random().toString(36).substr(2, 9);
            const title = productCard.querySelector('.product-title').textContent;
            const priceText = productCard.querySelector('.product-price').textContent;
            const price = parseFloat(priceText.replace(/[^0-9.-]+/g,""));
            const imageSrc = productCard.querySelector('.product-image img').src;

            const existingItem = cart.find(item => item.id === productId);

            if (existingItem) {
                existingItem.quantity += 1;
            } else {
                cart.push({
                    id: productId,
                    title: title,
                    price: price,
                    image: imageSrc,
                    quantity: 1
                });
            }

            localStorage.setItem('cart', JSON.stringify(cart));
            updateCartCount();
            
            // Optional: Show a toast notification
            showToast(`تمت إضافة ${title} إلى السلة`, 'success');
        });
    });

    // Toast Notification System
    function showToast(message, type = 'info') {
        const toastContainer = document.getElementById('toast-container') || createToastContainer();
        
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.textContent = message;
        
        toastContainer.appendChild(toast);
        
        // Trigger animation
        setTimeout(() => {
            toast.classList.add('show');
        }, 10);
        
        // Remove toast
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => {
                toast.remove();
            }, 300);
        }, 3000);
    }

    function createToastContainer() {
        const container = document.createElement('div');
        container.id = 'toast-container';
        container.style.cssText = `
            position: fixed;
            bottom: 20px;
            left: 20px;
            z-index: 9999;
            display: flex;
            flex-direction: column;
            gap: 10px;
        `;
        document.body.appendChild(container);
        
        // Add basic styles to head for toasts
        const style = document.createElement('style');
        style.textContent = `
            .toast {
                background: var(--primary-color);
                color: white;
                padding: 12px 24px;
                border-radius: 8px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                transform: translateX(-120%);
                transition: transform 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
                font-family: var(--font-arabic);
                direction: rtl;
            }
            .toast.show {
                transform: translateX(0);
            }
            .toast-success { border-right: 4px solid #28a745; }
        `;
        document.head.appendChild(style);
        
        return container;
    }

    // Initialize UI
    updateCartCount();

    // Smooth Scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if(targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });
});
