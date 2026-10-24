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

// ১. প্রোডাক্ট রেন্ডার
function renderProducts(items) {
    const container = document.getElementById('product-container');
    if (!container) return;

    container.innerHTML = items.map(product => `
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
            <button class="add-cart-btn" onclick="addToCart(${product.id})">
                🛒 Add to cart
            </button>
        </div>
    `).join('');
}

// ২. কার্টে যোগ করা
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    const existingIndex = cart.findIndex(item => item.id === productId);

    if (existingIndex > -1) {
        cart[existingIndex].qty += 1;
    } else {
        cart.push({ ...product, qty: 1 });
    }

    updateCartUI();
    openCartModal(); // কার্টে প্রেস করার সাথে সাথেই পপ-আপ আসবে
}

// ৩. প্লাস মাইনাস কন্ট্রোল
function changeQty(productId, delta) {
    const itemIndex = cart.findIndex(item => item.id === productId);
    if (itemIndex > -1) {
        cart[itemIndex].qty += delta;
        if (cart[itemIndex].qty <= 0) {
            cart.splice(itemIndex, 1);
        }
    }
    updateCartUI();
    if (document.getElementById('checkout-view').style.display === 'block') {
        renderCheckout();
    }
}

// ৪. কার্ট পপ-আপ আপডেট
function updateCartUI() {
    const totalQty = cart.reduce((sum, item) => sum + item.qty, 0);
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);

    document.getElementById('cartCount').innerText = totalQty;
    document.getElementById('modalSubtotal').innerText = `৳${subtotal}`;

    const itemsContainer = document.getElementById('cartItemsContainer');
    if (cart.length === 0) {
        itemsContainer.innerHTML = `<p style="text-align:center; color:#888; padding:15px 0;">আপনার কার্ট খালি আছে</p>`;
    } else {
        itemsContainer.innerHTML = cart.map(item => `
            <div class="cart-item-row">
                <div>
                    <strong>${item.name}</strong>
                    <div style="color: #2e7d32; font-weight: bold;">৳${item.price}</div>
                </div>
                <div class="qty-controls">
                    <button class="qty-btn" onclick="changeQty(${item.id}, -1)">-</button>
                    <span>${item.qty}</span>
                    <button class="qty-btn" onclick="changeQty(${item.id}, 1)">+</button>
                </div>
                <div><strong>৳${item.price * item.qty}</strong></div>
            </div>
        `).join('');
    }
}

// ৫. কার্ট মডাল পপ-আপ খোলা ও বন্ধ
function openCartModal() {
    document.getElementById('cartModal').style.display = 'flex';
}

function closeCartModal() {
    document.getElementById('cartModal').style.display = 'none';
}

// ৬. চেকআউট পেজে যাওয়া
function goToCheckout() {
    if (cart.length === 0) {
        alert('আপনার কার্ট খালি! অনুগ্রহ করে আগে প্রোডাক্ট যোগ করুন।');
        return;
    }
    closeCartModal();
    showSection('checkout-view');
    renderCheckout();
}

function showSection(sectionId) {
    document.getElementById('shop-view').style.display = (sectionId === 'shop-view') ? 'block' : 'none';
    document.getElementById('checkout-view').style.display = (sectionId === 'checkout-view') ? 'block' : 'none';
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ৭. চেকআউট সামারি
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

// ৮. কুইক ইমেজ ভিউ
function openQuickView(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    document.getElementById('qvImage').src = product.image;
    document.getElementById('qvTitle').innerText = product.name;
    document.getElementById('qvPrice').innerText = `৳${product.price}`;
    document.getElementById('qvAddBtn').onclick = function() {
        addToCart(product.id);
        closeQuickView();
    };

    document.getElementById('quickViewModal').style.display = 'flex';
}

function closeQuickView() {
    document.getElementById('quickViewModal').style.display = 'none';
}

// ৯. ফর্ম সাবমিট
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

        fetch(scriptURL, { method: 'POST', body: formData })
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
    updateCartUI();
    document.getElementById('checkoutForm').reset();
}

function searchProducts() {
    const query = document.getElementById('searchInput').value.toLowerCase();
    const filtered = products.filter(p => p.name.toLowerCase().includes(query));
    renderProducts(filtered);
}
