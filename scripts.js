// ========== Scroll to Top ==========
const scrollToTopBtn = document.getElementById("scrollToTop");

window.onscroll = function () {
  scrollToTopBtn.style.display =
    document.body.scrollTop > 100 || document.documentElement.scrollTop > 100
      ? "block"
      : "none";
};

scrollToTopBtn.onclick = function () {
  window.scrollTo({ top: 0, behavior: "smooth" });
};

// ========== Cart Page Logic ==========
$(document).ready(function () {
  // Update total when quantity changes
  $(".qty-input").on("input", function () {
    const row = $(this).closest("tr");
    const price = parseFloat(row.find("td:nth-child(3)").text().replace("₹", ""));
    const qty = parseInt($(this).val());
    const total = price * qty;
    row.find("td:nth-child(5)").text("₹" + total.toLocaleString());
    updateCartTotal();
  });

  // Remove item
  $(".remove-btn").on("click", function () {
    $(this).closest("tr").remove();
    updateCartTotal();
  });

  // Recalculate grand total
  function updateCartTotal() {
    let total = 0;
    $(".cart-table tbody tr").each(function () {
      const rowTotal = parseFloat($(this).find("td:nth-child(5)").text().replace("₹", "").replace(",", ""));
      total += rowTotal;
    });
    $(".cart-summary h2").text("Total: ₹" + total.toLocaleString());
  }

  // Save cart data to localStorage for checkout
  window.saveCartToLocalStorage = function () {
    const items = [];
    $(".cart-table tbody tr").each(function () {
      const title = $(this).find("td:nth-child(2)").text();
      const price = parseFloat($(this).find("td:nth-child(3)").text().replace("₹", ""));
      const qty = parseInt($(this).find(".qty-input").val());
      const total = price * qty;
      items.push({ title, price, qty, total });
    });
    localStorage.setItem("checkoutItems", JSON.stringify(items));
  };
});

// ========== Checkout Page Logic ==========
if (window.location.pathname.includes("checkout.html")) {
  const checkoutItems = JSON.parse(localStorage.getItem("checkoutItems")) || [];
  let grandTotal = 0;
  const summaryList = document.getElementById("summaryList");

  if (checkoutItems.length && summaryList) {
    checkoutItems.forEach(item => {
      const li = document.createElement("li");
      li.textContent = `${item.title} (x${item.qty})`;
      const span = document.createElement("span");
      span.textContent = ` ₹${item.total.toLocaleString()}`;
      li.appendChild(span);
      summaryList.appendChild(li);
      grandTotal += item.total;
    });
    document.getElementById("totalAmount").textContent = `Total: ₹${grandTotal.toLocaleString()}`;
  }
}

// ========== Contact Form Validation ==========
$("#contactForm").submit(function (e) {
  e.preventDefault();
  const name = $("#name").val().trim();
  const email = $("#email").val().trim();
  const message = $("#message").val().trim();
  const emailPattern = /^[^ ]+@[^ ]+\.[a-z]{2,3}$/;

  if (!name || !email || !message) {
    $("#formMessage").text("Please fill out all fields.").css("color", "red");
  } else if (!email.match(emailPattern)) {
    $("#formMessage").text("Please enter a valid email address.").css("color", "red");
  } else {
    $("#formMessage").text("Thank you! We'll get back to you soon.").css("color", "green");
    $("#contactForm")[0].reset();
  }
});

// ========== Search Button Logic ==========
$("#searchBtn").on("click", function () {
  const query = $("#searchInput").val().trim().toLowerCase();
  if (query === "") {
    alert("Please enter a search term.");
    return;
  }
  alert("Showing results for: " + query);
});
