// The Burger Bar - script.js
// This one file runs on every page and powers the cart, menu search, lightbox, forms and map.
// Each section first checks that the elements it needs exist, so nothing breaks on pages that do not use it.

// ---------- Settings ----------

// Business rules used by the enquiry and checkout forms.
const SHOP = {
  contactEmail: "hello@theburgerbardbn.co.za",
  ordersEmail: "orders@theburgerbardbn.co.za",
  openHour: 11,
  closeHour: 20,
  closedDay: 1, // Monday
  deliveryFee: 35,
  freeDeliveryFrom: 500,
  cateringFee: 250,
  maxCartQuantity: 20
};

// ---------- Helpers ----------

// Turns special characters into safe text so user input can never run as HTML.
function escapeHtml(text) {
  const div = document.createElement("div");
  div.textContent = text === undefined || text === null ? "" : String(text);
  return div.innerHTML;
}

// Turns a price like "R79" into the number 79.
function priceToNumber(price) {
  return Number(String(price).replace(/[^0-9.]/g, "")) || 0;
}

// Turns a number like 1250 into "R1 250".
function formatRand(amount) {
  return "R" + Math.round(amount).toLocaleString("en-ZA").replace(/\s/g, " ");
}

// Turns a date into text like "Wednesday 4 November 2026".
function formatDate(date) {
  return date.toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
}

// Turns a date into a time like "17:15".
function formatTime(date) {
  return date.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
}

// Turns a date into the "2026-11-04" format that date inputs use.
function toInputDate(date) {
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return date.getFullYear() + "-" + month + "-" + day;
}

// Returns a new date a number of days after the given date.
function addDays(date, days) {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

// Creates a reference number like ENQ-483921 for confirmations.
function makeReference(prefix) {
  return prefix + "-" + String(Date.now()).slice(-6);
}

// Removes spaces, dashes and brackets from a phone number.
function cleanPhone(phone) {
  return phone.replace(/[\s\-()]/g, "");
}

// Checks for a South African number such as 0821234567 or +27821234567.
function isValidPhone(phone) {
  return /^(\+27|0)[1-9][0-9]{8}$/.test(cleanPhone(phone));
}

// Checks for a simple name@domain.com shape.
function isValidEmail(email) {
  return /^\S+@\S+\.\S+$/.test(email);
}

// ---------- Menu data ----------

// The five menu categories and the section id each one uses on menu.html.
const CATEGORIES = [
  { key: "beef", label: "Beef Burgers", sectionId: "burgers" },
  { key: "chicken", label: "Chicken Burgers", sectionId: "chicken-burgers" },
  { key: "combo", label: "Beef and Chicken Combo", sectionId: "combo" },
  { key: "sides", label: "Sides", sectionId: "sides" },
  { key: "drinks", label: "Drinks & Mocktails", sectionId: "drinks" }
];

// Every product on the menu; the id is also the image file name in the images folder.
const MENU = [
  {
    id: "classic-beef-burger",
    name: "Classic Beef Burger",
    category: "beef",
    price: 79,
    description: "Our signature flame-grilled beef patty served on a toasted bun with crisp lettuce, fresh tomato, and our secret house sauce. Pure, timeless perfection.",
    alt: "Classic beef burger with melted cheese, lettuce and tomato on a sesame bun",
    tags: "smash halal cheese"
  },
  {
    id: "beef-burger-pickled-onions-cucumbers",
    name: "Pickled Onion & Cucumber Beef Burger",
    category: "beef",
    price: 85,
    description: "A savoury flame-grilled beef patty elevated with the sharp crunch of tangy pickled onions and crisp, refreshing cucumbers to cut through the richness.",
    alt: "Beef burger with pickled onions, pickled cucumbers, cheese and lettuce",
    tags: "pickles tangy"
  },
  {
    id: "eggplant-beef-cheese-tomato-burger",
    name: "Eggplant, Beef, Cheese & Tomato Burger",
    category: "beef",
    price: 95,
    description: "A gourmet fusion featuring a juicy beef patty layered with tender grilled eggplant, melted cheddar, fresh tomato, and a hint of garlic aioli.",
    alt: "Beef burger layered with grilled eggplant, melted cheese, tomato and lettuce",
    tags: "brinjal aubergine gourmet"
  },
  {
    id: "stacked-beef-burger",
    name: "Stacked Beef Burger",
    category: "beef",
    price: 119,
    description: "Built for the serious appetite. Multiple layers of premium grilled beef, melted cheese, and fresh toppings stacked high for the ultimate bite.",
    alt: "Tall stacked double beef burger with cheese, salad and chips",
    tags: "double triple big"
  },
  {
    id: "meat-burger-coleslaw-cucumber-tomato-mushrooms-cheese",
    name: "The Loaded Mushroom & Coleslaw Burger",
    category: "beef",
    price: 99,
    description: "An absolute feast. A juicy beef patty loaded with earthy sautéed mushrooms, creamy coleslaw, melted cheese, crisp cucumber, and fresh tomato.",
    alt: "Loaded beef burger with mushrooms, coleslaw, cucumber, tomato and cheese",
    tags: "loaded feast"
  },
  {
    id: "mushroom-coleslaw-beef-burger",
    name: "Mushroom & Coleslaw Beef Burger",
    category: "beef",
    price: 89,
    description: "The perfect balance of textures featuring a savoury grilled beef patty topped with warm, buttery sautéed mushrooms and a cool, crunchy layer of house coleslaw.",
    alt: "Beef burger topped with sautéed mushrooms, coleslaw, cheese and tomato",
    tags: "mushroom"
  },
  {
    id: "seeded-beef-burger-duo",
    name: "Seeded Beef Burger Duo",
    category: "beef",
    price: 109,
    description: "Double the flavour. Two perfectly sized, flame-grilled beef sliders served on soft, toasted artisanal seeded buns with classic trimmings.",
    alt: "Two seeded bun beef burgers served together with chips",
    tags: "sliders two share"
  },
  {
    id: "charcoal-beef-and-macon-cheeseburger",
    name: "Charcoal Beef & Macon Cheeseburger",
    category: "beef",
    price: 115,
    description: "A showstopper. A juicy beef patty, smoky macon, and gooey melted cheese served on a dramatic, striking black activated charcoal bun.",
    alt: "Charcoal bun beef cheeseburger with macon and chips",
    tags: "black bun macon cheeseburger"
  },
  {
    id: "classic-chicken-burger",
    name: "Classic Chicken Burger",
    category: "chicken",
    price: 75,
    description: "Your choice of a tender grilled or golden-crisp fried chicken breast, served with fresh lettuce, tomato, and creamy mayo on a toasted bun.",
    alt: "Classic chicken cheeseburger with lettuce, tomato and sesame bun",
    tags: "grilled fried halal"
  },
  {
    id: "chicken-burger-with-chips",
    name: "Chicken Burger with Chips",
    category: "chicken",
    price: 95,
    description: "Our succulent classic chicken burger paired with a generous side of golden, crispy fries for the ultimate complete meal.",
    alt: "Chicken burger served with a side of herb-seasoned chips",
    tags: "meal fries combo"
  },
  {
    id: "mega-chicken-burger",
    name: "Mega Chicken Burger",
    category: "chicken",
    price: 109,
    description: "Go big or go home. An extra-large, extra-juicy chicken fillet piled high with fresh toppings and a double helping of our signature sauce.",
    alt: "Large chicken burger held with a skewer, served with ketchup",
    tags: "big large"
  },
  {
    id: "bagel-chicken-burger",
    name: "Bagel Chicken Burger",
    category: "chicken",
    price: 85,
    description: "A delightful twist on a classic. A tender chicken fillet served with fresh greens and creamy spread inside a chewy, toasted artisanal bagel.",
    alt: "Chicken burger served on a seeded bagel-style bun with lettuce",
    tags: "bagel"
  },
  {
    id: "sweet-and-spicy-chicken-burger",
    name: "Sweet & Spicy Chicken Burger",
    category: "chicken",
    price: 89,
    description: "The perfect flavour contrast. A crispy chicken breast glazed in a sticky, sweet-and-spicy chilli sauce, balanced with cool, crunchy lettuce.",
    alt: "Sweet and spicy chicken burger served with fries",
    tags: "hot chilli spicy"
  },
  {
    id: "charcoal-chicken-burger",
    name: "Charcoal Chicken Burger",
    category: "chicken",
    price: 99,
    description: "Turn heads with a tender, juicy chicken breast and vibrant toppings served inside our signature, visually stunning black charcoal bun.",
    alt: "Chicken burger served in a black charcoal bun",
    tags: "black bun"
  },
  {
    id: "double-chicken-and-macon-cheeseburger",
    name: "Double Chicken & Macon Cheeseburger",
    category: "chicken",
    price: 119,
    description: "A towering masterpiece featuring two tender chicken fillets, smoky macon, and melted cheese, all layered together in one epic burger.",
    alt: "Double chicken burger with macon, cheese and chips",
    tags: "double macon cheeseburger"
  },
  {
    id: "classic-beef-and-classic-chicken-burgers",
    name: "Classic Beef & Classic Chicken Burgers",
    category: "combo",
    price: 125,
    description: "Can't decide? Get the best of both worlds with this ultimate duo featuring one classic beef slider and one classic chicken slider.",
    alt: "Classic beef burger and classic chicken burger served side by side",
    tags: "duo share both"
  },
  {
    id: "skinny-fries",
    name: "Skinny Fries",
    category: "sides",
    price: 35,
    description: "Vibrant, shoestring-cut golden potatoes fried to crisp perfection and lightly tossed in fine sea salt.",
    alt: "Skinny fries in a paper cone with ketchup",
    tags: "chips fries potato"
  },
  {
    id: "spicy-slap-chips",
    name: "Spicy Slap Chips",
    category: "sides",
    price: 32,
    description: "Traditional, soft-style local slap chips drenched in vinegar and dusted with a bold, fiery blend of spices.",
    alt: "Spicy slap chips piled on a plate",
    tags: "chips vinegar hot"
  },
  {
    id: "potato-wedges",
    name: "Potato Wedges",
    category: "sides",
    price: 38,
    description: "Thick-cut, fluffy potato wedges seasoned with a rustic blend of herbs and spices, baked and fried for a perfect crunch.",
    alt: "Herb-seasoned potato wedges with dipping sauce",
    tags: "wedges potato"
  },
  {
    id: "sweet-potato-fries",
    name: "Sweet Potato Fries",
    category: "sides",
    price: 42,
    description: "Crispy, golden sweet potato strips offering a naturally sweet flavour with a satisfyingly savoury crunch.",
    alt: "Roasted sweet potato fries with chilli flakes and dip",
    tags: "chips fries"
  },
  {
    id: "soda",
    name: "Soda",
    category: "drinks",
    price: 22,
    description: "A refreshing, ice-cold selection of your favourite classic fizzy soft drinks.",
    alt: "Glasses of colourful soda with ice",
    tags: "cold drink fizzy cooldrink"
  },
  {
    id: "chia-infused-sparkling-kombucha",
    name: "Chia-Infused Sparkling Kombucha",
    category: "drinks",
    price: 48,
    description: "A health-forward, fizzy fermented tea packed with gut-friendly probiotics and superfood chia seeds for a unique texture.",
    alt: "Bottles of chia-infused sparkling kombucha with tropical fruit",
    tags: "healthy tea"
  },
  {
    id: "still-water",
    name: "Still Water",
    category: "drinks",
    price: 18,
    description: "Pure, crisp, and perfectly chilled natural spring water to cleanse the palate.",
    alt: "Glass carafe of still water infused with herbs",
    tags: "water"
  },
  {
    id: "red-martini-mocktail",
    name: "Red Martini Mocktail",
    category: "drinks",
    price: 49,
    description: "A sophisticated, alcohol-free blend of tart cranberry, aromatic botanicals, and a sharp twist of citrus, served elegant and chilled.",
    alt: "Red martini mocktail in a martini glass with lemon zest garnish",
    tags: "mocktail alcohol-free cranberry"
  },
  {
    id: "spiced-autumn-apple-mocktail",
    name: "Spiced Autumn Apple Mocktail",
    category: "drinks",
    price: 49,
    description: "Cosy flavours in a glass featuring crisp apple cider infused with warm cinnamon, cloves, and a touch of fresh lemon juice.",
    alt: "Spiced autumn apple mocktail with cinnamon stick and dried orange",
    tags: "mocktail alcohol-free apple"
  },
  {
    id: "mermaid-lagoon-mocktail",
    name: "Mermaid Lagoon Mocktail",
    category: "drinks",
    price: 52,
    description: "A magical, vibrant blue elixir combining tropical blue curaçao syrup, tart lime juice, and a splash of refreshing lemonade.",
    alt: "Blue mermaid lagoon mocktail garnished with apple slices",
    tags: "mocktail alcohol-free blue"
  },
  {
    id: "ruby-lemon-sparkle-mocktail",
    name: "Ruby Lemon Sparkle Mocktail",
    category: "drinks",
    price: 52,
    description: "A brilliant red refresher balancing sweet pomegranate and raspberry syrups with the sharp, zesty fizz of fresh lemonade.",
    alt: "Ruby red lemon sparkle mocktail with citrus peel garnish",
    tags: "mocktail alcohol-free lemonade"
  }
];

// Finds one menu item by its id.
function findMenuItem(id) {
  return MENU.find((item) => item.id === id);
}

// Finds the label of a category by its key.
function categoryLabel(key) {
  const category = CATEGORIES.find((cat) => cat.key === key);
  return category ? category.label : key;
}

// ---------- Cart (saved in localStorage) ----------

const CART_KEY = "burgerBarCart";

// Reads the cart from localStorage, or returns an empty cart.
function getCart() {
  try {
    return JSON.parse(localStorage.getItem(CART_KEY)) || [];
  } catch (error) {
    return [];
  }
}

// Saves the cart to localStorage so it survives page changes.
function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

// Counts how many items are in the cart.
function cartCount(cart) {
  let count = 0;
  cart.forEach((item) => { count += item.quantity; });
  return count;
}

// Adds up the price of everything in the cart.
function cartTotal(cart) {
  let total = 0;
  cart.forEach((item) => { total += priceToNumber(item.price) * item.quantity; });
  return total;
}

// Adds an item to the cart, or increases its quantity if it is already there.
function addToCart(name, price, quantity) {
  const cart = getCart();
  const existing = cart.find((item) => item.name === name);
  quantity = Math.min(SHOP.maxCartQuantity, Math.max(1, Number(quantity) || 1));
  if (existing) {
    existing.quantity = Math.min(SHOP.maxCartQuantity, existing.quantity + quantity);
  } else {
    cart.push({ name: name, price: price, quantity: quantity });
  }
  saveCart(cart);
  updateCartTray();
}

// Builds the sticky cart bar at the bottom of the page the first time it is needed.
function getCartTray() {
  let tray = document.getElementById("cart-tray");
  if (tray) {
    return tray;
  }
  tray = document.createElement("aside");
  tray.id = "cart-tray";
  tray.className = "cart-tray";
  tray.hidden = true;
  tray.setAttribute("aria-label", "Shopping cart summary");
  tray.innerHTML = `
    <div class="site-wrap cart-tray-inner">
      <p class="cart-tray-summary"><strong id="cart-count">0</strong> item(s) · Total <strong id="cart-tray-total">R0</strong></p>
      <div class="cart-tray-actions">
        <a class="btn btn-secondary" href="menu.html">Keep browsing</a>
        <a class="btn" href="order.html">Checkout</a>
      </div>
    </div>`;
  document.body.appendChild(tray);
  return tray;
}

// Shows the cart bar with the latest count and total, or hides it when the cart is empty.
function updateCartTray() {
  const cart = getCart();
  const tray = getCartTray();
  const onCheckoutPage = document.getElementById("cart-items") !== null;
  document.getElementById("cart-count").textContent = cartCount(cart);
  document.getElementById("cart-tray-total").textContent = formatRand(cartTotal(cart));
  tray.hidden = cart.length === 0 || onCheckoutPage;
}

// Briefly changes the button text so the visitor knows the item was added.
function flashAdded(button) {
  const originalText = button.textContent;
  button.textContent = "Added ✓";
  button.classList.add("is-added");
  setTimeout(() => {
    button.textContent = originalText;
    button.classList.remove("is-added");
  }, 900);
}

// One listener on the document handles every "Add to cart" form, even the cards the menu builds later.
document.addEventListener("submit", (event) => {
  const form = event.target;
  if (!form.classList.contains("add-to-cart-form")) {
    return;
  }
  event.preventDefault();
  const name = form.querySelector("input[name='item']").value;
  const price = form.querySelector("input[name='price']").value;
  const quantityInput = form.querySelector("input[name='quantity']");
  const quantity = quantityInput ? quantityInput.value : 1;
  addToCart(name, price, quantity);
  flashAdded(form.querySelector("button[type='submit']"));
});

// ---------- Checkout page (order.html) ----------

// Draws the cart list and totals on the checkout page.
function renderCart() {
  const list = document.getElementById("cart-items");
  if (!list) {
    return;
  }
  const cart = getCart();
  const emptyNote = document.getElementById("cart-empty");
  const totalBox = document.getElementById("cart-total");
  const checkoutBlock = document.getElementById("checkout-block");

  emptyNote.hidden = cart.length > 0;
  totalBox.hidden = cart.length === 0;
  if (checkoutBlock) {
    checkoutBlock.hidden = cart.length === 0;
  }

  list.innerHTML = "";
  cart.forEach((item, index) => {
    const name = escapeHtml(item.name);
    const lineTotal = priceToNumber(item.price) * item.quantity;
    list.innerHTML += `
      <li class="cart-line">
        <div class="cart-line-info">
          <strong>${name}</strong>
          <span class="cart-line-price">${escapeHtml(item.price)} each</span>
        </div>
        <div class="cart-qty" role="group" aria-label="Quantity for ${name}">
          <button type="button" class="cart-qty-btn" data-action="decrease" data-index="${index}" aria-label="Decrease quantity of ${name}">−</button>
          <input class="cart-qty-input" type="number" min="1" max="${SHOP.maxCartQuantity}" value="${item.quantity}" data-index="${index}" aria-label="Quantity of ${name}">
          <button type="button" class="cart-qty-btn" data-action="increase" data-index="${index}" aria-label="Increase quantity of ${name}">+</button>
        </div>
        <span class="cart-line-subtotal">${formatRand(lineTotal)}</span>
        <button type="button" class="cart-remove" data-index="${index}" aria-label="Remove ${name} from cart">Remove</button>
      </li>`;
  });

  document.getElementById("cart-total-amount").textContent = formatRand(cartTotal(cart));
  updateCheckoutTotals();
}

// Changes the quantity of one cart line, removing it when the quantity drops to zero.
function setCartQuantity(index, quantity) {
  const cart = getCart();
  quantity = Math.min(SHOP.maxCartQuantity, Number(quantity) || 0);
  if (quantity < 1) {
    cart.splice(index, 1);
  } else {
    cart[index].quantity = quantity;
  }
  saveCart(cart);
  renderCart();
  updateCartTray();
}

// Checks whether the "delivery" option is selected in a form.
function isDeliveryChosen(form) {
  const checked = form.querySelector("input[type='radio']:checked");
  return checked !== null && checked.value === "delivery";
}

// Works out the delivery fee: R35, or free for orders over the free-delivery amount.
function deliveryFeeFor(subtotal) {
  return subtotal >= SHOP.freeDeliveryFrom ? 0 : SHOP.deliveryFee;
}

// Updates the delivery line and grand total on the checkout page.
function updateCheckoutTotals() {
  const form = document.getElementById("order-form");
  const deliveryLine = document.getElementById("cart-delivery");
  if (!form || !deliveryLine) {
    return;
  }
  const subtotal = cartTotal(getCart());
  const delivery = isDeliveryChosen(form);
  const fee = delivery ? deliveryFeeFor(subtotal) : 0;
  deliveryLine.hidden = !delivery;
  document.getElementById("cart-delivery-amount").textContent = fee === 0 ? "Free" : formatRand(fee);
  document.getElementById("cart-grand-total").textContent = formatRand(subtotal + fee);
}

// Wires up the quantity buttons, remove buttons and clear button on the checkout page.
function setupCheckoutPage() {
  const list = document.getElementById("cart-items");
  if (!list) {
    return;
  }

  list.addEventListener("click", (event) => {
    const button = event.target.closest("button");
    if (!button) {
      return;
    }
    const index = Number(button.dataset.index);
    const cart = getCart();
    if (button.classList.contains("cart-remove")) {
      setCartQuantity(index, 0);
    } else if (button.dataset.action === "increase") {
      setCartQuantity(index, cart[index].quantity + 1);
    } else if (button.dataset.action === "decrease") {
      setCartQuantity(index, cart[index].quantity - 1);
    }
  });

  list.addEventListener("change", (event) => {
    if (event.target.classList.contains("cart-qty-input")) {
      setCartQuantity(Number(event.target.dataset.index), event.target.value);
    }
  });

  document.getElementById("clear-cart").addEventListener("click", () => {
    saveCart([]);
    renderCart();
    updateCartTray();
  });

  renderCart();
}

// ---------- Dynamic menu with search, filter and sort (menu.html) ----------

let menuQuery = "";
let menuCategory = "all";
let menuSort = "default";

// Checks whether every word the visitor typed appears in the item's text.
function itemMatchesSearch(item) {
  const text = (item.name + " " + item.description + " " + item.tags + " " + categoryLabel(item.category)).toLowerCase();
  const words = menuQuery.toLowerCase().split(" ").filter((word) => word !== "");
  return words.every((word) => text.includes(word));
}

// Returns a sorted copy of the items based on the chosen sort option.
function sortItems(items) {
  const sorted = items.slice();
  if (menuSort === "price-asc") {
    sorted.sort((a, b) => a.price - b.price);
  } else if (menuSort === "price-desc") {
    sorted.sort((a, b) => b.price - a.price);
  } else if (menuSort === "name-asc") {
    sorted.sort((a, b) => a.name.localeCompare(b.name));
  }
  return sorted;
}

// Builds the HTML for one product card.
function menuCardHtml(item) {
  const name = escapeHtml(item.name);
  const price = formatRand(item.price);
  return `
    <article class="product-card reveal" data-id="${item.id}">
      <button type="button" class="product-zoom" data-lightbox-group="menu" data-lightbox-src="./images/${item.id}.jpg" data-lightbox-caption="${name} – ${price}" aria-label="View a larger photo of ${name}">
        <img src="./images/${item.id}.jpg"
             srcset="./images/responsive/${item.id}-480w.jpg 480w, ./images/responsive/${item.id}-800w.jpg 800w, ./images/${item.id}.jpg 1024w"
             sizes="(max-width: 48rem) 100vw, (max-width: 64rem) 50vw, 33vw"
             alt="${escapeHtml(item.alt)}" loading="lazy">
        <span class="product-zoom-hint" aria-hidden="true">View photo</span>
      </button>
      <div class="product-body">
        <h3>${name}</h3>
        <p>${escapeHtml(item.description)}</p>
        <p class="price">${price}</p>
        <form class="add-to-cart-form" action="order.html" method="get">
          <input type="hidden" name="item" value="${name}">
          <input type="hidden" name="price" value="${price}">
          <p>
            <label for="qty-${item.id}">Quantity</label>
            <input type="number" id="qty-${item.id}" name="quantity" min="1" max="${SHOP.maxCartQuantity}" value="1" inputmode="numeric">
          </p>
          <p><button type="submit">Add to cart</button></p>
        </form>
        <p class="product-enquire"><a class="text-link" href="enquiry.html?item=${item.id}">Enquire about a bulk order</a></p>
      </div>
    </article>`;
}

// Draws the menu sections that match the current search, category and sort.
function renderMenu() {
  const root = document.getElementById("menu-root");
  const results = document.getElementById("menu-results");
  const emptyNote = document.getElementById("menu-empty");
  const clearButton = document.getElementById("menu-clear");
  let html = "";
  let total = 0;

  CATEGORIES.forEach((category) => {
    if (menuCategory !== "all" && menuCategory !== category.key) {
      return;
    }
    const items = sortItems(MENU.filter((item) => item.category === category.key && itemMatchesSearch(item)));
    if (items.length === 0) {
      return;
    }
    total += items.length;
    html += `
      <section class="menu-section" id="${category.sectionId}" aria-labelledby="heading-${category.key}">
        <h2 id="heading-${category.key}">${category.label} <span class="menu-count">${items.length}</span></h2>
        <div class="menu-grid">${items.map(menuCardHtml).join("")}</div>
      </section>`;
  });

  root.innerHTML = html;
  emptyNote.hidden = total > 0;
  clearButton.hidden = menuQuery === "" && menuCategory === "all" && menuSort === "default";

  const scope = menuCategory === "all" ? "the full menu" : categoryLabel(menuCategory);
  const itemWord = total === 1 ? "item" : "items";
  if (menuQuery) {
    results.textContent = `${total} ${itemWord} ${total === 1 ? "matches" : "match"} "${menuQuery}" in ${scope}.`;
  } else {
    results.textContent = `Showing ${total} ${itemWord} from ${scope}.`;
  }

  revealOnScroll();
}

// Highlights the selected category tab and re-draws the menu.
function selectMenuTab(tab) {
  document.querySelectorAll("#menu-tabs [role='tab']").forEach((other) => {
    other.setAttribute("aria-selected", other === tab ? "true" : "false");
  });
  menuCategory = tab.dataset.category;
  renderMenu();
}

// Wires up the search box, category tabs, sort dropdown and clear button.
function setupMenuPage() {
  const root = document.getElementById("menu-root");
  if (!root) {
    return;
  }
  const searchInput = document.getElementById("menu-search");
  const sortSelect = document.getElementById("menu-sort");
  const tabList = document.getElementById("menu-tabs");

  // Build one tab for "All" plus one for each category.
  const tabs = [{ key: "all", label: "All" }].concat(CATEGORIES);
  tabList.innerHTML = tabs.map((tab, index) => `
    <button type="button" role="tab" data-category="${tab.key}" aria-selected="${index === 0}">${tab.label}</button>`).join("");

  tabList.addEventListener("click", (event) => {
    const tab = event.target.closest("[role='tab']");
    if (tab) {
      selectMenuTab(tab);
    }
  });

  searchInput.addEventListener("input", () => {
    menuQuery = searchInput.value.trim();
    renderMenu();
  });

  // Pressing Enter in the search box should filter the menu, not reload the page.
  searchInput.closest("form").addEventListener("submit", (event) => {
    event.preventDefault();
    menuQuery = searchInput.value.trim();
    renderMenu();
  });

  sortSelect.addEventListener("change", () => {
    menuSort = sortSelect.value;
    renderMenu();
  });

  // Both "clear" buttons reset the search, the category and the sort order.
  document.querySelectorAll("#menu-clear, [data-menu-reset]").forEach((button) => {
    button.addEventListener("click", () => {
      searchInput.value = "";
      sortSelect.value = "default";
      menuQuery = "";
      menuSort = "default";
      selectMenuTab(tabList.querySelector("[data-category='all']"));
      searchInput.focus();
    });
  });

  renderMenu();

  // Links like menu.html#sides can only scroll once the sections exist.
  if (window.location.hash) {
    const target = document.getElementById(window.location.hash.slice(1));
    if (target) {
      target.scrollIntoView();
    }
  }
}

// ---------- Scroll animations ----------

// Fades cards in when they scroll into view using the IntersectionObserver API.
function revealOnScroll() {
  const cards = document.querySelectorAll(".product-card, .promo-card, .about-card, .team-card, .gallery-item, .faq-item, .location-card, .category-list li");
  cards.forEach((card) => card.classList.add("reveal"));

  const hidden = document.querySelectorAll(".reveal:not(.is-visible)");
  if (!("IntersectionObserver" in window)) {
    hidden.forEach((element) => element.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  hidden.forEach((element) => observer.observe(element));
}

// ---------- Accordion (FAQ on contact.html) ----------

// Opens or closes one accordion item.
function setAccordionOpen(trigger, open) {
  const panel = document.getElementById(trigger.getAttribute("aria-controls"));
  trigger.setAttribute("aria-expanded", open);
  panel.classList.toggle("is-open", open);
  trigger.closest(".accordion-item").classList.toggle("is-open", open);
}

// Makes each accordion question open its answer and close the others.
function setupAccordions() {
  document.querySelectorAll("[data-accordion]").forEach((accordion) => {
    const triggers = accordion.querySelectorAll(".accordion-trigger");
    triggers.forEach((trigger, index) => {
      setAccordionOpen(trigger, index === 0 && accordion.hasAttribute("data-open-first"));
      trigger.addEventListener("click", () => {
        const isOpen = trigger.getAttribute("aria-expanded") === "true";
        triggers.forEach((other) => setAccordionOpen(other, false));
        setAccordionOpen(trigger, !isOpen);
      });
    });
  });
}

// ---------- Gallery lightbox ----------

let lightboxItems = [];
let lightboxIndex = 0;

// Creates the lightbox dialog once and adds it to the page.
function getLightbox() {
  let lightbox = document.getElementById("lightbox");
  if (lightbox) {
    return lightbox;
  }
  lightbox = document.createElement("dialog");
  lightbox.id = "lightbox";
  lightbox.className = "modal lightbox";
  lightbox.setAttribute("aria-label", "Image viewer");
  lightbox.innerHTML = `
    <div class="lightbox-inner">
      <button type="button" class="lightbox-close" data-modal-close aria-label="Close image viewer">×</button>
      <button type="button" class="lightbox-nav lightbox-prev" data-step="-1" aria-label="Previous image">‹</button>
      <figure class="lightbox-figure">
        <img class="lightbox-image" src="" alt="">
        <figcaption class="lightbox-caption"></figcaption>
      </figure>
      <button type="button" class="lightbox-nav lightbox-next" data-step="1" aria-label="Next image">›</button>
      <p class="lightbox-counter" aria-live="polite"></p>
    </div>`;
  document.body.appendChild(lightbox);

  // Clicking the close button or the dark backdrop closes the lightbox.
  lightbox.addEventListener("click", (event) => {
    if (event.target === lightbox || event.target.closest("[data-modal-close]")) {
      lightbox.close();
    }
    const nav = event.target.closest(".lightbox-nav");
    if (nav) {
      showLightboxImage(lightboxIndex + Number(nav.dataset.step));
    }
  });

  // The left and right arrow keys move between images.
  document.addEventListener("keydown", (event) => {
    if (!lightbox.open) {
      return;
    }
    if (event.key === "ArrowRight") {
      showLightboxImage(lightboxIndex + 1);
    } else if (event.key === "ArrowLeft") {
      showLightboxImage(lightboxIndex - 1);
    }
  });

  return lightbox;
}

// Shows the image at the given position, wrapping around at both ends.
function showLightboxImage(index) {
  const lightbox = getLightbox();
  const image = lightbox.querySelector(".lightbox-image");
  const total = lightboxItems.length;
  lightboxIndex = (index + total) % total;
  const item = lightboxItems[lightboxIndex];

  image.classList.remove("is-loaded");
  image.src = item.src;
  image.alt = item.alt;
  image.onload = () => image.classList.add("is-loaded");
  lightbox.querySelector(".lightbox-caption").textContent = item.caption;
  lightbox.querySelector(".lightbox-counter").textContent = total > 1 ? `${lightboxIndex + 1} of ${total}` : "";
  lightbox.querySelectorAll(".lightbox-nav").forEach((button) => { button.hidden = total < 2; });
}

// Opens the lightbox when any element with data-lightbox-src is clicked.
function setupLightbox() {
  document.addEventListener("click", (event) => {
    const trigger = event.target.closest("[data-lightbox-src]");
    if (!trigger) {
      return;
    }
    event.preventDefault();

    // Images that share a group become one slideshow with previous and next buttons.
    const group = trigger.dataset.lightboxGroup;
    const triggers = group ? document.querySelectorAll(`[data-lightbox-group="${group}"]`) : [trigger];

    lightboxItems = Array.from(triggers).map((element) => {
      const img = element.querySelector("img");
      return {
        src: element.dataset.lightboxSrc,
        alt: img ? img.alt : "",
        caption: element.dataset.lightboxCaption || (img ? img.alt : "")
      };
    });

    showLightboxImage(Array.from(triggers).indexOf(trigger));
    getLightbox().showModal();
  });
}

// ---------- Form validation ----------

// Shows an error message under a field, or clears it when the message is empty.
function showFieldError(field, message) {
  const wrapper = field.closest("[data-field]") || field.parentElement;
  let error = wrapper.querySelector(".field-error");
  if (!error) {
    error = document.createElement("span");
    error.className = "field-error";
    error.id = field.id + "-error";
    error.setAttribute("role", "alert");
    wrapper.appendChild(error);
  }
  error.textContent = message;
  error.hidden = message === "";
  wrapper.classList.toggle("has-error", message !== "");
  if (message) {
    field.setAttribute("aria-invalid", "true");
    field.setAttribute("aria-describedby", error.id);
  } else {
    field.removeAttribute("aria-invalid");
    field.removeAttribute("aria-describedby");
  }
}

// Works out the error message for one field, returning "" when the field is valid.
function errorMessageFor(field) {
  const value = field.value.trim();
  const label = field.labels && field.labels[0] ? field.labels[0].textContent.replace("*", "").trim() : "This field";

  if (field.type === "checkbox") {
    return field.required && !field.checked ? "Please tick this box to continue." : "";
  }
  if (field.required && value === "") {
    return label + " is required.";
  }
  if (value === "") {
    return "";
  }
  if (field.type === "email" && !isValidEmail(value)) {
    return "Enter a valid email address, for example name@example.com.";
  }
  if (field.type === "tel" && !isValidPhone(value)) {
    return "Enter a valid South African phone number, for example 082 123 4567.";
  }
  if (field.type === "number" && (field.validity.badInput || field.validity.rangeUnderflow || field.validity.rangeOverflow || field.validity.stepMismatch)) {
    return `Enter a whole number between ${field.min} and ${field.max}.`;
  }
  if (field.minLength > 0 && value.length < field.minLength) {
    return `${label} must be at least ${field.minLength} characters (currently ${value.length}).`;
  }
  if (field.maxLength > 0 && value.length > field.maxLength) {
    return `${label} must be ${field.maxLength} characters or fewer.`;
  }
  return "";
}

// Checks one field and shows or clears its error message.
function validateField(field) {
  const skip = field.type === "hidden" || field.type === "radio" || field.name === "website";
  const wrapper = field.closest("[data-field]");
  if (skip || (wrapper && wrapper.hidden)) {
    return true;
  }
  const message = errorMessageFor(field);
  showFieldError(field, message);
  return message === "";
}

// Checks every field in a form, shows a summary and focuses the first problem.
function validateForm(form) {
  const fields = form.querySelectorAll("input, select, textarea");
  const summary = form.querySelector(".form-summary");
  let firstInvalid = null;
  let errorCount = 0;

  fields.forEach((field) => {
    if (!validateField(field)) {
      errorCount += 1;
      if (!firstInvalid) {
        firstInvalid = field;
      }
    }
  });

  if (summary) {
    summary.hidden = errorCount === 0;
    summary.textContent = errorCount === 0 ? "" : `Please fix the ${errorCount} highlighted field${errorCount === 1 ? "" : "s"} below.`;
  }
  if (firstInvalid) {
    firstInvalid.focus();
  }
  return errorCount === 0;
}

// After the first submit attempt, re-checks a field every time the visitor changes it.
function validateWhileTyping(form) {
  form.addEventListener("input", (event) => {
    if (form.dataset.attempted === "true") {
      validateField(event.target);
    }
  });
}

// Spam bots fill in every field, including the hidden "website" field that humans never see.
function isSpamBot(form) {
  return form.elements.website && form.elements.website.value !== "";
}

// Sends the form data with AJAX (fetch) when the form has a data-endpoint, otherwise returns false.
async function sendWithAjax(form, data) {
  const endpoint = form.dataset.endpoint;
  if (!endpoint) {
    return false;
  }
  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });
    return response.ok;
  } catch (error) {
    return false;
  }
}

// Builds a mailto link that opens the visitor's email app with the message filled in.
function buildMailto(to, subject, body) {
  return `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

// Shows a response panel with the given HTML and scrolls to it.
function showResult(panelId, html) {
  const panel = document.getElementById(panelId);
  panel.innerHTML = html;
  panel.hidden = false;
  panel.focus();
  panel.scrollIntoView({ behavior: "smooth", block: "start" });
}

// ---------- Contact form (contact.html) ----------

// Validates the contact form, then compiles the message into an email to the shop.
function setupContactForm() {
  const form = document.getElementById("contact-form");
  if (!form) {
    return;
  }
  validateWhileTyping(form);

  // Live character counter under the message box.
  const message = document.getElementById("contact-message");
  const counter = document.getElementById("contact-message-count");
  message.addEventListener("input", () => {
    counter.textContent = `${message.value.length} / 1000 characters`;
  });

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    form.dataset.attempted = "true";
    if (isSpamBot(form) || !validateForm(form)) {
      return;
    }

    const data = {
      reference: makeReference("MSG"),
      name: form.elements["contact-name"].value.trim(),
      email: form.elements["contact-email"].value.trim(),
      phone: cleanPhone(form.elements["contact-phone"].value),
      type: form.elements["contact-type"].value,
      subject: form.elements["contact-subject"].value.trim(),
      message: form.elements["contact-message"].value.trim()
    };

    const subject = `[${data.type}] ${data.subject} (${data.reference})`;
    const body =
      `Hello The Burger Bar team,\n\n${data.message}\n\n` +
      `----------------------------------------\n` +
      `Message type: ${data.type}\nFrom: ${data.name}\nEmail: ${data.email}\nPhone: ${data.phone}\n` +
      `Reference: ${data.reference}\nSent from theburgerbardbn.co.za contact form`;
    const mailto = buildMailto(SHOP.contactEmail, subject, body);

    // Try AJAX first; if there is no endpoint, open the visitor's email app instead.
    const sentWithAjax = await sendWithAjax(form, data);
    if (!sentWithAjax) {
      window.location.href = mailto;
    }

    showResult("contact-result", `
      <h2>${sentWithAjax ? "Message sent" : "Your email is ready to send"}</h2>
      <p>Thanks, ${escapeHtml(data.name.split(" ")[0])}. ${sentWithAjax
        ? `We have received your message and will reply to <strong>${escapeHtml(data.email)}</strong> within one working day.`
        : `Your email app should now be open with your message addressed to <strong>${SHOP.contactEmail}</strong>. Press send to deliver it.`}</p>
      <dl class="response-list">
        <div><dt>Reference</dt><dd>${data.reference}</dd></div>
        <div><dt>Message type</dt><dd>${escapeHtml(data.type)}</dd></div>
        <div><dt>Subject</dt><dd>${escapeHtml(data.subject)}</dd></div>
        <div><dt>Reply to</dt><dd>${escapeHtml(data.email)} · ${escapeHtml(data.phone)}</dd></div>
      </dl>
      ${sentWithAjax ? "" : `<p><a class="btn" href="${mailto}">Open email again</a></p>`}`);

    form.reset();
    form.dataset.attempted = "false";
    counter.textContent = "0 / 1000 characters";
  });
}

// ---------- Enquiry form (enquiry.html) ----------

// Works out the cost of a bulk or catering enquiry.
function estimateEnquiry(item, quantity, delivery, type) {
  const subtotal = item.price * quantity;
  let discountRate = 0;
  if (quantity >= 25) {
    discountRate = 0.15;
  } else if (quantity >= 10) {
    discountRate = 0.1;
  }
  const discount = Math.round(subtotal * discountRate);
  const setupFee = type === "catering" ? SHOP.cateringFee : 0;
  const deliveryFee = delivery ? deliveryFeeFor(subtotal - discount) : 0;
  return {
    subtotal: subtotal,
    discountRate: discountRate,
    discount: discount,
    setupFee: setupFee,
    deliveryFee: deliveryFee,
    total: subtotal - discount + setupFee + deliveryFee
  };
}

// Checks whether the requested date and time slot can be served.
function checkAvailability(date, slot, quantity, type) {
  const isWeekendEvening = date.getDay() === 5 || date.getDay() === 6;
  if (date.getDay() === SHOP.closedDay) {
    return {
      available: false,
      message: `We are closed on Mondays, so ${formatDate(date)} is not available.`,
      nextStep: "Please choose a date from Tuesday to Sunday and send the enquiry again."
    };
  }
  if (slot === "evening" && quantity >= 10 && !isWeekendEvening) {
    return {
      available: false,
      message: "Large evening orders are only available on Fridays and Saturdays.",
      nextStep: "Choose the lunch or afternoon slot, or move the date to a Friday or Saturday."
    };
  }
  if (type === "catering") {
    return {
      available: true,
      message: `The grill is available for your event on ${formatDate(date)}.`,
      nextStep: "We will email a full catering quote within two working days."
    };
  }
  return {
    available: true,
    message: `${formatDate(date)} is available for your order.`,
    nextStep: "We will confirm the final quote by email within one working day."
  };
}

// Returns an error message for the enquiry date, or "" when the date is fine.
function enquiryDateError(form) {
  const value = form.elements["enquiry-date"].value;
  if (value === "") {
    return "";
  }
  const date = new Date(value + "T00:00:00");
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const quantity = Number(form.elements["enquiry-quantity"].value);
  const type = form.elements["enquiry-type"].value;
  let leadDays = quantity >= 10 ? 2 : 1;
  if (type === "catering") {
    leadDays = 5;
  }
  if (date.getDay() === SHOP.closedDay) {
    return "We do not trade on Mondays. Please choose Tuesday to Sunday.";
  }
  if (date < addDays(today, leadDays)) {
    return `We need ${leadDays} day${leadDays === 1 ? "" : "s"}' notice for this order. Please choose ${formatDate(addDays(today, leadDays))} or later.`;
  }
  return "";
}

// Validates the enquiry form, then shows a cost estimate and availability answer.
function setupEnquiryForm() {
  const form = document.getElementById("enquiry-form");
  if (!form) {
    return;
  }
  const itemSelect = document.getElementById("enquiry-item");
  const quantityInput = document.getElementById("enquiry-quantity");
  const dateInput = document.getElementById("enquiry-date");
  const suburbWrapper = form.querySelector("[data-field='enquiry-suburb']");
  const suburbInput = document.getElementById("enquiry-suburb");
  const livePrice = document.getElementById("enquiry-live-price");
  validateWhileTyping(form);

  // Fill the item dropdown from the menu data, grouped by category.
  CATEGORIES.forEach((category) => {
    const group = document.createElement("optgroup");
    group.label = category.label;
    MENU.filter((item) => item.category === category.key).forEach((item) => {
      group.innerHTML += `<option value="${item.id}">${escapeHtml(item.name)} — ${formatRand(item.price)}</option>`;
    });
    itemSelect.appendChild(group);
  });

  // A link like enquiry.html?item=classic-beef-burger pre-selects that item.
  const preselected = new URLSearchParams(window.location.search).get("item");
  if (preselected && findMenuItem(preselected)) {
    itemSelect.value = preselected;
  }

  // The date picker only allows dates from tomorrow up to 90 days ahead.
  const today = new Date();
  dateInput.min = toInputDate(addDays(today, 1));
  dateInput.max = toInputDate(addDays(today, 90));

  // The suburb field is only shown and required when delivery is chosen.
  function updateSuburbField() {
    const delivery = isDeliveryChosen(form);
    suburbWrapper.hidden = !delivery;
    suburbInput.required = delivery;
  }

  // Shows a running estimate next to the quantity as the visitor changes the form.
  function updateLivePrice() {
    const item = findMenuItem(itemSelect.value);
    const quantity = Number(quantityInput.value);
    if (!item || quantity < 1) {
      livePrice.textContent = "";
      return;
    }
    const estimate = estimateEnquiry(item, quantity, isDeliveryChosen(form), form.elements["enquiry-type"].value);
    const discountNote = estimate.discountRate ? ` (includes ${estimate.discountRate * 100}% bulk discount)` : "";
    livePrice.textContent = `Estimated total: ${formatRand(estimate.total)}${discountNote}`;
  }

  form.addEventListener("change", () => {
    updateSuburbField();
    updateLivePrice();
  });
  form.addEventListener("input", updateLivePrice);
  updateSuburbField();
  updateLivePrice();

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    form.dataset.attempted = "true";
    if (isSpamBot(form) || !validateForm(form)) {
      return;
    }
    const dateError = enquiryDateError(form);
    if (dateError) {
      showFieldError(dateInput, dateError);
      dateInput.focus();
      return;
    }

    const item = findMenuItem(itemSelect.value);
    const quantity = Number(quantityInput.value);
    const type = form.elements["enquiry-type"].value;
    const typeLabel = form.elements["enquiry-type"].selectedOptions[0].text;
    const delivery = isDeliveryChosen(form);
    const suburb = delivery ? suburbInput.value.trim() : "";
    const date = new Date(dateInput.value + "T00:00:00");
    const slot = form.elements["enquiry-slot"].value;
    const slotLabel = form.elements["enquiry-slot"].selectedOptions[0].text;
    const name = form.elements["enquiry-name"].value.trim();
    const email = form.elements["enquiry-email"].value.trim();
    const phone = cleanPhone(form.elements["enquiry-phone"].value);
    const notes = form.elements["enquiry-notes"].value.trim();

    const estimate = estimateEnquiry(item, quantity, delivery, type);
    const availability = checkAvailability(date, slot, quantity, type);
    const reference = makeReference("ENQ");
    const fulfilmentText = delivery ? `Delivery to ${suburb}` : "Collection at 246 Currie Road, Morningside";

    const emailBody =
      `Enquiry ${reference}\nType: ${typeLabel}\nItem: ${item.name} × ${quantity}\n` +
      `Fulfilment: ${fulfilmentText}\nPreferred: ${formatDate(date)}, ${slotLabel}\n` +
      `Estimated total: ${formatRand(estimate.total)}\nName: ${name}\nEmail: ${email}\nPhone: ${phone}\n` +
      (notes ? `Notes: ${notes}\n` : "");
    const mailto = buildMailto(SHOP.ordersEmail, `Enquiry ${reference} – ${item.name} × ${quantity}`, emailBody);

    await sendWithAjax(form, { reference, type, item: item.name, quantity, delivery, suburb, date: dateInput.value, slot, name, email, phone, notes, estimate });

    // Build the cost table one row at a time.
    let rows = `<tr><th scope="row">${escapeHtml(item.name)} × ${quantity}</th><td>${formatRand(estimate.subtotal)}</td></tr>`;
    if (estimate.discount) {
      rows += `<tr><th scope="row">Bulk discount (${estimate.discountRate * 100}% for ${quantity} items)</th><td>− ${formatRand(estimate.discount)}</td></tr>`;
    }
    if (estimate.setupFee) {
      rows += `<tr><th scope="row">On-site grill set-up (catering)</th><td>${formatRand(estimate.setupFee)}</td></tr>`;
    }
    if (delivery) {
      rows += `<tr><th scope="row">Delivery to ${escapeHtml(suburb)}</th><td>${estimate.deliveryFee ? formatRand(estimate.deliveryFee) : "Free (orders over R500)"}</td></tr>`;
    }
    rows += `<tr class="response-total"><th scope="row">Estimated total</th><td>${formatRand(estimate.total)}</td></tr>`;

    const canAddToCart = availability.available && quantity <= SHOP.maxCartQuantity;
    showResult("enquiry-result", `
      <p class="response-eyebrow">Enquiry ${reference}</p>
      <h2>${availability.available ? "Good news" : "Thanks"}, ${escapeHtml(name.split(" ")[0])}!</h2>
      <p class="response-status ${availability.available ? "is-available" : "is-unavailable"}">${availability.message}</p>
      <table class="response-table">
        <caption>Cost estimate for your ${typeLabel.toLowerCase()}</caption>
        <tbody>${rows}</tbody>
      </table>
      <dl class="response-list">
        <div><dt>Preferred</dt><dd>${formatDate(date)}, ${slotLabel}</dd></div>
        <div><dt>Fulfilment</dt><dd>${escapeHtml(fulfilmentText)}</dd></div>
        <div><dt>We will reply to</dt><dd>${escapeHtml(email)} · ${escapeHtml(phone)}</dd></div>
      </dl>
      <p>${availability.nextStep} Prices are estimates in South African Rand and will be confirmed with your quote.</p>
      <div class="response-actions">
        ${canAddToCart ? `<button type="button" class="btn" data-add-to-cart="${item.id}" data-quantity="${quantity}">Add to cart &amp; checkout</button>` : ""}
        <a class="btn btn-secondary" href="${mailto}">Email this enquiry</a>
      </div>`);

    form.reset();
    form.dataset.attempted = "false";
    updateSuburbField();
    updateLivePrice();
  });

  // The "Add to cart & checkout" button in the result panel adds the item and goes to the checkout.
  document.getElementById("enquiry-result").addEventListener("click", (event) => {
    const button = event.target.closest("[data-add-to-cart]");
    if (button) {
      const item = findMenuItem(button.dataset.addToCart);
      addToCart(item.name, formatRand(item.price), Number(button.dataset.quantity));
      window.location.href = "order.html";
    }
  });
}

// ---------- Checkout form (order.html) ----------

// Estimates when the order will be ready based on its size and the trading hours.
function estimateReadyTime(itemTotal, delivery) {
  const now = new Date();
  const minutes = 20 + Math.max(0, itemTotal - 2) * 4 + (delivery ? 25 : 0);
  const isOpen = now.getDay() !== SHOP.closedDay && now.getHours() >= SHOP.openHour && now.getHours() < SHOP.closeHour;

  if (isOpen) {
    const ready = new Date(now.getTime() + minutes * 60000);
    return {
      open: true,
      message: `Estimated ${delivery ? "delivery" : "collection"} time: about ${formatTime(ready)} today (roughly ${minutes} minutes).`
    };
  }

  // Closed right now, so find the next day and time the grill opens.
  let next = new Date(now);
  if (now.getHours() >= SHOP.openHour || now.getDay() === SHOP.closedDay) {
    next = addDays(next, 1);
  }
  while (next.getDay() === SHOP.closedDay) {
    next = addDays(next, 1);
  }
  next.setHours(SHOP.openHour, 0, 0, 0);
  const ready = new Date(next.getTime() + minutes * 60000);
  return {
    open: false,
    message: `The grill is closed right now. Your order is queued for ${formatDate(next)} and will be ready about ${formatTime(ready)}.`
  };
}

// Validates the checkout form, then shows an order confirmation and empties the cart.
function setupCheckoutForm() {
  const form = document.getElementById("order-form");
  if (!form) {
    return;
  }
  const addressWrapper = form.querySelector("[data-field='order-address']");
  const addressInput = document.getElementById("order-address");
  validateWhileTyping(form);

  // The address field is only shown and required when delivery is chosen.
  function updateAddressField() {
    const delivery = isDeliveryChosen(form);
    addressWrapper.hidden = !delivery;
    addressInput.required = delivery;
    updateCheckoutTotals();
  }
  form.addEventListener("change", updateAddressField);
  updateAddressField();

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    form.dataset.attempted = "true";
    const cart = getCart();
    if (cart.length === 0) {
      alert("Your cart is empty. Please add items from the menu first.");
      return;
    }
    if (isSpamBot(form) || !validateForm(form)) {
      return;
    }

    const name = form.elements["order-name"].value.trim();
    const phone = cleanPhone(form.elements["order-phone"].value);
    const email = form.elements["order-email"].value.trim();
    const delivery = isDeliveryChosen(form);
    const address = delivery ? addressInput.value.trim() : "";
    const notes = form.elements["order-notes"].value.trim();

    const subtotal = cartTotal(cart);
    const deliveryFee = delivery ? deliveryFeeFor(subtotal) : 0;
    const total = subtotal + deliveryFee;
    const reference = makeReference("TBB");
    const timing = estimateReadyTime(cartCount(cart), delivery);

    let rows = "";
    let emailLines = "";
    cart.forEach((item) => {
      const lineTotal = priceToNumber(item.price) * item.quantity;
      rows += `<tr><th scope="row">${escapeHtml(item.name)} × ${item.quantity}</th><td>${formatRand(lineTotal)}</td></tr>`;
      emailLines += `- ${item.name} × ${item.quantity} = ${formatRand(lineTotal)}\n`;
    });
    if (delivery) {
      rows += `<tr><th scope="row">Delivery</th><td>${deliveryFee ? formatRand(deliveryFee) : "Free"}</td></tr>`;
    }
    rows += `<tr class="response-total"><th scope="row">Total to pay on ${delivery ? "delivery" : "collection"}</th><td>${formatRand(total)}</td></tr>`;

    const emailBody =
      `Order ${reference}\n${emailLines}` +
      (delivery ? `Delivery: ${formatRand(deliveryFee)}\nAddress: ${address}\n` : "Collection at 246 Currie Road, Morningside\n") +
      `Total: ${formatRand(total)}\nName: ${name}\nPhone: ${phone}\nEmail: ${email}\n` +
      (notes ? `Notes: ${notes}\n` : "");
    const mailto = buildMailto(SHOP.ordersEmail, `Order ${reference}`, emailBody);

    await sendWithAjax(form, { reference, cart, total, delivery, address, name, phone, email, notes });

    showResult("order-result", `
      <p class="response-eyebrow">Order ${reference}</p>
      <h2>Thank you, ${escapeHtml(name.split(" ")[0])}! Your order is in.</h2>
      <p class="response-status ${timing.open ? "is-available" : "is-unavailable"}">${timing.message}</p>
      <table class="response-table">
        <caption>Order summary</caption>
        <tbody>${rows}</tbody>
      </table>
      <dl class="response-list">
        <div><dt>${delivery ? "Deliver to" : "Collect from"}</dt><dd>${delivery ? escapeHtml(address) : "246 Currie Road, Morningside, Durban"}</dd></div>
        <div><dt>We will confirm with</dt><dd>${escapeHtml(phone)} · ${escapeHtml(email)}</dd></div>
        ${notes ? `<div><dt>Notes</dt><dd>${escapeHtml(notes)}</dd></div>` : ""}
      </dl>
      <div class="response-actions">
        <a class="btn btn-secondary" href="${mailto}">Email a copy of this order</a>
        <a class="btn" href="menu.html">Back to the menu</a>
      </div>`);

    // The order is placed, so empty the cart and reset the form.
    saveCart([]);
    renderCart();
    updateCartTray();
    document.getElementById("cart-empty").hidden = true;
    form.reset();
    form.dataset.attempted = "false";
    updateAddressField();
  });
}

// ---------- Interactive map (contact.html) ----------

// The trading spots shown on the Leaflet map.
const LOCATIONS = [
  {
    id: "morningside",
    name: "Home base — 246 Currie Road",
    address: "246 Currie Road, Morningside, Durban, 4001",
    lat: -29.8376,
    lng: 31.0062,
    hours: "Tuesday to Sunday, 11:00–20:00",
    note: "Our main trading spot and collection point for online orders.",
    maps: "https://www.google.com/maps/search/?api=1&query=246+Currie+Road+Morningside+Durban"
  },
  {
    id: "essenwood",
    name: "Essenwood Market, Berea Park",
    address: "Essenwood Road, Berea, Durban, 4001",
    lat: -29.8432,
    lng: 30.9992,
    hours: "Saturdays, 09:00–14:00",
    note: "Find the grill at the Saturday market for breakfast smash burgers.",
    maps: "https://www.google.com/maps/search/?api=1&query=Essenwood+Market+Berea+Park+Durban"
  },
  {
    id: "umhlanga",
    name: "Umhlanga Rocks Promenade",
    address: "Lighthouse Road, Umhlanga Rocks, 4320",
    lat: -29.7268,
    lng: 31.087,
    hours: "Fridays and Saturdays, 16:00–21:00",
    note: "Sunset burgers by the sea. Follow Facebook for the exact pitch each week.",
    maps: "https://www.google.com/maps/search/?api=1&query=Umhlanga+Rocks+Promenade+Lighthouse+Road"
  },
  {
    id: "north-beach",
    name: "North Beach Promenade",
    address: "O.R. Tambo Parade, North Beach, Durban, 4001",
    lat: -29.847,
    lng: 31.035,
    hours: "Sundays, 11:00–17:00",
    note: "Sunday beach trading on the Golden Mile.",
    maps: "https://www.google.com/maps/search/?api=1&query=North+Beach+Durban+Promenade"
  }
];

// Draws the Leaflet map with a marker and card for every trading spot.
function setupMap() {
  const mapElement = document.getElementById("map");
  if (!mapElement) {
    return;
  }

  // Build the location cards under the map.
  const list = document.getElementById("location-list");
  list.innerHTML = LOCATIONS.map((location, index) => `
    <li class="location-card" data-location="${location.id}">
      <h3>${index + 1}. ${location.name}</h3>
      <address>${location.address}</address>
      <p class="location-hours">${location.hours}</p>
      <p>${location.note}</p>
      <p class="location-actions">
        <button type="button" class="btn btn-secondary" data-show-location="${location.id}">Show on map</button>
        <a class="text-link" href="${location.maps}" rel="noopener noreferrer" target="_blank">Directions</a>
      </p>
    </li>`).join("");

  // If the Leaflet library did not load, show a short message instead of a blank box.
  if (typeof L === "undefined") {
    mapElement.innerHTML = '<p class="map-fallback">The interactive map could not be loaded. Use the Directions links below to open each location in Google Maps.</p>';
    return;
  }

  const map = L.map(mapElement, { scrollWheelZoom: false });
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a> contributors'
  }).addTo(map);

  // Add one marker per location and remember them so buttons can open their popups.
  const markers = {};
  const points = [];
  LOCATIONS.forEach((location, index) => {
    const marker = L.marker([location.lat, location.lng], { title: location.name, alt: location.name }).addTo(map);
    marker.bindPopup(`
      <div class="map-popup">
        <strong>${index + 1}. ${location.name}</strong><br>
        ${location.address}<br>
        <em>${location.hours}</em><br>
        <a href="${location.maps}" target="_blank" rel="noopener noreferrer">Get directions</a>
      </div>`);
    marker.on("click", () => highlightLocationCard(location.id));
    markers[location.id] = marker;
    points.push([location.lat, location.lng]);
  });
  map.fitBounds(points, { padding: [30, 30] });

  // Highlights the card that matches the selected marker.
  function highlightLocationCard(id) {
    document.querySelectorAll(".location-card").forEach((card) => {
      card.classList.toggle("is-active", card.dataset.location === id);
    });
  }

  // Flies the map to one location and opens its popup.
  function showLocation(id) {
    const location = LOCATIONS.find((place) => place.id === id);
    map.flyTo([location.lat, location.lng], 15);
    markers[id].openPopup();
    highlightLocationCard(id);
    mapElement.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  list.addEventListener("click", (event) => {
    const button = event.target.closest("[data-show-location]");
    if (button) {
      showLocation(button.dataset.showLocation);
    }
  });

  document.getElementById("map-show-all").addEventListener("click", () => {
    map.flyToBounds(points, { padding: [30, 30] });
    highlightLocationCard("");
  });

  // "Find my nearest spot" uses the browser's Geolocation API with the visitor's permission.
  const nearestButton = document.getElementById("map-nearest");
  const nearestNote = document.getElementById("map-nearest-note");
  nearestButton.addEventListener("click", () => {
    nearestNote.textContent = "Finding your location…";
    navigator.geolocation.getCurrentPosition((position) => {
      const here = [position.coords.latitude, position.coords.longitude];
      let nearest = LOCATIONS[0];
      LOCATIONS.forEach((location) => {
        if (map.distance(here, [location.lat, location.lng]) < map.distance(here, [nearest.lat, nearest.lng])) {
          nearest = location;
        }
      });
      const distanceKm = (map.distance(here, [nearest.lat, nearest.lng]) / 1000).toFixed(1);
      L.circleMarker(here, { radius: 8, color: "#c62828", fillOpacity: 0.6 }).addTo(map).bindPopup("You are here");
      showLocation(nearest.id);
      nearestNote.textContent = `Nearest trading spot: ${nearest.name} (about ${distanceKm} km away).`;
    }, () => {
      nearestNote.textContent = "We could not access your location. You can still pick a spot from the list.";
    });
  });
}

// ---------- Start everything ----------

// Run the parts of the script that apply to the current page.
updateCartTray();
setupCheckoutPage();
setupMenuPage();
revealOnScroll();
setupAccordions();
setupLightbox();
setupContactForm();
setupEnquiryForm();
setupCheckoutForm();
setupMap();

// Keep the copyright year in the footer up to date.
document.querySelectorAll("[data-year]").forEach((element) => {
  element.textContent = new Date().getFullYear();
});
