async function loadJson(path) {
  const response = await fetch(path);
  return response.json();
}

function gbp(value) {
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
    maximumFractionDigits: 2,
  }).format(value);
}

function renderFront(products) {
  const grid = document.querySelector("[data-wine-grid]");
  const buttons = [...document.querySelectorAll("[data-filter-buttons] .filter-button")];

  if (!grid) return;

  function draw(filter) {
    const shown = filter === "all" ? products : products.filter((wine) => wine.category === filter);

    buttons.forEach((button) => {
      button.classList.toggle("is-active", button.dataset.filter === filter);
    });

    if (!shown.length) {
      grid.innerHTML = '<div class="empty-note">No wines in this category in the sample list yet.</div>';
      return;
    }

    grid.innerHTML = shown.map((wine) => {
      const price = wine.purchasableOnline ? gbp(wine.promotionalPrice ?? wine.takeoutPrice ?? wine.bottleRetailPrice) : "Ask in bar";
      return `
        <article class="wine-card">
          <img src="${wine.mainImageUrl}" alt="${wine.altText}">
          <h2>${wine.title}</h2>
          <p class="wine-meta">${wine.regionLabel}</p>
          <p class="wine-price">${price}</p>
          <p class="wine-note">${wine.shortDescription}</p>
          <p class="wine-daniel"><strong>Daniel says:</strong> ${wine.danielNote || "Ask us what makes this bottle worth trying."}</p>
        </article>
      `;
    }).join("");
  }

  buttons.forEach((button) => {
    button.addEventListener("click", () => draw(button.dataset.filter));
  });

  draw("all");
}

function renderAdmin(adminData) {
  const buttonsWrap = document.querySelector("[data-admin-buttons]");
  const tableWrap = document.querySelector("[data-admin-table]");

  if (!buttonsWrap || !tableWrap) return;

  const tableNames = Object.keys(adminData.tables);

  buttonsWrap.innerHTML = tableNames.map((name, index) => `
    <button class="admin-button ${index === 0 ? "is-active" : ""}" data-table="${name}" type="button">
      ${name.replaceAll("_", " ")}
    </button>
  `).join("");

  function draw(name) {
    const rows = adminData.tables[name] || [];
    const headers = rows.length ? Object.keys(rows[0]) : [];

    [...buttonsWrap.querySelectorAll(".admin-button")].forEach((button) => {
      button.classList.toggle("is-active", button.dataset.table === name);
    });

    tableWrap.innerHTML = `
      <div class="table-wrap">
        <table>
          <thead>
            <tr>${headers.map((header) => `<th>${header}</th>`).join("")}</tr>
          </thead>
          <tbody>
            ${rows.map((row) => `
              <tr>
                ${headers.map((header) => `<td>${row[header] || ""}</td>`).join("")}
              </tr>
            `).join("")}
          </tbody>
        </table>
      </div>
    `;
  }

  buttonsWrap.querySelectorAll(".admin-button").forEach((button) => {
    button.addEventListener("click", () => draw(button.dataset.table));
  });

  draw(tableNames[0]);
}

function mergeWineMapData(products, adminData) {
  const catalogueById = Object.fromEntries(
    (adminData.tables.catalogue || []).map((row) => [row.internal_product_id, row])
  );

  return products
    .map((wine) => {
      const catalogue = catalogueById[wine.id];
      if (!catalogue || !catalogue.latitude || !catalogue.longitude) return null;
      return {
        ...wine,
        latitude: Number(catalogue.latitude),
        longitude: Number(catalogue.longitude),
        producerLocationText: catalogue.producer_location_text,
      };
    })
    .filter(Boolean);
}

function mapDetailMarkup(wine) {
  const price = wine.purchasableOnline ? gbp(wine.promotionalPrice ?? wine.takeoutPrice ?? wine.bottleRetailPrice) : "Ask in bar";
  return `
    <img src="${wine.mainImageUrl}" alt="${wine.altText}">
    <h2>${wine.title}</h2>
    <p><strong>${wine.regionLabel}</strong></p>
    <p><strong>Price:</strong> ${price}</p>
    <p>${wine.shortDescription}</p>
    <p><strong>Daniel says:</strong> ${wine.danielNote || "Ask us what makes this bottle worth trying."}</p>
    <p><strong>Tasting note:</strong> ${wine.tastingNotes}</p>
  `;
}

function renderMap(products, adminData) {
  const mapEl = document.getElementById("wineMap");
  const detailEl = document.querySelector("[data-map-detail]");
  if (!mapEl || !detailEl || typeof Plotly === "undefined") return;

  const wines = mergeWineMapData(products, adminData);

  const trace = {
    type: "scattergeo",
    mode: "markers",
    lat: wines.map((wine) => wine.latitude),
    lon: wines.map((wine) => wine.longitude),
    text: wines.map((wine) => `${wine.title}<br>${wine.regionLabel}`),
    customdata: wines.map((wine) => wine.id),
    hovertemplate: "%{text}<extra></extra>",
    marker: {
      size: 12,
      color: "#6f3cc3",
      line: {
        color: "#ffffff",
        width: 1,
      },
    },
  };

  const layout = {
    margin: { l: 0, r: 0, t: 0, b: 0 },
    paper_bgcolor: "#ffffff",
    geo: {
      projection: { type: "natural earth" },
      showland: true,
      landcolor: "#f4f4f4",
      showcountries: true,
      countrycolor: "#cfcfcf",
      showocean: true,
      oceancolor: "#f8fbff",
      coastlinecolor: "#cfcfcf",
      lakecolor: "#f8fbff",
      bgcolor: "#ffffff",
    },
  };

  Plotly.newPlot(mapEl, [trace], layout, { responsive: true, displayModeBar: false });

  const wineById = Object.fromEntries(wines.map((wine) => [wine.id, wine]));

  mapEl.on("plotly_click", (event) => {
    const id = event.points?.[0]?.customdata;
    const wine = wineById[id];
    if (wine) {
      detailEl.innerHTML = mapDetailMarkup(wine);
    }
  });

  if (wines[0]) {
    detailEl.innerHTML = mapDetailMarkup(wines[0]);
  }
}

async function init() {
  const page = document.body.dataset.page;

  if (page === "front") {
    const products = await loadJson("data/public-products.json");
    renderFront(products);
  }

  if (page === "admin") {
    const adminData = await loadJson("data/admin-data.json");
    renderAdmin(adminData);
  }

  if (page === "map") {
    const products = await loadJson("data/public-products.json");
    const adminData = await loadJson("data/admin-data.json");
    renderMap(products, adminData);
  }
}

init();
