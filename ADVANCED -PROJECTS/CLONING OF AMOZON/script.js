// Product data
const products = [
    {
        id: 1,
        title: "Apple iPhone 14 Pro",
        price: 999,
        image: "https://m.media-amazon.com/images/I/61HHS0HrjpL._AC_UF1000,1000_QL80_.jpg",
        category: "Electronics"
    },
    {
        id: 2,
        title: "Sony WH-1000XM4 Headphones",
        price: 349,
        image: "https://m.media-amazon.com/images/I/61vD7MIrWLL._AC_UF1000,1000_QL80_.jpg",
        category: "Electronics"
    },
    {
        id: 3,
        title: "Amazon Echo Dot (4th Gen)",
        price: 49.99,
        image: "https://m.media-amazon.com/images/I/71Q9d6N7xkL._AC_UF1000,1000_QL80_.jpg",
        category: "Electronics"
    },
    {
        id: 4,
        title: "Instant Pot Duo 7-in-1",
        price: 89.95,
        image: "https://m.media-amazon.com/images/I/61lJ3xlQXFL._AC_UF1000,1000_QL80_.jpg",
        category: "Home & Kitchen"
    },
    {
        id: 5,
        title: "Nintendo Switch with Neon Blue and Neon Red Joy‑Con",
        price: 299.99,
        image: "https://m.media-amazon.com/images/I/61-PblYntsL._AC_UF1000,1000_QL80_.jpg",
        category: "Video Games"
    },
    {
        id: 6,
        title: "The Lean Startup by Eric Ries",
        price: 14.99,
        image: "https://m.media-amazon.com/images/I/81vvgZqCskL._AC_UF1000,1000_QL80_.jpg",
        category: "Books"
    },
    {
        id: 7,
        title: "Fitbit Charge 5 Advanced Fitness Tracker",
        price: 129.95,
        image: "https://m.media-amazon.com/images/I/61mCqsb030L._AC_UF1000,1000_QL80_.jpg",
        category: "Electronics"
    },
    {
        id: 8,
        title: "Ninja Professional Blender",
        price: 89.99,
        image: "https://m.media-amazon.com/images/I/71Swqqe7XAL._AC_UF1000,1000_QL80_.jpg",
        category: "Home & Kitchen"
    }
];

// Shopping cart
let cart = [];

// DOM elements
const productsContainer = document.getElementById('products-container');
const cartSection = document.getElementById('cart-section');
const cartItemsContainer = document.getElementById('cart-items');
const cartTotalElement = document.getElementById('cart-total');
const cartCountElement = document.getElementById('cart-count');
const checkoutBtn = document.getElementById('checkout-btn');
const continueShoppingBtn = document.getElementById('continue-shopping');
const navCart = document.querySelector('.nav-cart');

// Initialize the app
function init() {
    renderProducts();
    loadCart();
    setupEventListeners();
}

// Render products on the page
function renderProducts() {
    productsContainer.innerHTML = '';
    
    products.forEach(product => {
        const productElement = document.createElement('div');
        productElement.className = 'box';
        productElement.innerHTML = `
            <div class="box-content">
                <h2>${product.title}</h2>
                <div class="box-img" style="background-image: url('${product.image}')"></div>
                <p class="price">$${product.price.toFixed(2)}</p>
                <button class="add-to-cart" data-id="${product.id}">Add to Cart</button>
            </div>
        `;
        productsContainer.appendChild(productElement);
    });
}

// Setup event listeners
function setupEventListeners() {
    // Add to cart buttons
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('add-to-cart')) {
            const productId = parseInt(e.target.getAttribute('data-id'));
            addToCart(productId);
        }
        
        // Quantity buttons
        if (e.target.classList.contains('quantity-btn')) {
            const itemId = parseInt(e.target.closest('.cart-item').getAttribute('data-id'));
            const isIncrease = e.target.textContent === '+';
            updateQuantity(itemId, isIncrease);
        }
        
        // Remove item
        if (e.target.classList.contains('remove-item')) {
            const itemId = parseInt(e.target.closest('.cart-item').getAttribute('data-id'));
            removeFromCart(itemId);
        }
    });
    
    // Cart icon click
    navCart.addEventListener('click', function() {
        productsContainer.style.display = 'none';
        cartSection.style.display = 'block';
        renderCart();
    });
    
    // Continue shopping button
    continueShoppingBtn.addEventListener('click', function() {
        productsContainer.style.display = 'flex';
        cartSection.style.display = 'none';
    });
    
    // Checkout button
    checkoutBtn.addEventListener('click', function() {
        alert('Thank you for your purchase!');
        cart = [];
        saveCart();
        updateCartCount();
        renderCart();
        productsContainer.style.display = 'flex';
        cartSection.style.display = 'none';
    });
}

// Add item to cart
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    
    if (!product) return;
    
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: product.id,
            title: product.title,
            price: product.price,
            image: product.image,
            quantity: 1
        });
    }
    
    saveCart();
    updateCartCount();
    
    // Show a temporary notification
    showNotification(`${product.title} added to cart`);
}

// Remove item from cart
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    saveCart();
    updateCartCount();
    renderCart();
}

// Update item quantity
function updateQuantity(productId, isIncrease) {
    const item = cart.find(item => item.id === productId);
    
    if (!item) return;
    
    if (isIncrease) {
        item.quantity += 1;
    } else {
        if (item.quantity > 1) {
            item.quantity -= 1;
        } else {
            removeFromCart(productId);
            return;
        }
    }
    
    saveCart();
    updateCartCount();
    renderCart();
}

// Render cart items
function renderCart() {
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p>Your cart is empty.</p>';
        cartTotalElement.textContent = '';
        return;
    }
    
    cartItemsContainer.innerHTML = '';
    
    cart.forEach(item => {
        const cartItemElement = document.createElement('div');
        cartItemElement.className = 'cart-item';
        cartItemElement.setAttribute('data-id', item.id);
        cartItemElement.innerHTML = `
            <img src="${item.image}" alt="${item.title}" class="cart-item-img">
            <div class="cart-item-details">
                <h3 class="cart-item-title">${item.title}</h3>
                <p class="cart-item-price">$${item.price.toFixed(2)}</p>
                <div class="cart-item-quantity">
                    <button class="quantity-btn">-</button>
                    <input type="text" class="quantity-input" value="${item.quantity}" readonly>
                    <button class="quantity-btn">+</button>
                </div>
                <p class="remove-item">Delete</p>
            </div>
        `;
        cartItemsContainer.appendChild(cartItemElement);
    });
    
    // Calculate and display total
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    cartTotalElement.textContent = `Total: $${total.toFixed(2)}`;
}

// Update cart count in navbar
function updateCartCount() {
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCountElement.textContent = count;
}

// Save cart to localStorage
function saveCart() {
    localStorage.setItem('amazonCloneCart', JSON.stringify(cart));
}

// Load cart from localStorage
function loadCart() {
    const savedCart = localStorage.getItem('amazonCloneCart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
        updateCartCount();
    }
}

// Show notification
function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('fade-out');
        setTimeout(() => {
            notification.remove();
        }, 500);
    }, 2000);
}

// Add notification styles
const style = document.createElement('style');
style.textContent = `
.notification {
    position: fixed;
    bottom: 20px;
    right: 20px;
    background-color: #131921;
    color: white;
    padding: 15px 25px;
    border-radius: 5px;
    box-shadow: 0 4px 8px rgba(0,0,0,0.2);
    z-index: 1000;
    animation: slideIn 0.5s ease-out;
}

.notification.fade-out {
    animation: fadeOut 0.5s ease-out;
}

@keyframes slideIn {
    from { transform: translateX(100%); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
}

@keyframes fadeOut {
    from { opacity: 1; }
    to { opacity: 0; }
}
`;
document.head.appendChild(style);

// Initialize the application
init();