/* Product Data */

const products = [

    {
        id: 1,
        name: "Classic T-Shirt",
        price: 499,
        category: "clothing",
        stock: 10,
        image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab"
    },

    {
        id: 2,
        name: "Running Shoes",
        price: 1499,
        category: "shoes",
        stock: 5,
        image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff"
    },

    {
        id: 3,
        name: "Smart Watch",
        price: 2499,
        category: "electronics",
        stock: 3,
        image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30"
    },

    {
        id: 4,
        name: "Backpack",
        price: 899,
        category: "accessories",
        stock: 8,
        image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62"
    },

    {
        id: 5,
        name: "Wireless Headphones",
        price: 1999,
        category: "electronics",
        stock: 4,
        image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e"
    },

    {
        id: 6,
        name: "Sunglasses",
        price: 699,
        category: "accessories",
        stock: 6,
        image: "https://images.unsplash.com/photo-1511499767150-a48a237f0083"
    }

];


/* Load Saved Cart */

let cart =
    JSON.parse(
        localStorage.getItem("cart")
    ) || [];


/* Coupon */

let discount = 0;
let couponApplied = false;


/* Selected Category */

let selectedCategory = "all";


/* Display Products */

function displayProducts() {

    displayFilteredProducts(products);

}


/* Display Filtered Products */

function displayFilteredProducts(filteredProducts) {

    const productList =
        document.getElementById("productList");

    productList.innerHTML = "";


    if (filteredProducts.length === 0) {

        productList.innerHTML = `

            <div class="empty-cart">
                No products found.
            </div>

        `;

        return;
    }


    filteredProducts.forEach(function(product) {

        const productCard =
            document.createElement("div");

        productCard.className =
            "product-card";


        productCard.innerHTML = `

            <img
                src="${product.image}"
                alt="${product.name}"
                class="product-image">

            <h3>
                ${product.name}
            </h3>

            <div class="product-price">
                ₹${product.price}
            </div>

            <div class="stock-info">

                ${
                    product.stock > 0
                        ? `In Stock (${product.stock})`
                        : "Out of Stock"
                }

            </div>

            <button
                class="add-button"
                onclick="addToCart(${product.id})"
                ${product.stock === 0 ? "disabled" : ""}>

                ${
                    product.stock > 0
                        ? "Add to Cart"
                        : "Out of Stock"
                }

            </button>

        `;


        productList.appendChild(productCard);

    });

}


/* Filter Products */

function filterProducts() {

    const searchInput =
        document.getElementById("searchInput");

    const searchText =
        searchInput.value
            .toLowerCase()
            .trim();


    const filteredProducts =
        products.filter(function(product) {

            const matchesSearch =
                product.name
                    .toLowerCase()
                    .includes(searchText);


            const matchesCategory =
                selectedCategory === "all" ||
                product.category === selectedCategory;


            return matchesSearch &&
                matchesCategory;

        });


    displayFilteredProducts(
        filteredProducts
    );

}


/* Search Products */

const searchInput =
    document.getElementById("searchInput");

searchInput.addEventListener(
    "input",
    function() {

        filterProducts();

    }
);


/* Product Categories */

const categoryButtons =
    document.querySelectorAll(
        ".category-button"
    );


categoryButtons.forEach(function(button) {

    button.addEventListener(
        "click",
        function() {

            categoryButtons.forEach(
                function(item) {

                    item.classList.remove(
                        "active"
                    );

                }
            );


            button.classList.add("active");


            selectedCategory =
                button.dataset.category;


            filterProducts();

        }
    );

});


/* Add Product to Cart */

function addToCart(productId) {

    const product =
        products.find(function(item) {

            return item.id === productId;

        });


    if (!product || product.stock <= 0) {

        alert(
            "This product is out of stock."
        );

        return;
    }


    const existingItem =
        cart.find(function(item) {

            return item.id === productId;

        });


    if (existingItem) {

        if (
            existingItem.quantity >=
            product.stock
        ) {

            alert(
                "No more stock available."
            );

            return;
        }


        existingItem.quantity++;

    } else {

        cart.push({

            id: product.id,
            name: product.name,
            price: product.price,
            quantity: 1

        });

    }


    saveCart();
    displayCart();

}


/* Save Cart */

function saveCart() {

    localStorage.setItem(
        "cart",
        JSON.stringify(cart)
    );

}


/* Get Product Image */

function getProductImage(productId) {

    const product =
        products.find(function(item) {

            return item.id === productId;

        });


    return product
        ? product.image
        : "";

}


/* Display Cart */

function displayCart() {

    const cartItems =
        document.getElementById(
            "cartItems"
        );


    const cartCount =
        document.getElementById(
            "cartCount"
        );


    const totalPrice =
        document.getElementById(
            "totalPrice"
        );


    const subtotalPrice =
        document.getElementById(
            "subtotalPrice"
        );


    const discountPrice =
        document.getElementById(
            "discountPrice"
        );


    const checkoutButton =
        document.getElementById(
            "checkoutButton"
        );


    cartItems.innerHTML = "";


    if (cart.length === 0) {

        cartItems.innerHTML = `

            <div class="empty-cart">
                Your cart is empty.
            </div>

        `;

    }


    let total = 0;
    let count = 0;


    cart.forEach(function(item) {

        const cartItem =
            document.createElement("div");

        cartItem.className =
            "cart-item";


        cartItem.innerHTML = `

            <div class="cart-product">

                <img
                    src="${getProductImage(item.id)}"
                    alt="${item.name}"
                    class="cart-image">

                <div>

                    <strong>
                        ${item.name}
                    </strong>

                    <div>
                        ₹${item.price}
                    </div>

                </div>

            </div>


            <div class="cart-controls">

                <button
                    class="quantity-button"
                    onclick="decreaseQuantity(${item.id})">

                    −

                </button>


                <span>
                    ${item.quantity}
                </span>


                <button
                    class="quantity-button"
                    onclick="increaseQuantity(${item.id})">

                    +

                </button>


                <button
                    class="remove-button"
                    onclick="removeFromCart(${item.id})">

                    Remove

                </button>

            </div>

        `;


        cartItems.appendChild(cartItem);


        total +=
            item.price *
            item.quantity;


        count +=
            item.quantity;

    });


    const discountAmount =
        total * discount / 100;


    const finalTotal =
        total - discountAmount;


    cartCount.textContent =
        count;


    subtotalPrice.textContent =
        total;


    discountPrice.textContent =
        discountAmount;


    totalPrice.textContent =
        finalTotal;


    checkoutButton.disabled =
        cart.length === 0;

}


/* Increase Product Quantity */

function increaseQuantity(productId) {

    const item =
        cart.find(function(item) {

            return item.id === productId;

        });


    const product =
        products.find(function(product) {

            return product.id === productId;

        });


    if (item && product) {

        if (
            item.quantity >=
            product.stock
        ) {

            alert(
                "No more stock available."
            );

            return;

        }


        item.quantity++;

    }


    saveCart();
    displayCart();

}


/* Decrease Product Quantity */

function decreaseQuantity(productId) {

    const item =
        cart.find(function(item) {

            return item.id === productId;

        });


    if (item) {

        item.quantity--;

    }


    if (
        item &&
        item.quantity <= 0
    ) {

        cart =
            cart.filter(function(item) {

                return item.id !== productId;

            });

    }


    saveCart();
    displayCart();

}


/* Remove Product from Cart */

function removeFromCart(productId) {

    cart =
        cart.filter(function(item) {

            return item.id !== productId;

        });


    saveCart();
    displayCart();

}


/* Apply Coupon */

const couponInput =
    document.getElementById(
        "couponInput"
    );


const couponButton =
    document.getElementById(
        "couponButton"
    );


const couponMessage =
    document.getElementById(
        "couponMessage"
    );


couponButton.addEventListener(
    "click",
    function() {

        const coupon =
            couponInput.value
                .trim()
                .toUpperCase();


        if (cart.length === 0) {

            couponMessage.textContent =
                "Add products to the cart first.";

            return;

        }


        if (couponApplied) {

            couponMessage.textContent =
                "Coupon already applied.";

            return;

        }


        if (coupon === "SAVE10") {

            discount = 10;
            couponApplied = true;


            couponMessage.textContent =
                "10% discount applied.";


            displayCart();

        } else {

            discount = 0;


            couponMessage.textContent =
                "Invalid coupon code.";

        }

    }
);


/* Checkout */

const checkoutButton =
    document.getElementById(
        "checkoutButton"
    );


const checkoutModal =
    document.getElementById(
        "checkoutModal"
    );


const closeModal =
    document.getElementById(
        "closeModal"
    );


const checkoutForm =
    document.getElementById(
        "checkoutForm"
    );


const checkoutTotal =
    document.getElementById(
        "checkoutTotal"
    );


/* Open Checkout */

checkoutButton.addEventListener(
    "click",
    function() {

        if (cart.length === 0) {

            alert(
                "Your cart is empty."
            );

            return;

        }


        checkoutTotal.textContent =
            document.getElementById(
                "totalPrice"
            ).textContent;


        checkoutModal.classList.add(
            "show"
        );

    }
);


/* Close Checkout */

closeModal.addEventListener(
    "click",
    function() {

        checkoutModal.classList.remove(
            "show"
        );

    }
);


/* Place Order */

checkoutForm.addEventListener(
    "submit",
    function(event) {

        event.preventDefault();


        const orderId =
            "SE" + Date.now();


        document.getElementById(
            "orderId"
        ).textContent =
            orderId;


        document.getElementById(
            "successTotal"
        ).textContent =
            checkoutTotal.textContent;


        cart = [];
        discount = 0;
        couponApplied = false;


        localStorage.removeItem(
            "cart"
        );


        checkoutForm.reset();

        couponInput.value = "";

        couponMessage.textContent =
            "";


        checkoutModal.classList.remove(
            "show"
        );


        document.getElementById(
            "successModal"
        ).classList.add(
            "show"
        );


        displayCart();

    }
);


/* Continue Shopping */

const continueShopping =
    document.getElementById(
        "continueShopping"
    );


continueShopping.addEventListener(
    "click",
    function() {

        document.getElementById(
            "successModal"
        ).classList.remove(
            "show"
        );

    }
);


/* Theme Toggle */

const themeButton =
    document.getElementById(
        "themeButton"
    );


const savedTheme =
    localStorage.getItem(
        "theme"
    );


if (savedTheme === "dark") {

    document.body.classList.add(
        "dark-theme"
    );


    themeButton.textContent =
        "☀️";

}


themeButton.addEventListener(
    "click",
    function() {

        document.body.classList.toggle(
            "dark-theme"
        );


        const isDark =
            document.body.classList.contains(
                "dark-theme"
            );


        if (isDark) {

            themeButton.textContent =
                "☀️";


            localStorage.setItem(
                "theme",
                "dark"
            );

        } else {

            themeButton.textContent =
                "🌙";


            localStorage.setItem(
                "theme",
                "light"
            );

        }

    }
);


/* Initialize Application */

displayProducts();
displayCart();