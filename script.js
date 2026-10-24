// আপনার Google Apps Script URL
const scriptURL = 'https://script.google.com/macros/s/AKfycbxYNeAUNdXYcUaAeNupvRyoiARb1PGC8au94ZYQzBysMkIop2txBsloRx9C62BDARIF/exec';

// প্রোডাক্টের তথ্য
const products = [
    {
        id: 1,
        name: "Men's Bar Neckpiece",
        price: 180,
        image: "b2.jpg"
    },
    {
        id: 2,
        name: "Men's Bar Bracelet",
        price: 200,
        image: "b1.jpg"
    },
    {
        id: 3,
        name: "Luxury Islamic Ayatul Kursi Cuff Bracelet",
        price: 200,
        image: "b3.jpg"
    }
];

let cartItemCount = 0;

document.addEventListener('DOMContentLoaded', () => {
    renderProducts(products);
});

// প্রোডাক্ট ডিসপ্লে করার ফাংশন
function renderProducts(items) {
    const container = document.getElementById('product-container');
    if (!container) return;

    if (items.length === 0) {
        container.innerHTML = `<p style="grid-column: 1/-1; text-align: center; color: #888;">কোনো প্রোডাক্ট পাওয়া যায়নি!</p>`;
        return;
    }

    container.innerHTML = items.map(product => `
        <div class="product-card">
            <div>
                <div class="image-box">
                    <img src="${product.image}" alt="${product.name}">
                </div>
                <div class="product-title">${product.name}</div>
                <div class="price-stock-row">
                    <span class="product-price">৳${product.price}</span>
                    <span class="stock-badge">In stock</span>
                </div>
            </div>
            <button class="add-cart-btn" onclick="addToCart('${product.name}', ${product.price})">
                <i class="fa-solid fa-cart-plus"></i> Add to cart
            </button>
        </div>
    `).join('');
}

// সার্চ ফাংশনালিটি
function searchProducts() {
    const query = document.getElementById('searchInput').value.toLowerCase();
    const filtered = products.filter(p => p.name.toLowerCase().includes(query));
    renderProducts(filtered);
}

// কার্টে এড করা ও পপ-আপ ওপেন করা
function addToCart(productName, price) {
    cartItemCount++;
    document.getElementById('cartCount').innerText = cartItemCount;
    document.getElementById('selectedProduct').value = `${productName} - ৳${price}`;
    openCart();
}

// পপ-আপ মডাল ওপেন ও ক্লোজ
function openCart() {
    document.getElementById('cartModal').style.display = 'flex';
}

function closeCart() {
    document.getElementById('cartModal').style.display = 'none';
    document.getElementById('successMessage').style.display = 'none';
}

// ফর্ম সাবমিট করা (গুগল শিটে ডাটা পাঠানো)
const orderForm = document.getElementById('orderForm');
if (orderForm) {
    orderForm.addEventListener('submit', function (e) {
        e.preventDefault();

        const submitBtn = document.getElementById('submitBtn');
        const successMessage = document.getElementById('successMessage');

        submitBtn.disabled = true;
        submitBtn.textContent = 'প্রসেসিং হচ্ছে...';

        const formData = new FormData(orderForm);

        fetch(scriptURL, { method: 'POST', body: formData })
            .then(response => showSuccess())
            .catch(error => showSuccess());

        function showSuccess() {
            submitBtn.disabled = false;
            submitBtn.textContent = 'অর্ডার কনফার্ম করুন';
            orderForm.reset();
            successMessage.style.display = 'block';
            
            setTimeout(() => {
                closeCart();
            }, 4000); // ৪ সেকেন্ড পর পপআপ অটো বন্ধ হবে
        }
    });
}
       


    

   

    

    
           
        

       



