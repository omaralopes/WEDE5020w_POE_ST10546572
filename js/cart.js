(function () {
  var STORAGE_KEY = "burgerBarCart";

  function getCart() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      var cart = raw ? JSON.parse(raw) : [];
      return Array.isArray(cart) ? cart : [];
    } catch (error) {
      return [];
    }
  }

  function saveCart(cart) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
  }

  function itemCount(cart) {
    return cart.reduce(function (total, item) {
      return total + Number(item.quantity || 0);
    }, 0);
  }

  function addItem(name, price, quantity) {
    var cart = getCart();
    var qty = Math.max(1, Number(quantity) || 1);
    var existing = cart.find(function (item) {
      return item.name === name && item.price === price;
    });

    if (existing) {
      existing.quantity = Number(existing.quantity) + qty;
    } else {
      cart.push({ name: name, price: price, quantity: qty });
    }

    saveCart(cart);
    return cart;
  }

  function parsePrice(price) {
    var match = String(price || "").replace(",", "").match(/(\d+(\.\d+)?)/);
    return match ? Number(match[1]) : 0;
  }

  function formatRand(amount) {
    return "R" + amount.toFixed(amount % 1 === 0 ? 0 : 2);
  }

  function cartTotal(cart) {
    return cart.reduce(function (total, item) {
      return total + parsePrice(item.price) * Number(item.quantity || 0);
    }, 0);
  }

  function lineTotal(item) {
    return parsePrice(item.price) * Number(item.quantity || 0);
  }

  function ensureTray() {
    var tray = document.getElementById("cart-tray");
    if (tray) {
      return tray;
    }

    tray = document.createElement("aside");
    tray.id = "cart-tray";
    tray.className = "cart-tray";
    tray.setAttribute("aria-live", "polite");
    tray.innerHTML =
      '<div class="site-wrap cart-tray-inner">' +
      '<p class="cart-tray-summary"><strong id="cart-count">0</strong> item(s) · Total <strong id="cart-tray-total">R0</strong></p>' +
      '<div class="cart-tray-actions">' +
      '<a class="btn btn-secondary" href="menu.html">Keep browsing</a>' +
      '<a class="btn" href="order.html">Checkout</a>' +
      "</div>" +
      "</div>";
    document.body.appendChild(tray);
    return tray;
  }

  function updateTray() {
    var onCheckout = /order\.html$/i.test(window.location.pathname) || document.getElementById("cart-items");
    var cart = getCart();
    var count = itemCount(cart);
    var tray = ensureTray();
    var countEl = document.getElementById("cart-count");
    var trayTotal = document.getElementById("cart-tray-total");

    if (countEl) {
      countEl.textContent = String(count);
    }
    if (trayTotal) {
      trayTotal.textContent = formatRand(cartTotal(cart));
    }

    if (onCheckout || count === 0) {
      tray.hidden = true;
      document.body.classList.remove("has-cart-tray");
      return;
    }

    tray.hidden = false;
    document.body.classList.add("has-cart-tray");
  }

  function flashAdded(button) {
    if (!button) {
      return;
    }
    var original = button.textContent;
    button.textContent = "Added";
    button.disabled = true;
    window.setTimeout(function () {
      button.textContent = original;
      button.disabled = false;
    }, 900);
  }

  function bindAddToCartForms() {
    var forms = document.querySelectorAll('form[action="order.html"], form.add-to-cart-form');
    forms.forEach(function (form) {
      form.addEventListener("submit", function (event) {
        event.preventDefault();

        var itemInput = form.querySelector('input[name="item"]');
        var priceInput = form.querySelector('input[name="price"]');
        var qtyInput = form.querySelector('input[name="quantity"]');

        if (!itemInput || !priceInput) {
          return;
        }

        addItem(itemInput.value, priceInput.value, qtyInput ? qtyInput.value : 1);
        updateTray();
        flashAdded(form.querySelector('button[type="submit"]'));
      });
    });
  }

  function setQuantity(index, quantity) {
    var cart = getCart();
    if (!cart[index]) {
      return;
    }

    var next = Math.max(0, Math.min(20, Number(quantity) || 0));
    if (next < 1) {
      cart.splice(index, 1);
    } else {
      cart[index].quantity = next;
    }

    saveCart(cart);
    renderOrderPage();
    updateTray();
  }

  function renderOrderPage() {
    var list = document.getElementById("cart-items");
    var emptyNote = document.getElementById("cart-empty");
    var checkoutBlock = document.getElementById("checkout-block");
    if (!list) {
      return;
    }

    var cart = getCart();
    list.innerHTML = "";

    if (!cart.length) {
      if (emptyNote) {
        emptyNote.hidden = false;
      }
      if (checkoutBlock) {
        checkoutBlock.hidden = true;
      }
      var emptyTotal = document.getElementById("cart-total");
      if (emptyTotal) {
        emptyTotal.hidden = true;
      }
      return;
    }

    if (emptyNote) {
      emptyNote.hidden = true;
    }
    if (checkoutBlock) {
      checkoutBlock.hidden = false;
    }

    cart.forEach(function (item, index) {
      var li = document.createElement("li");
      li.className = "cart-line";
      li.innerHTML =
        '<div class="cart-line-info">' +
        "<strong>" +
        item.name +
        "</strong>" +
        '<span class="cart-line-price">' +
        item.price +
        " each</span>" +
        "</div>" +
        '<div class="cart-qty" role="group" aria-label="Quantity for ' +
        item.name.replace(/"/g, "&quot;") +
        '">' +
        '<button type="button" class="cart-qty-btn" data-action="decrease" data-index="' +
        index +
        '" aria-label="Decrease quantity">−</button>' +
        '<input class="cart-qty-input" type="number" min="1" max="20" value="' +
        item.quantity +
        '" data-index="' +
        index +
        '" aria-label="Quantity">' +
        '<button type="button" class="cart-qty-btn" data-action="increase" data-index="' +
        index +
        '" aria-label="Increase quantity">+</button>' +
        "</div>" +
        '<span class="cart-line-subtotal">' +
        formatRand(lineTotal(item)) +
        "</span>" +
        '<button type="button" class="cart-remove" data-index="' +
        index +
        '">Remove</button>';
      list.appendChild(li);
    });

    var totalBox = document.getElementById("cart-total");
    if (totalBox) {
      totalBox.hidden = false;
      var amount = document.getElementById("cart-total-amount");
      if (amount) {
        amount.textContent = formatRand(cartTotal(cart));
      }
    }

    list.querySelectorAll(".cart-qty-btn").forEach(function (button) {
      button.addEventListener("click", function () {
        var index = Number(button.getAttribute("data-index"));
        var cartNow = getCart();
        if (!cartNow[index]) {
          return;
        }
        var current = Number(cartNow[index].quantity) || 1;
        var action = button.getAttribute("data-action");
        setQuantity(index, action === "increase" ? current + 1 : current - 1);
      });
    });

    list.querySelectorAll(".cart-qty-input").forEach(function (input) {
      input.addEventListener("change", function () {
        setQuantity(Number(input.getAttribute("data-index")), input.value);
      });
    });

    list.querySelectorAll(".cart-remove").forEach(function (button) {
      button.addEventListener("click", function () {
        var cartNow = getCart();
        var index = Number(button.getAttribute("data-index"));
        cartNow.splice(index, 1);
        saveCart(cartNow);
        renderOrderPage();
        updateTray();
      });
    });

    var hidden = document.getElementById("order-cart-json");
    if (hidden) {
      hidden.value = JSON.stringify(cart);
    }
  }

  document.addEventListener("DOMContentLoaded", function () {
    bindAddToCartForms();
    updateTray();
    renderOrderPage();

    var clearBtn = document.getElementById("clear-cart");
    if (clearBtn) {
      clearBtn.addEventListener("click", function () {
        saveCart([]);
        renderOrderPage();
        updateTray();
      });
    }
  });
})();
