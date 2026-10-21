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

// আসল Google Apps Script Web App URL
const GOOGLE_SCRIPT_URL =
    "https://script.google.com/macros/s/AKfycbxYNeAUNdXYcUaAeNupvRyoiARb1PGC8au94ZYQzBysMkIop2txBsloRx9C62BDARIF/exec";

let cart = [];
let isSubmitting = false;

const deliveryCharges = {
    inside: 70,
    subarea: 110,
    outside: 130
};

const deliveryNames = {
    inside: "Inside Dhaka",
    subarea: "Sub-area",
    outside: "Outside Dhaka"
};

const $ = id => document.getElementById(id);

const container = $("product-container");
const searchInput = $("search-input");
const searchBtn = $("search-btn");
const cartModal = $("cart-modal");
const cartOverlay = $("cart-overlay");
const cartIconBtn = $("cart-icon-btn");
const closeCartBtn = $("close-cart");
const cartItemsContainer = $("cart-items");
const cartCount = $("cart-count");
const deliveryArea = $("delivery-area");
const productSubtotal = $("product-subtotal");
const deliveryCharge = $("delivery-charge");
const cartTotalPrice = $("cart-total-price");
const checkoutBtn = $("checkout-btn");
const orderNotice = $("order-notice");

function displayProducts(items) {
    container.innerHTML = "";

    if (!items.length) {
        container.textContent = "No products found.";
        return;
    }

    items.forEach(product => {
        const card = document.createElement("div");
        card.className = "product-card";

        const img = document.createElement("img");
        img.src = product.image;
        img.alt = product.name;
        img.onerror = () => {
            img.alt = product.name + " image unavailable";
        };

        const title = document.createElement("h3");
        title.textContent = product.name;

        const price = document.createElement("p");
        price.textContent = `${product.price} BDT`;

        const button = document.createElement("button");
        button.className = "add-to-cart-btn";
        button.textContent = "Add to Cart";
        button.addEventListener("click", () => addToCart(product.id));

        card.append(img, title, price, button);
        container.appendChild(card);
    });
}

function addToCart(productId) {
    const product = products.find(p => p.id === productId);

    if (product) {
        cart.push({ ...product });
        updateCartUI();
        hideNotice();
    }
}

function removeFromCart(index) {
    cart.splice(index, 1);
    updateCartUI();
    hideNotice();
}

function updateCartUI() {
    cartCount.textContent = cart.length;
    cartItemsContainer.innerHTML = "";

    if (!cart.length) {
        const empty = document.createElement("p");
        empty.className = "empty-cart";
        empty.textContent = "Your cart is empty.";
        cartItemsContainer.appendChild(empty);
    }

    cart.forEach((item, index) => {
        const row = document.createElement("div");
        row.className = "cart-item";

        const info = document.createElement("div");
        info.className = "cart-item-info";

        const name = document.createElement("strong");
        name.textContent = item.name;

        const price = document.createElement("p");
        price.textContent = `${item.price} BDT`;

        info.append(name, price);

        const remove = document.createElement("button");
        remove.className = "remove-btn";
        remove.textContent = "Remove";
        remove.addEventListener("click", () => removeFromCart(index));

        row.append(info, remove);
        cartItemsContainer.appendChild(row);
    });

    updateTotals();
}

function updateTotals() {
    const subtotal = cart.reduce((sum, item) => sum + item.price, 0);
    const charge = deliveryCharges[deliveryArea.value] ?? 70;

    productSubtotal.textContent = `${subtotal} BDT`;
    deliveryCharge.textContent = `${charge} BDT`;
    cartTotalPrice.textContent = `${subtotal + charge} BDT`;
}

function openCart() {
    cartModal.classList.add("open");
    cartOverlay.classList.add("open");
    updateCartUI();
}

function closeCart() {
    cartModal.classList.remove("open");
    cartOverlay.classList.remove("open");
}

function showNotice(message, type) {
    orderNotice.textContent = message;
    orderNotice.className = `order-notice ${type}`;
    orderNotice.hidden = false;
}

function hideNotice() {
    orderNotice.hidden = true;
    orderNotice.textContent = "";
    orderNotice.className = "order-notice";
}

function searchProducts() {
    const query = searchInput.value.trim().toLowerCase();

    displayProducts(
        products.filter(product =>
            product.name.toLowerCase().includes(query)
        )
    );
}

cartIconBtn.addEventListener("click", openCart);
closeCartBtn.addEventListener("click", closeCart);
cartOverlay.addEventListener("click", closeCart);
deliveryArea.addEventListener("change", updateTotals);
searchBtn.addEventListener("click", searchProducts);
searchInput.addEventListener("input", searchProducts);

checkoutBtn.addEventListener("click", async () => {
    if (isSubmitting) return;

    // Get input elements
    const nameInput = $("cust-name");
    const phoneInput = $("cust-phone");
    const addressInput = $("cust-address");

    // Get input values
    const name = nameInput.value.trim();
    const phone = phoneInput.value.trim();
    const address = addressInput.value.trim();

    // Reset red borders on every attempt
    nameInput.style.border = "";
    phoneInput.style.border = "";
    addressInput.style.border = "";

    let hasError = false;

    // Name Validation
    if (!name) {
        nameInput.style.border = "2px solid red";
        hasError = true;
    }

    // Phone Validation (at least 11 digits)
    if (!phone || phone.length < 11) {
        phoneInput.style.border = "2px solid red";
        hasError = true;
    }

    // Address Validation (at least 10 characters for proper house/thana/district details)
    if (!address || address.length < 10) {
        addressInput.style.border = "2px solid red";
        hasError = true;
    }

    // Cart Check
    if (!cart.length) {
        alert("Please add products to your cart first.");
        return;
    }

    // If validation fails, highlight fields and stop submission
    if (hasError) {
        showNotice(
            "লাল চিহ্নিত ঘরগুলো সঠিক তথ্য দিয়ে পূরণ করুন (নাম, ১১ ডিজিটের ফোন নম্বর এবং সম্পূর্ণ ঠিকানা)।",
            "error"
        );
        return;
    }

    if (!/^https:\/\/script\.google\.com\/macros\/s\/.+\/exec$/.test(
        GOOGLE_SCRIPT_URL
    )) {
        showNotice("Google Apps Script URL is invalid.", "error");
        return;
    }

    const area = deliveryArea.value;
    const subtotal = cart.reduce((sum, item) => sum + item.price, 0);
    const charge = deliveryCharges[area] ?? 50;
    const total = subtotal + charge;

    // Prepare payload matching Apps Script doPost structure
    const orderPayload = {
        customer: {
            name: name,
            phone: phone,
            address: address
        },
        items: cart.map(item => ({
            name: item.name,
            quantity: 1
        })),
        subtotal: subtotal,
        deliveryCharge: charge,
        total: total
    };

    isSubmitting = true;
    checkoutBtn.disabled = true;
    checkoutBtn.textContent = "Submitting Order...";
    hideNotice();

    try {
        await fetch(GOOGLE_SCRIPT_URL, {
            method: "POST",
            mode: "no-cors",
            headers: {
                "Content-Type": "text/plain;charset=UTF-8"
            },
            body: JSON.stringify(orderPayload)
        });

        // Custom order confirmation message
        showNotice(
            "আপনার অর্ডারটি সফলভাবে গৃহীত হয়েছে! অর্ডারটি নিশ্চিত করতে খুব শীঘ্রই আমাদের প্রতিনিধি আপনার সাথে ফোনে যোগাযোগ করবেন। SR Prime Mart-এর সাথে থাকার জন্য ধন্যবাদ।",
            "success"
        );

        cart = [];
        updateCartUI();

        // Clear input fields
        $("cust-name").value = "";
        $("cust-phone").value = "";
        $("cust-address").value = "";

    } catch (error) {
        console.error("Order submission error:", error);

        showNotice(
            "অর্ডার পাঠানো যায়নি। ইন্টারনেট সংযোগ পরীক্ষা করে আবার চেষ্টা করুন।",
            "error"
        );
    } finally {
        isSubmitting = false;
        checkoutBtn.disabled = false;
        checkoutBtn.textContent = "Place Order";
    }
});

displayProducts(products);
updateCartUI();




