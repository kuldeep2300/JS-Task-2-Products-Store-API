const products = document.getElementById("products");
const priceLowHigh = document.getElementById("sortPriceLowHigh");
const priceHighLow = document.getElementById("sortPriceHighLow");
const ratingHighLow = document.getElementById("sortRating");

const form = document.querySelector("form");
const searchInput = document.querySelector("#searchInput");
const searchBtn = document.querySelector(".searchBtn");
const clearSearch = document.querySelector(".clearSearch");

const categories = document.querySelector(".categories");
const clearCategory = document.querySelector(".clearCategory");

let allProducts = [];
let allCategories = [];
let currentProducts = [];
let activeSort = null; // track which sort is active

//* Preventing form default behavior
form.addEventListener("submit", (e) => {
  e.preventDefault();
});

//* Reset sort buttons
const resetSortButtons = () => {
  [priceLowHigh, priceHighLow, ratingHighLow].forEach((btn) => {
    btn.style.cssText = "";
  });
};

//* Categories
(async () => {
  const API = "https://dummyjson.com/products/categories";

  const response = await fetch(API);
  const data = await response.json();

  allCategories = data;

  data.forEach((category) => {
    let divElem = document.createElement("div");
    divElem.className = "category";
    divElem.innerHTML = `
          <label for=${category.slug}>${category.name}</label>
          <input type="radio" name="radio" id=${category.slug} class="category-radio">
    `;

    categories.append(divElem);

    divElem.addEventListener("click", () => handleCategory(category.slug));
  });
})();

//* Handle Particular Category
async function handleCategory(categoryName) {
  const API = `https://dummyjson.com/products/category/${categoryName}`;

  const response = await fetch(API);
  const data = await response.json();

  resetSortButtons();
  currentProducts = data.products;
  renderCards(currentProducts);
}

//* Clear All Categories - Event Handler
clearCategory.addEventListener("click", () => {
  let allRadioBtn = document.querySelectorAll(".category-radio");
  allRadioBtn.forEach((radio) => (radio.checked = false));

  resetSortButtons();
  currentProducts = [...allProducts];
  renderCards(currentProducts);
});

//* Rendering cards in product-container
const renderCards = (array) => {
  products.innerHTML = "";
  array.forEach((product) => {
    let cardElem = document.createElement("div");
    let discountPrice =
      product.price - (product.price / 100) * product.discountPercentage;

    // Rating part
    let fullStars = Math.floor(product.rating);
    let emptyStars = 5 - fullStars;

    let stars = "";
    for (let i = 0; i < fullStars; i++) {
      stars += `<i class="fa-solid fa-star" style="color: #ffc74a;"></i>`;
    }
    for (let i = 0; i < emptyStars; i++) {
      stars += `<i class="fa-regular fa-star"></i>`;
    }

    cardElem.innerHTML = `
      <div class="card">
            <div class="imgContainer">
                <img class="mainImage" src="${
                  product.thumbnail
                }" alt="product-image">
            </div>
            <h2 class="title">${product.title}</h2>
            <p class="price">Rs. ${product.price}</p>
            <p class="discountPrice">Rs. ${discountPrice.toFixed(2)}</p>
            <p class="discountPercentage">save ${
              product.discountPercentage
            }%</p>
            <p class="rating">${stars}</p>

            <div class="btnContainer">
                <button class="showDescBtn">Show Description</button>
                <button class="addToCartBtn">Add to cart</button>
            </div>
            <div class="description" style="display:none;">${
              product.description
            }</div>
         </div>
   `;

    let showDescBtn = cardElem.querySelector(".showDescBtn");
    let descriptionDiv = cardElem.querySelector(".description");
    showDescBtn.addEventListener("click", () => {
      if (descriptionDiv.style.display === "none") {
        descriptionDiv.style.display = "block";
        showDescBtn.textContent = "Less Description";
        showDescBtn.style.cssText = "color: white; background-color: #001442";
      } else {
        descriptionDiv.style.display = "none";
        showDescBtn.textContent = "Show Description";
        showDescBtn.style.cssText = "";
      }
    });

    products.append(cardElem);
  });
};

//* Search Functionality
const handleSearch = async () => {
  let query = searchInput.value.trim();

  if (query.length < 1) {
    return;
  }

  let API = `https://dummyjson.com/products/search?q=${query}`;
  let response = await fetch(API);
  let data = await response.json();

  currentProducts = data.products;
  renderCards(currentProducts);
};

searchBtn.addEventListener("click", handleSearch);

//* Clear Search Functionality
clearSearch.addEventListener("click", () => {
  searchInput.value = "";
  resetSortButtons();
  renderCards(allProducts);
});

//* Fetching API Data
const fetchAPI = async () => {
  let API_URL = "https://dummyjson.com/products?limit=15";
  try {
    const response = await fetch(API_URL);
    const data = await response.json();

    allProducts = data.products;
    currentProducts = [...allProducts];
    renderCards(currentProducts);
  } catch (error) {
    console.error(error);
  }
};

//* Sorting price low to high button
const handleSortPriceLowHigh = () => {
  if (activeSort === "priceAsc") {
    renderCards(currentProducts);

    priceLowHigh.style.cssText = "";
    activeSort = null;
    return;
  }

  // Apply sorting
  let priceAscArray = JSON.parse(JSON.stringify(currentProducts));
  priceAscArray = priceAscArray.sort((a, b) => {
    let discountA = a.price - (a.price * a.discountPercentage) / 100;
    let discountB = b.price - (b.price * b.discountPercentage) / 100;
    return discountA - discountB; // ascending
  });

  // Re-render sorting arr
  renderCards(priceAscArray);

  resetSortButtons();

  // Highlight only active button
  priceLowHigh.style.cssText = "background-color: blue; color: white;";
  activeSort = "priceAsc";
};

//* Sorting price high to low button
const handleSortPriceHighLow = () => {
  if (activeSort === "priceDsc") {
    renderCards(currentProducts);

    priceHighLow.style.cssText = "";
    activeSort = null;
    return;
  }

  // Apply Sorting
  let priceDesArray = JSON.parse(JSON.stringify(currentProducts));
  priceDesArray = priceDesArray.sort((a, b) => {
    let discountA = a.price - (a.price * a.discountPercentage) / 100;
    let discountB = b.price - (b.price * b.discountPercentage) / 100;
    return discountB - discountA; // descending
  });

  // Re-render sorting arr
  renderCards(priceDesArray);

  resetSortButtons();

  // Highlight only active button
  priceHighLow.style.cssText = "background-color: blue; color: white;";
  activeSort = "priceDsc";
};

//* Sorting rating high to low button
const handleSortRating = () => {
  if (activeSort === "ratingDsc") {
    renderCards(currentProducts);

    ratingHighLow.style.cssText = "";
    activeSort = null;
    return;
  }

  // Apply Sorting
  let ratingAcsArray = JSON.parse(JSON.stringify(currentProducts));
  ratingAcsArray = ratingAcsArray.sort((a, b) => b.rating - a.rating);
  // Re-render sorting arr
  renderCards(ratingAcsArray);

  resetSortButtons();

  // Highlight only active button
  ratingHighLow.style.cssText = "background-color: blue; color: white;";
  activeSort = "ratingDsc";
};

//* Event Listeners on the buttons
priceLowHigh.addEventListener("click", handleSortPriceLowHigh);
priceHighLow.addEventListener("click", handleSortPriceHighLow);
ratingHighLow.addEventListener("click", handleSortRating);

fetchAPI();
