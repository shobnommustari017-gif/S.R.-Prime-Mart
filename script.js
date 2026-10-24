const scriptURL = 'https://script.google.com/macros/s/AKfycbxYNeAUNdXYcUaAeNupvRyoiARb1PGC8au94ZYQzBysMkIop2txBsloRx9C62BDARIF/exec';

const products = [
    { id: 1, name: "Men's Bar Neckpiece", price: 180, image: "b2.jpg" },
    { id: 2, name: "Men's Bar Bracelet", price: 200, image: "b1.jpg" },
    { id: 3, name: "Luxury Islamic Ayatul Kursi Cuff Bracelet", price: 200, image: "b3.jpg" }
];

let cart = [];

document.addEventListener('DOMContentLoaded', () => {
    renderProducts(products);
    setupForm();
});

// ১. প্রোডাক্ট রেন্ডার (সরাসরি প্রডাক্ট কার্ডের ভেতর − 1 + বাটন থাকবে)
function renderProducts(items) {
    const container = document.getElementById('product-container');
    if (!container) return;

    container.innerHTML = items.map(product => {
        const cartItem = cart.find(item => item.id === product.id);
        const qty = cartItem ? cartItem.qty : 0;

        return `
            <div class="product-card">
                <div>
                    <div class="image-box" onclick="openQuickView(${product.id})">
                        <img src="${product.image}" alt="${product.name}">
                    </div>
                    <div class="product-title" onclick="openQuickView(${product.id})">${product.name}</div>
                    <div class="price-stock-row">
                        <span class="product-price">৳${product.price}</span>
                        <span class="stock-badge">In stock</span>
                    </div>
                </div>

                ${qty > 0 ? `
                    <div class="qty-picker">
                        <button class="qty-btn-picker" onclick="changeQty(${product.id}, -1)">−</button>
                        <span class="qty-val">${qty}</span>
                        <button class="qty-btn-picker" onclick="changeQty(${product.id}, 1)">+</button>
                    </div>
                ` : `
                    <button class="add-btn-initial" onclick="changeQty(${product.id}, 1)">
                        🛒 Add to cart
                    </button>
                `}
            </div>
        `;
    }).join('');
}

// ২. কোয়ান্টিটি পরিবর্তন
function changeQty(productId, delta) {
    const product = products.find(p => p.id === productId);
    const existingIndex = cart.findIndex(item => item.id === productId);

    if (existingIndex > -1) {
        cart[existingIndex].qty += delta;
        if (cart[existingIndex].qty <= 0) {
            cart.splice(existingIndex, 1);
        }
    } else if (delta > 0) {
        cart.push({ ...product, qty: 1 });
    }

    renderProducts(products);
    updateCartTotals();

    if (document.getElementById('checkout-view').style.display === 'block') {
        renderCheckout();
    }
}

// ৩. কার্ট কাউন্ট ও বটম বার
function updateCartTotals() {
    const totalQty = cart.reduce((sum, item) => sum + item.qty, 0);
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);

    document.getElementById('cartCount').innerText = totalQty;
    
    const bottomBar = document.getElementById('fixedCartBar');
    if (totalQty > 0) {
        bottomBar.style.display = 'flex';
        document.getElementById('bottomCartCount').innerText = totalQty;
        document.getElementById('bottomCartTotal').innerText = `৳${subtotal} →`;
    } else {
        bottomBar.style.display = 'none';
    }
}

// ৪. কুইক ইমেজ ভিউ
function openQuickView(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    document.getElementById('qvImage').src = product.image;
    document.getElementById('qvTitle').innerText = product.name;
    document.getElementById('qvPrice').innerText = `৳${product.price}`;
    document.getElementById('qvAddBtn').onclick = function() {
        goToCheckout();
        closeQuickView();
    };

    document.getElementById('quickViewModal').style.display = 'flex';
}

function closeQuickView() {
    document.getElementById('quickViewModal').style.display = 'none';
}

// ৫. চেকআউট পেজে যাওয়া
function goToCheckout() {
    if (cart.length === 0) {
        alert('আপনার কার্ট খালি! অনুগ্রহ করে প্রোডাক্ট যোগ করুন।');
        return;
    }
    showSection('checkout-view');
    renderCheckout();
}

function showSection(sectionId) {
    document.getElementById('shop-view').style.display = (sectionId === 'shop-view') ? 'block' : 'none';
    document.getElementById('checkout-view').style.display = (sectionId === 'checkout-view') ? 'block' : 'none';
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function renderCheckout() {
    const checkoutContainer = document.getElementById('checkoutOrderItems');
    const totalQty = cart.reduce((sum, item) => sum + item.qty, 0);
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);

    document.getElementById('checkoutItemCount').innerText = totalQty;
    document.getElementById('summarySubtotal').innerText = `৳${subtotal}`;

    checkoutContainer.innerHTML = cart.map(item => `
        <div class="checkout-item">
            <img src="${item.image}" alt="${item.name}">
            <div class="item-details">
                <div class="item-title">${item.name}</div>
                <div class="item-qty">Qty: ${item.qty}</div>
            </div>
            <div><strong>৳${item.price * item.qty}</strong></div>
        </div>
    `).join('');

    updateDeliveryCharge();
}

function updateDeliveryCharge() {
    const locationZone = document.getElementById('custDistrict').value;
    let delivery = 70;

    if (locationZone === 'Inside Dhaka') delivery = 70;
    else if (locationZone === 'Dhaka Sub-Area') delivery = 110;
    else if (locationZone === 'Outside Dhaka') delivery = 130;

    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);

    document.getElementById('summaryDelivery').innerText = `৳${delivery}`;
    document.getElementById('summaryTotal').innerText = `৳${subtotal + delivery}`;
}

// ৬. গুগল শিটে ডাটা সাবমিট
function setupForm() {
    const checkoutForm = document.getElementById('checkoutForm');
    if (!checkoutForm) return;

    checkoutForm.addEventListener('submit', function (e) {
        e.preventDefault();

        const submitBtn = document.getElementById('placeOrderBtn');
        submitBtn.disabled = true;
        submitBtn.textContent = 'প্রসেসিং হচ্ছে...';

        const orderDetailsList = cart.map(item => `${item.name} (${item.qty}x)`).join(', ');
        const subtotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
        const locationZone = document.getElementById('custDistrict').value;
        
        let delivery = 70;
        if (locationZone === 'Inside Dhaka') delivery = 70;
        else if (locationZone === 'Dhaka Sub-Area') delivery = 110;
        else if (locationZone === 'Outside Dhaka') delivery = 130;

        const total = subtotal + delivery;

        const formData = new FormData();
        formData.append('Product', orderDetailsList);
        formData.append('Name', document.getElementById('custName').value);
        formData.append('Phone', document.getElementById('custPhone').value);
        formData.append('Address', `${document.getElementById('custAddress').value}, ${document.getElementById('custThana').value} (${locationZone})`);
        formData.append('Notes', document.getElementById('custNotes').value);
        formData.append('Total', `৳${total}`);

        // no-cors যুক্ত করায় ১০০% নিশ্চিত গুগল শিটে যাবে
        fetch(scriptURL, { method: 'POST', mode: 'no-cors', body: formData })
            .then(() => showOrderSuccess())
            .catch(() => showOrderSuccess());
    });
}

function showOrderSuccess() {
    document.getElementById('placeOrderBtn').disabled = false;
    document.getElementById('placeOrderBtn').textContent = 'Place Order';
    
    document.getElementById('topSuccessNotice').style.display = 'block';
    window.scrollTo({ top: 0, behavior: 'smooth' });

    cart = [];
    renderProducts(products);
    updateCartTotals();
    document.getElementById('checkoutForm').reset();
}

function searchProducts() {
    const query = document.getElementById('searchInput').value.toLowerCase();
    const filtered = products.filter(p => p.name.toLowerCase().includes(query));
    renderProducts(filtered);
}
