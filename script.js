 
const scriptURL = 'https://script.google.com/macros/s/AKfycbxYNeAUNdXYcUaAeNupvRyoiARb1PGC8au94ZYQzBysMkIop2txBsloRx9C62BDARIF/exec';

// আপনার প্রোডাক্ট ডেটা
const products = [
    {
        id: 1,
        name: "Men's Bar Neckpiece",
        price: 180,
        image: "b2.jpg",
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

// পেজ লোড হলে কাজ করবে
document.addEventListener('DOMContentLoaded', () => {
    renderProducts();
    populateProductSelect();
});

// প্রোডাক্ট গ্রিড রেন্ডার
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
                        <span class="stock-status">In stock</span>
                    </div>
                </div>
            </div>
            <button class="add-to-cart-btn" onclick="selectAndScroll('${product.name}')">
                🛒 Add to cart
            </button>
        </div>
    `).join('');
}

// ড্রপডাউন বক্সে প্রডাক্ট যুক্ত করা
function populateProductSelect() {
    const select = document.getElementById('productSelect');
    if (!select) return;

    products.forEach(product => {
        const option = document.createElement('option');
        option.value = `${product.name} - ৳${product.price}`;
        option.textContent = `${product.name} - ৳${product.price}`;
        select.appendChild(option);
    });
}

// Add to cart চাপলে নিচে ফর্মে অপশন সিলেক্ট হবে
function selectAndScroll(productName) {
    const select = document.getElementById('productSelect');
    for (let option of select.options) {
        if (option.text.includes(productName)) {
            select.value = option.value;
            break;
        }
    }
    document.querySelector('.checkout-section').scrollIntoView({ behavior: 'smooth' });
}

// ফর্ম সাবমিট ও গুগল শিটে ডাটা পাঠানো + সাকসেস মেসেজ
const orderForm = document.getElementById('orderForm');
if (orderForm) {
    orderForm.addEventListener('submit', function (e) {
        e.preventDefault();

        const submitBtn = document.getElementById('submitBtn');
        const successMessage = document.getElementById('successMessage');

        submitBtn.disabled = true;
        submitBtn.textContent = 'প্রসেসিং হচ্ছে...';

        const formData = new FormData(orderForm);

        if (scriptURL && scriptURL !== 'YOUR_GOOGLE_APPS_SCRIPT_URL') {
            fetch(scriptURL, { method: 'POST', body: formData })
                .then(response => showSuccess())
                .catch(error => showSuccess());
        } else {
            showSuccess();
        }

        function showSuccess() {
            submitBtn.disabled = false;
            submitBtn.textContent = 'অর্ডার কনফার্ম করুন';
            orderForm.reset();
            successMessage.style.display = 'block';
        }
    });
}

       


    

   

    

    
           
        

       



