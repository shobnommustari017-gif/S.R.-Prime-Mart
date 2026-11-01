const scriptURL = 'https://script.google.com/macros/s/AKfycbz2Z_gMBpJan9ONW_QZScU9NPJlMHOvhmxb0XfRBCKESE0-g60eLXupyTQDybRXhjjW/exec';

// প্রোডাক্ট লিস্ট (নতুন ওয়াচ প্রোডাক্ট b4.png সহ যুক্ত করা হলো)
const products = [
    {
        id: 1,
        name: "Luxury Islamic Ayatul Kursi Cuff Bracelet",
        price: 400,
        image: "logo.jpg", // আগের প্রোডাক্টের ছবি থাকলে তা থাকবে
        stock: "In stock"
    },
    {
        id: 2,
        name: "S.R. Prime Mart Exclusive Watch",
        price: 2500,
        image: "b4.png", // আপনার দেওয়া নতুন ছবি
        stock: "In stock"
    }
];

let cart = [];

// পে লোড হওয়ার সাথে সাথে প্রোডাক্টগুলো রেন্ডার করা
document.addEventListener("DOMContentLoaded", function () {
    renderProducts();
    setupForm();
});

// প্রোডাক্ট রেন্ডার ফাংশন
function renderProducts() {
    const container = document.getElementById("product-container");
    if (!container) return;

    container.innerHTML = "";
    products.forEach(product => {
        const card = document.createElement("div");
        card.className = "product-card";
        card.innerHTML = `
            <div class="image-box" onclick="openQuickView(${product.id})">
                <img src="${product.image}" alt="${product.name}" onerror="this.src='logo.jpg'">
            </div>
            <h4 class="product-title" onclick="openQuickView(${product.id})">${product.name}</h4>
            <div class="price-stock-row">
                <span class="product-price">৳${product.price}</span>
                <span class="stock-badge">${product.stock}</span>
            </div>
            <button class="add-cart-btn" onclick="addToCart(${product.id})">Add to Cart</button>
        `;
        container.appendChild(card);
    });
}

// কার্টে প্রোডাক্ট যোগ করা
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    const existing = cart.find(item => item.id === productId);

    if (existing) {
        existing.qty += 1;
    } else {
        cart.push({ ...product, qty: 1 });
    }
    updateCartUI();
    toggleMiniCart(true);
}

// কার্ট ইউআই আপডেট করা
function updateCartUI() {
    const cartCount = document.getElementById("cartCount");
    const checkoutItemCount = document.getElementById("checkoutItemCount");
    const miniCartItems = document.getElementById("miniCartItems");
    const miniCartSubtotal = document.getElementById("miniCartSubtotal");
    const checkoutOrderItems = document.getElementById("checkoutOrderItems");
    const summarySubtotal = document.getElementById("summarySubtotal");
    const summaryTotal = document.getElementById("summaryTotal");

    let totalCount = 0;
    let subtotal = 0;

    if (cart.length === 0) {
        if (miniCartItems) miniCartItems.innerHTML = `<p class="empty-msg">আপনার কার্ট খালি আছে</p>`;
        if (checkoutOrderItems) checkoutOrderItems.innerHTML = `<p class="empty-msg">আপনার কার্ট খালি আছে</p>`;
    } else {
        if (miniCartItems) miniCartItems.innerHTML = "";
        if (checkoutOrderItems) checkoutOrderItems.innerHTML = "";

        cart.forEach(item => {
            totalCount += item.qty;
            subtotal += item.price * item.qty;

            // মিনি কার্ট রো
            if (miniCartItems) {
                const itemRow = document.createElement("div");
                itemRow.className = "cart-item-row";
                itemRow.innerHTML = `
                    <span>${item.name} (${item.qty}x)</span>
                    <span>৳${item.price * item.qty}</span>
                `;
                miniCartItems.appendChild(itemRow);
            }

            // চেকআউট পেজ আইটেম লিস্ট
            if (checkoutOrderItems) {
                const checkItem = document.createElement("div");
                checkItem.className = "checkout-item";
                checkItem.innerHTML = `
                    <img src="${item.image}" alt="${item.name}" onerror="this.src='logo.jpg'">
                    <div class="item-details">
                        <div class="item-title">${item.name}</div>
                        <div class="item-qty">Qty: ${item.qty}</div>
                    </div>
                    <span>৳${item.price * item.qty}</span>
                `;
                checkoutOrderItems.appendChild(checkItem);
            }
        });
    }

    if (cartCount) cartCount.textContent = totalCount;
    if (checkoutItemCount) checkoutItemCount.textContent = totalCount;
    if (miniCartSubtotal) miniCartSubtotal.textContent = `৳${subtotal}`;
    if (summarySubtotal) summarySubtotal.textContent = `৳${subtotal}`;

    // ডেলিভারি চার্জ ক্যালকুলেশন
    const districtSelect = document.getElementById("custDistrict");
    let delivery = 70;
    if (districtSelect) {
        if (districtSelect.value === "Dhaka Sub-Area") delivery = 110;
        else if (districtSelect.value === "Outside Dhaka") delivery = 130;
    }

    const summaryDelivery = document.getElementById("summaryDelivery");
    if (summaryDelivery) summaryDelivery.textContent = `৳${delivery}`;

    const grandTotal = subtotal + (subtotal > 0 ? delivery : 0);
    if (summaryTotal) summaryTotal.textContent = `৳${grandTotal}`;
}

// ডেলিভারি চার্জ পরিবর্তন হ্যান্ডেল করা
function updateDeliveryCharge() {
    updateCartUI();
}

// মিনি কার্ট টগল করা
function toggleMiniCart(forceOpen = false) {
    const miniCart = document.getElementById("miniCart");
    if (!miniCart) return;
    if (forceOpen) {
        miniCart.classList.add("active");
    } else {
        miniCart.classList.toggle("active");
    }
}

// সেকশন পরিবর্তন (শপ থেকে চেকআউট বা ব্যাক)
function showSection(sectionId) {
    const shopView = document.getElementById("shop-view");
    const checkoutView = document.getElementById("checkout-view");
    const notice = document.getElementById("topSuccessNotice");

    if (sectionId === 'shop-view') {
        if (shopView) shopView.style.display = "block";
        if (checkoutView) checkoutView.style.display = "none";
        if (notice) notice.style.display = "none";
    } else if (sectionId === 'checkout-view') {
        if (cart.length === 0) {
            alert("আপনার কার্টে কোনো প্রোডাক্ট নেই!");
            return;
        }
        if (shopView) shopView.style.display = "none";
        if (checkoutView) checkoutView.style.display = "block";
        toggleMiniCart(false);
    }
    window.scrollTo(0, 0);
}

function goToCheckout() {
    showSection('checkout-view');
}

// কুইক ভিউ মডাল
function openQuickView(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    document.getElementById("qvImage").src = product.image;
    document.getElementById("qvTitle").textContent = product.name;
    document.getElementById("qvPrice").textContent = `৳${product.price}`;
    
    const addBtn = document.getElementById("qvAddBtn");
    addBtn.onclick = function() {
        addToCart(product.id);
        closeQuickView();
    };

    document.getElementById("quickViewModal").style.display = "flex";
}

function closeQuickView() {
    document.getElementById("quickViewModal").style.display = "none";
}

// অর্ডার সাবমিট এবং গুগল শিটে পাঠানো
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

        fetch(scriptURL, { method: 'POST', mode: 'no-cors', body: formData })
            .then(() => {
                showOrderSuccess();
            })
            .catch(() => {
                showOrderSuccess();
            });
    });
}

// অর্ডার সফল হওয়ার পর নোটিফিকেশন ও রিসেট
function showOrderSuccess() {
    document.getElementById('topSuccessNotice').style.display = 'block';
    document.getElementById('checkoutForm').reset();
    cart = [];
    updateCartUI();
    
    const submitBtn = document.getElementById('placeOrderBtn');
    submitBtn.disabled = false;
    submitBtn.textContent = 'Place Order';

    window.scrollTo({ top: 0, behavior: 'smooth' });
}
