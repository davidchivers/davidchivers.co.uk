const currency = new Intl.NumberFormat("en-GB", {
  style: "currency",
  currency: "GBP",
  maximumFractionDigits: 2,
});

let cachedProducts;
let cachedAdminData;

async function loadProducts() {
  if (!cachedProducts) {
    const response = await fetch("data/public-products.json");
    cachedProducts = await response.json();
  }
  return cachedProducts;
}

async function loadAdminData() {
  if (!cachedAdminData) {
    const response = await fetch("data/admin-data.json");
    cachedAdminData = await response.json();
  }
  return cachedAdminData;
}

function getPrice(product) {
  return product.promotionalPrice ?? product.takeoutPrice ?? product.bottleRetailPrice;
}

function formatPrice(product) {
  const primary = currency.format(getPrice(product));
  const compare = product.promotionalPrice ? `<s>${currency.format(product.takeoutPrice)}</s>` : "";
  return `${compare}<span>${primary}</span>`;
}

function fulfilmentText(product) {
  switch (product.publishingState) {
    case "collection_and_delivery":
      return "Collection or local delivery";
    case "collection_only":
      return "Collection only";
    case "delivery_only":
      return "Local delivery only";
    case "info_only":
      return "Visible online, not purchasable";
    default:
      return "In bar only";
  }
}

function productTags(product) {
  const tags = [
    `<span class="tag tag--accent">${product.category}</span>`,
    `<span class="tag">${product.country}</span>`,
    `<span class="tag tag--muted">${fulfilmentText(product)}</span>`,
  ];
  if (product.availableByGlass) {
    tags.push(`<span class="tag">By the glass</span>`);
  }
  return tags.join("");
}

function productCard(product) {
  const priceBlock = product.purchasableOnline
    ? `<div class="product-card__price">${formatPrice(product)}<small>take-home</small></div>`
    : `<p class="product-card__status">Informational listing</p>`;

  return `
    <article class="product-card">
      <a class="product-card__media" href="product.html?handle=${product.handle}">
        <img src="${product.mainImageUrl}" alt="${product.altText}">
      </a>
      <div class="product-card__body">
        <div class="tag-row">${productTags(product)}</div>
        <div class="product-card__meta">
          <h3 class="product-card__title"><a href="product.html?handle=${product.handle}">${product.title}</a></h3>
          <p>${product.regionLabel}</p>
          <p>${product.shortDescription}</p>
        </div>
        ${priceBlock}
        <p class="product-card__status">${product.stockMessage}</p>
        <a class="button button--secondary" href="product.html?handle=${product.handle}">
          ${product.purchasableOnline ? "View bottle" : "Read details"}
        </a>
      </div>
    </article>
  `;
}

function categoryCard(category, count) {
  return `
    <a class="browse-card" href="shop.html?category=${encodeURIComponent(category)}">
      <span class="browse-card__pill">${count} bottle${count === 1 ? "" : "s"}</span>
      <h3>${category}</h3>
      <p>Start with the style and then narrow by country, fulfilment, or in-bar availability.</p>
    </a>
  `;
}

function updateResultsCount(element, count) {
  if (element) {
    element.textContent = `${count} product${count === 1 ? "" : "s"} shown`;
  }
}

function renderEmpty(container, message) {
  container.innerHTML = `<div class="empty-state">${message}</div>`;
}

function renderHome(products) {
  const featuredContainer = document.querySelector("[data-featured-products]");
  const categoryContainer = document.querySelector("[data-category-links]");
  const featured = products.filter((product) => product.featured).slice(0, 4);

  if (featuredContainer) {
    featuredContainer.innerHTML = featured.map(productCard).join("");
  }

  if (categoryContainer) {
    const counts = products.reduce((acc, product) => {
      acc[product.category] = (acc[product.category] || 0) + 1;
      return acc;
    }, {});

    categoryContainer.innerHTML = Object.entries(counts)
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([category, count]) => categoryCard(category, count))
      .join("");
  }
}

function filterProducts(products) {
  const params = new URLSearchParams(window.location.search);
  const searchValue = document.querySelector("[data-filter-search]")?.value.trim().toLowerCase() ?? "";
  const categoryValue = document.querySelector("[data-filter-category]")?.value || params.get("category") || "";
  const countryValue = document.querySelector("[data-filter-country]")?.value || "";
  const fulfilmentValue = document.querySelector("[data-filter-fulfilment]")?.value || "";
  const serviceValue = document.querySelector("[data-filter-service]")?.value || "";

  return products.filter((product) => {
    const haystack = [
      product.title,
      product.producer,
      product.country,
      product.region,
      product.category,
      product.grapes,
    ]
      .join(" ")
      .toLowerCase();

    const matchesSearch = !searchValue || haystack.includes(searchValue);
    const matchesCategory = !categoryValue || product.category === categoryValue;
    const matchesCountry = !countryValue || product.country === countryValue;
    const matchesFulfilment = !fulfilmentValue || product.publishingState === fulfilmentValue;
    const matchesService =
      !serviceValue ||
      (serviceValue === "by_glass" && product.availableByGlass) ||
      (serviceValue === "bar_active" && product.activeInBar);

    return matchesSearch && matchesCategory && matchesCountry && matchesFulfilment && matchesService;
  });
}

function renderShop(products) {
  const categorySelect = document.querySelector("[data-filter-category]");
  const countrySelect = document.querySelector("[data-filter-country]");
  const resetButton = document.querySelector("[data-filter-reset]");
  const countElement = document.querySelector("[data-results-count]");
  const container = document.querySelector("[data-shop-products]");
  const params = new URLSearchParams(window.location.search);

  if (!container || !categorySelect || !countrySelect) {
    return;
  }

  const categories = [...new Set(products.map((product) => product.category))].sort();
  const countries = [...new Set(products.map((product) => product.country))].sort();

  categorySelect.insertAdjacentHTML(
    "beforeend",
    categories.map((category) => `<option value="${category}">${category}</option>`).join("")
  );
  countrySelect.insertAdjacentHTML(
    "beforeend",
    countries.map((country) => `<option value="${country}">${country}</option>`).join("")
  );

  if (params.get("category")) {
    categorySelect.value = params.get("category");
  }

  const apply = () => {
    const filtered = filterProducts(products);
    updateResultsCount(countElement, filtered.length);
    if (!filtered.length) {
      renderEmpty(container, "No bottles match that filter mix yet.");
      return;
    }
    container.innerHTML = filtered.map(productCard).join("");
  };

  document.querySelectorAll("[data-filter-search], [data-filter-category], [data-filter-country], [data-filter-fulfilment], [data-filter-service]")
    .forEach((control) => control?.addEventListener("input", apply));
  document.querySelectorAll("[data-filter-category], [data-filter-country], [data-filter-fulfilment], [data-filter-service]")
    .forEach((control) => control?.addEventListener("change", apply));

  resetButton?.addEventListener("click", () => {
    document.querySelector("[data-filter-search]").value = "";
    categorySelect.value = "";
    countrySelect.value = "";
    document.querySelector("[data-filter-fulfilment]").value = "";
    document.querySelector("[data-filter-service]").value = "";
    window.history.replaceState({}, "", "shop.html");
    apply();
  });

  apply();
}

function detailMarkup(product) {
  const priceCards = [
    {
      label: "Take-home price",
      value: currency.format(getPrice(product)),
    },
    {
      label: "Bottle retail",
      value: currency.format(product.bottleRetailPrice),
    },
    {
      label: "By the glass",
      value: product.byTheGlassPrice ? currency.format(product.byTheGlassPrice) : "Bar only",
    },
  ];

  return `
    <section class="detail-hero">
      <div class="detail-image">
        <img src="${product.mainImageUrl}" alt="${product.altText}">
      </div>
      <div class="detail-content">
        <div class="tag-row">${productTags(product)}</div>
        <div>
          <p class="eyebrow">Product detail</p>
          <h1>${product.title}</h1>
          <p class="lead">${product.shortDescription}</p>
        </div>
        <div class="detail-prices">
          ${priceCards
            .map(
              (card) => `
                <div class="detail-price-card">
                  <span>${card.label}</span>
                  <strong>${card.value}</strong>
                </div>
              `
            )
            .join("")}
        </div>
        <div class="detail-grid">
          <article>
            <h3>What it tastes like</h3>
            <p>${product.tastingNotes}</p>
          </article>
          <article>
            <h3>Daniel recommends</h3>
            <p>${product.danielNote || "Use staff recommendation text here when it is public-facing."}</p>
          </article>
          <article>
            <h3>Fulfilment</h3>
            <p>${fulfilmentText(product)}</p>
            <p>${product.stockMessage}</p>
          </article>
          <article>
            <h3>Wine facts</h3>
            <p>${product.regionLabel}</p>
            <p>${product.grapes}</p>
            <p>${product.abv}% ABV · ${product.bottleSize}</p>
          </article>
        </div>
      </div>
    </section>
  `;
}

function renderProduct(products) {
  const params = new URLSearchParams(window.location.search);
  const handle = params.get("handle");
  const detailContainer = document.querySelector("[data-product-detail]");
  const relatedContainer = document.querySelector("[data-related-products]");

  if (!detailContainer || !relatedContainer) {
    return;
  }

  const product = products.find((item) => item.handle === handle) || products[0];
  document.title = `${product.title} | Crush prototype`;
  detailContainer.innerHTML = detailMarkup(product);

  const related = products
    .filter((item) => item.handle !== product.handle)
    .filter((item) => item.category === product.category || item.country === product.country)
    .slice(0, 3);

  relatedContainer.innerHTML = related.length
    ? related.map(productCard).join("")
    : `<div class="empty-state">Add complementary wines or adjacent recommendations here.</div>`;
}

function renderVisit(products) {
  const container = document.querySelector("[data-by-glass-products]");
  if (!container) {
    return;
  }

  const highlights = products.filter((product) => product.availableByGlass && product.activeInBar).slice(0, 4);
  container.innerHTML = highlights.length
    ? highlights.map(productCard).join("")
    : `<div class="empty-state">No by-the-glass highlights are currently marked active.</div>`;
}

function prettyLabel(value) {
  return value.replaceAll("_", " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function renderAdmin(adminData) {
  const overviewContainer = document.querySelector("[data-admin-overview]");
  const navContainer = document.querySelector("[data-admin-table-nav]");
  const panelContainer = document.querySelector("[data-admin-table-panel]");

  if (!overviewContainer || !navContainer || !panelContainer) {
    return;
  }

  const overview = adminData.overview;
  overviewContainer.innerHTML = [
    {
      title: "Public products",
      value: overview.public_products,
      text: "These are visible on the customer-facing website.",
    },
    {
      title: "Shopify-ready",
      value: overview.shopify_publish_ready,
      text: "These are ready to become live ecommerce products.",
    },
    {
      title: "Active in bar",
      value: overview.bar_active_wines,
      text: "These are currently marked active for bar operations.",
    },
    {
      title: "By the glass",
      value: overview.by_glass_wines,
      text: "These are currently flagged as available by the glass.",
    },
    {
      title: "Admin tables",
      value: Object.keys(adminData.tables).length,
      text: "These tables separate identity, pricing, stock, media, and publishing.",
    },
  ]
    .map(
      (item) => `
        <article class="overview-card">
          <p class="eyebrow">${item.title}</p>
          <h3>${item.value}</h3>
          <p>${item.text}</p>
        </article>
      `
    )
    .join("");

  const tableNames = Object.keys(adminData.tables);

  navContainer.innerHTML = tableNames
    .map(
      (name, index) => `
        <button class="admin-table-button ${index === 0 ? "is-active" : ""}" type="button" data-table-name="${name}">
          ${prettyLabel(name)}
        </button>
      `
    )
    .join("");

  function drawTable(name) {
    const rows = adminData.tables[name] || [];
    const headers = rows.length ? Object.keys(rows[0]) : [];
    const title = prettyLabel(name);
    const descriptionMap = {
      catalogue: "What the wine is.",
      pricing: "What it costs and sells for.",
      stock: "What is available operationally.",
      media: "What image and asset records exist.",
      publishing: "What the customer can see and buy.",
      stock_movements: "A simple operational log of stock changes.",
    };

    panelContainer.innerHTML = `
      <section class="admin-table-panel">
        <div class="admin-table-panel__header">
          <div>
            <p class="eyebrow">${title}</p>
            <h2>${rows.length} row${rows.length === 1 ? "" : "s"}</h2>
          </div>
          <p>${descriptionMap[name] || ""}</p>
        </div>
        <div class="table-wrap">
          <table class="data-table">
            <thead>
              <tr>${headers.map((header) => `<th>${header}</th>`).join("")}</tr>
            </thead>
            <tbody>
              ${rows
                .map(
                  (row) => `
                    <tr>
                      ${headers.map((header) => `<td>${row[header] || ""}</td>`).join("")}
                    </tr>
                  `
                )
                .join("")}
            </tbody>
          </table>
        </div>
      </section>
    `;
  }

  navContainer.querySelectorAll("[data-table-name]").forEach((button) => {
    button.addEventListener("click", () => {
      navContainer.querySelectorAll("[data-table-name]").forEach((item) => item.classList.remove("is-active"));
      button.classList.add("is-active");
      drawTable(button.dataset.tableName);
    });
  });

  drawTable(tableNames[0]);
}

async function init() {
  const page = document.body.dataset.page;
  const products = page === "admin" ? [] : await loadProducts();

  if (page === "home") {
    renderHome(products);
  }
  if (page === "shop") {
    renderShop(products);
  }
  if (page === "product") {
    renderProduct(products);
  }
  if (page === "visit") {
    renderVisit(products);
  }
  if (page === "admin") {
    const adminData = await loadAdminData();
    renderAdmin(adminData);
  }
}

init().catch((error) => {
  const main = document.querySelector("main");
  if (main) {
    const message = document.createElement("div");
    message.className = "shell";
    message.innerHTML = `<div class="empty-state">Prototype data failed to load: ${error.message}</div>`;
    main.prepend(message);
  }
});
