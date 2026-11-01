// প্রোডাক্টের ডেটা (এখানে ঘড়ি পণ্যটি b4.jpg ছবি, নাম এবং ২৫০০ টাকা দামসহ যুক্ত করা হয়েছে)
const products = [
    {
        id: 1,
        title: "ঘড়ি",
        price: 2500,
        image: "b4.jpg",
        stock: true
    }
];

let cart = [];

// পেজ লোড হওয়ার পর প্রোডাক্টগুলো রেন্ডার করা
document.addEventListener("DOMContentLoaded", () => {
    renderProducts(products);
    updateCartUI();
});

// প্রোডাক্ট গ্রিডে দেখানোর ফাংশন
function renderproducts(items) {
    const container = document.getElementById("product-container");
    if (!container) return;

    if (items.length === 0) {
        container.innerHTML = `<p class="empty-msg">কোনো প্রোডাক্ট পাওয়া যায়নি</p>`;
        return;
    }

    container.innerHTML = items.map(p => `
        <div class="product-card">
            <div class="product-img-box" onclick="openQuickView(${p.id})">
                <img src="${p.image}" alt="${p.title}" onerror="this.src='logo.jpg'">
            </div>
            <div class="product-info">
                <h3 onclick="openQuickView(${p.id})">${p.title}</h3>
                <div class="price">৳${p.price}</div>
                <button class="add-cart-btn" onclick="addToCart(${p.id})">Add to Cart</button>
            </div>
        </div>
    `).join('');
}

// কার্টে প্রোডাক্ট যোগ করার ফাংশন
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    const existingItem = cart.find(item => item.id === productId);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }

    updateCartUI();
    toggleMiniCart();
}

// কার্ট ইউজার ইন্টারফেস আপডেট করার ফাংশন
function updateCartUI() {
    const cartCount = document.getElementById("cartCount");
    const checkoutItemCount = document.getElementById("checkoutItemCount");
    const miniCartItems = document.getElementById("miniCartItems");
    const miniCartSubtotal = document.getElementById("miniCartSubtotal");
    const summarySubtotal = document.getElementById("summarySubtotal");
    const summaryTotal = document.getElementById("summaryTotal");
    const checkoutOrderItems = document.getElementById("checkoutOrderItems");

    const totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    if (cartCount) cartCount.innerText = totalCount;
    if (checkoutItemCount) checkoutItemCount.innerText = totalCount;
    if (miniCartSubtotal) miniCartSubtotal.innerText = `৳${subtotal}`;
    if (summarySubtotal) summarySubtotal.innerText = `৳${subtotal}`;

    // ডেলিভারি চার্জ হিসাব করা
    const districtSelect = document.getElementById("custDistrict");
    let deliveryCharge = 70;
    if (districtSelect) {
        if (districtSelect.value === "Dhaka Sub-Area") deliveryCharge = 110;
        if (districtSelect.value === "Outside Dhaka") deliveryCharge = 130;
    }
    
    const summaryDelivery = document.getElementById("summaryDelivery");
    if (summaryDelivery) summaryDelivery.innerText = `৳${deliveryCharge}`;

    const total = subtotal + (cart.length > 0 ? deliveryCharge : 0);
    if (summaryTotal) summaryTotal.innerText = `৳${total}`;

    // মিনি কার্ট আইটেম রেন্ডার
    if (miniCartItems) {
        if (cart.length === 0) {
            miniCartItems.innerHTML = `<p class="empty-msg">আপনার কার্ট খালি আছে</p>`;
        } else {
            miniCartItems.innerHTML = cart.map(item => `
                <div class="mini-cart-item">
                    <img src="${item.image}" alt="${item.title}" onerror="this.src='logo.jpg'">
                    <div class="mini-item-details">
                        <h5>${item.title}</h5>
                        <span>৳${item.price} × ${item.quantity}</span>
                    </div>
                    <span class="remove-item" onclick="removeFromCart(${item.id})">&times;</span>
                </div>
            `).join('');
        }
    }

    // চেকআউট পেজের আইটেম লিস্ট রেন্ডার
    if (checkoutOrderItems) {
        if (cart.length === 0) {
            checkoutOrderItems.innerHTML = `<p class="empty-msg">কোনো প্রোডাক্ট নেই</p>`;
        } else {
            checkoutOrderItems.innerHTML = cart.map(item => `
                <div class="checkout-item-row">
                    <span>${item.title} × ${item.quantity}</span>
                    <span>৳${item.price * item.quantity}</span>
                </div>
            `).join('');
        }
    }
}

// কার্ট থেকে আইটেম সরানোর ফাংশন
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCartUI();
}

// মিনি কার্ট টগল করার ফাংশন
function toggleMiniCart() {
    const miniCart = document.getElementById("miniCart");
    if (miniCart) {
        miniCart.style.display = miniCart.style.display === "block" ? "none" : "block";
    }
}

// সেকশন পরিবর্তনের ফাংশন (হোম পেজ ও চেকআউট পেজ যাওয়া-আসা)
function showSection(sectionId) {
    const shopView = document.getElementById("shop-view");
    const checkoutView = document.getElementById("checkout-view");

    if (sectionId === 'shop-view') {
        if (shopView) shopView.style.display = "block";
        if (checkoutView) checkoutView.style.display = "none";
    } else if (sectionId === 'checkout-view') {
        if (shopView) shopView.style.display = "none";
        if (checkoutView) checkoutView.style.display = "block";
    }
    window.scrollTo(0, 0);
}

// চেকআউটে যাওয়ার ফাংশন
function goToCheckout() {
    if (cart.length === 0) {
        alert("আপনার কার্ট খালি আছে। দয়া করে আগে প্রোডাক্ট যোগ করুন।");
        return;
    }
    toggleMiniCart();
    showSection('checkout-view');
}

// ডেলিভারি চার্জ আপডেট করার ফাংশন
function updateDeliveryCharge() {
    updateCartUI();
}

// প্রোডাক্ট সার্চ করার ফাংশন
function searchProducts() {
    const query = document.getElementById("searchInput").value.toLowerCase();
    const filtered = products.filter(p => p.title.toLowerCase().includes(query));
    renderProducts(filtered);
}

// কুইক ভিউ বা পপ-আপ ওপেন করার ফাংশন
function openQuickView(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    const modal = document.getElementById("quickViewModal");
    const qvImage = document.getElementById("qvImage");
    const qvTitle = document.getElementById("qvTitle");
    const qvPrice = document.getElementById("qvPrice");
    const qvAddBtn = document.getElementById("qvAddBtn");

    if (qvImage) qvImage.src = product.image;
    if (qvTitle) qvTitle.innerText = product.title;
    if (qvPrice) qvPrice.innerText = `৳${product.price}`;
    if (qvAddBtn) qvAddBtn.onclick = () => {
        addToCart(product.id);
        closeQuickView();
    };

    if (modal) modal.style.display = "block";
}

// কুইক ভিউ পপ-আপ বন্ধ করার ফাংশন
function closeQuickView() {
    const modal = document.getElementById("quickViewModal");
    if (modal) modal.style.display = "none";
}

// অর্ডার সাবমিট ফর্ম হ্যান্ডলার
const checkoutForm = document.getElementById("checkoutForm");
if (checkoutForm) {
    checkoutForm.addEventListener("submit", function(e) {
        e.preventDefault();
        
        if (cart.length === 0) {
            alert("আপনার কার্ট খালি!");
            return;
        }

        const notice = document.getElementById("topSuccessNotice");
        if (notice) notice.style.display = "block";

        // কার্ট ও ফর্ম ক্লিয়ার করা
        cart = [];
        updateCartUI();
        checkoutForm.reset();
        
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}
