// Amazon Clone - JavaScript Implementation
document.addEventListener('DOMContentLoaded', function () {
    // Inject CSS dynamically
    const style = document.createElement('style');
    style.textContent = `
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
            font-family: 'Arial', sans-serif;
        }
        
        body {
            background-color: #EAEDED;
        }
        
        /* Header Styles */
        #header {
            background-color: #131921;
            color: white;
            padding: 15px 20px;
            display: flex;
            align-items: center;
            justify-content: space-between;
        }
        
        .logo {
            font-size: 24px;
            font-weight: bold;
            color: #FF9900;
        }
        
        .search-bar {
            display: flex;
            flex-grow: 1;
            max-width: 800px;
            margin: 0 20px;
        }
        
        .search-bar input {
            width: 100%;
            padding: 10px;
            border: none;
            border-radius: 4px 0 0 4px;
        }
        
        .search-bar button {
            background-color: #FEBD69;
            border: none;
            padding: 10px 15px;
            border-radius: 0 4px 4px 0;
            cursor: pointer;
        }
        
        .nav-links {
            display: flex;
            gap: 20px;
        }
        
        .nav-link {
            color: white;
            text-decoration: none;
            display: flex;
            flex-direction: column;
        }
        
        .nav-link span:first-child {
            font-size: 12px;
        }
        
        .nav-link span:last-child {
            font-size: 14px;
            font-weight: bold;
        }
        
        .cart {
            display: flex;
            align-items: center;
            gap: 5px;
        }
        
        /* Navbar Styles */
        #navbar {
            background-color: #232F3E;
            color: white;
            padding: 10px 20px;
            display: flex;
            align-items: center;
            gap: 15px;
        }
        
        .nav-item {
            font-size: 14px;
            cursor: pointer;
        }
        
        /* Hero Section */
        #hero-section {
            height: 300px;
            background-image: url('https://m.media-amazon.com/images/I/61lwJy4B8PL._SX3000_.jpg');
            background-size: cover;
            background-position: center;
            margin-bottom: 20px;
        }
        
        /* Product Grid */
        #product-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
            gap: 20px;
            padding: 20px;
        }
        
        .product-card {
            background-color: white;
            padding: 20px;
            border-radius: 5px;
            box-shadow: 0 2px 5px rgba(0,0,0,0.1);
        }
        
        .product-image {
            height: 200px;
            background-color: #f5f5f5;
            margin-bottom: 10px;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        
        .product-title {
            font-size: 16px;
            margin-bottom: 10px;
            height: 40px;
            overflow: hidden;
        }
        
        .product-price {
            font-weight: bold;
            font-size: 18px;
            color: #B12704;
            margin-bottom: 10px;
        }
        
        .product-rating {
            color: #FFA41C;
            margin-bottom: 10px;
        }
        
        .add-to-cart {
            background-color: #FFD814;
            border: none;
            padding: 8px 15px;
            border-radius: 20px;
            cursor: pointer;
            width: 100%;
            font-size: 14px;
        }
        
        .add-to-cart:hover {
            background-color: #F7CA00;
        }
        
        /* Footer */
        #footer {
            background-color: #131921;
            color: white;
            padding: 30px 20px;
            text-align: center;
        }
        
        .footer-links {
            display: flex;
            justify-content: center;
            gap: 20px;
            margin-bottom: 20px;
        }
        
        .footer-link {
            color: white;
            text-decoration: none;
            font-size: 12px;
        }
        
        .copyright {
            font-size: 12px;
            color: #999;
        }
    `;
    document.head.appendChild(style);

    // Data for products
    const products = [
        {
            id: 1,
            title: 'Wireless Bluetooth Headphones with Microphone',
            price: 59.99,
            rating: 4,
            image: 'https://m.media-amazon.com/images/I/61O6rRrR5VL._AC_UL320_.jpg'
        },
        {
            id: 2,
            title: 'Smart Watch with Fitness Tracker, Heart Rate Monitor',
            price: 89.99,
            rating: 5,
            image: 'https://m.media-amazon.com/images/I/71Swqqe7XAL._AC_UL320_.jpg'
        },
        {
            id: 3,
            title: 'Portable Bluetooth Speaker - Waterproof',
            price: 39.99,
            rating: 4,
            image: 'https://m.media-amazon.com/images/I/61B4-j2esJL._AC_UL320_.jpg'
        },
        {
            id: 4,
            title: '4K Ultra HD Smart TV with HDR',
            price: 499.99,
            rating: 5,
            image: 'https://m.media-amazon.com/images/I/71RX4rTo1NL._AC_UL320_.jpg'
        },
        {
            id: 5,
            title: 'Laptop - 15.6" FHD, Intel Core i7, 16GB RAM',
            price: 899.99,
            rating: 4,
            image: 'https://m.media-amazon.com/images/I/71ZOtNdaZCL._AC_UL320_.jpg'
        },
        {
            id: 6,
            title: 'Wireless Gaming Mouse - Ergonomic Design',
            price: 29.99,
            rating: 4,
            image: 'https://m.media-amazon.com/images/I/61UxfXTUyvL._AC_UL320_.jpg'
        }
    ];

    // Render header
    function renderHeader() {
        const header = document.getElementById('header');
        header.innerHTML = `
            <div class="logo">amazon</div>
            <div class="search-bar">
                <input type="text" placeholder="Search Amazon">
                <button><i class="fas fa-search"></i></button>
            </div>
            <div class="nav-links">
                <a href="#" class="nav-link">
                    <span>Hello, Sign in</span>
                    <span>Account & Lists</span>
                </a>
                <a href="#" class="nav-link">
                    <span>Returns</span>
                    <span>& Orders</span>
                </a>
                <div class="cart">
                    <i class="fas fa-shopping-cart"></i>
                    <span>Cart</span>
                </div>
            </div>
        `;
    }

    // Render navbar
    function renderNavbar() {
        const navbar = document.getElementById('navbar');
        navbar.innerHTML = `
            <div class="nav-item">
                <i class="fas fa-bars"></i> All
            </div>
            <div class="nav-item">Today's Deals</div>
            <div class="nav-item">Customer Service</div>
            <div class="nav-item">Registry</div>
            <div class="nav-item">Gift Cards</div>
            <div class="nav-item">Sell</div>
        `;
    }

    // Render hero section
    function renderHeroSection() {
        const heroSection = document.getElementById('hero-section');
        // Background image is set via CSS
    }

    // Render product grid
    function renderProductGrid() {
        const productGrid = document.getElementById('product-grid');
        productGrid.innerHTML = products.map(product => `
            <div class="product-card" data-id="${product.id}">
                <div class="product-image">
                    <img src="${product.image}" alt="${product.title}" style="max-height: 100%; max-width: 100%;">
                </div>
                <div class="product-title">${product.title}</div>
                <div class="product-price">$${product.price.toFixed(2)}</div>
                <div class="product-rating">
                    ${'★'.repeat(product.rating)}${'☆'.repeat(5 - product.rating)}
                </div>
                <button class="add-to-cart">Add to Cart</button>
            </div>
        `).join('');

        // Add event listeners to all add-to-cart buttons
        document.querySelectorAll('.add-to-cart').forEach(button => {
            button.addEventListener('click', function () {
                const productId = parseInt(this.closest('.product-card').getAttribute('data-id'));
                const product = products.find(p => p.id === productId);
                alert(`Added to cart: ${product.title}`);
            });
        });
    }

    // Render footer
    function renderFooter() {
        const footer = document.getElementById('footer');
        footer.innerHTML = `
            <div class="footer-links">
                <a href="#" class="footer-link">Conditions of Use</a>
                <a href="#" class="footer-link">Privacy Notice</a>
                <a href="#" class="footer-link">Interest-Based Ads</a>
            </div>
            <div class="copyright">
                © 1996-${new Date().getFullYear()}, Amazon.com, Inc. or its affiliates
            </div>
        `;
    }

    // Initialize the app
    function init() {
        renderHeader();
        renderNavbar();
        renderHeroSection();
        renderProductGrid();
        renderFooter();
    }

    init();
});