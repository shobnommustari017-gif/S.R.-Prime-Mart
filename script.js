// আপনার প্রোডাক্টের ডেটা
const products = [
    {
        id: 1,
        name: "Men's Bar Neckpiece",
        price: 180,
        image: "b2.jpg", // প্রয়োজন অনুযায়ী আপনার ফাইলের সঠিক নাম দেবেন
        inStock: true
    },
    {
        id: 2,
        name: "Men's Bar Bracelet",
        price: 200,
        image: "b1.jpg",
        inStock: true
    },
    {
        id: 3,
        name: "Luxury Islamic Ayatul Kursi Cuff Bracelet",
        price: 200,
        image: "b3.jpg",
        inStock: true
    }
];

// প্রোডাক্টগুলোকে HTML-এ ডায়নামিকালি রেন্ডার করার ফাংশন
function renderProducts() {
    const container = document.getElementById('product-container');
    if (!container) return;

    container.innerHTML = products.map(product => `
        <div class="product-card">
            <div>
                <div class="image-box">
                    <img src="${product.image}" alt="${product.name}" loading="lazy">
                </div>
                <div class="product-info">
                    <div class="product-title">${product.name}</div>
                    <div class="price-stock-row">
                        <span class="product-price">৳${product.price}</span>
                        <span class="stock-status ${product.inStock ? '' : 'stock-out'}">
                            ${product.inStock ? 'In stock' : 'Stock out'}
                        </span>
                    </div>
                </div>
            </div>
            <button class="add-to-cart-btn" onclick="addToCart(${product.id})">
                🛒 Add to cart
            </button>
        </div>
    `).join('');
}

// অ্যাড টু কার্ট ফাংশনালিটি (আপনার প্রয়োজন অনুযায়ী কাস্টমাইজ করতে পারবেন)
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    alert(`${product.name} আপনার কার্টে যুক্ত করা হয়েছে!`);
}

// পেজ লোড হলে প্রোডাক্ট শো করবে
document.addEventListener('DOMContentLoaded', renderProducts);



       


    

   

    

    
           
        

       



