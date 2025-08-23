const products = document.getElementById("products");
const priceLowHigh = document.getElementById("sortPriceLowHigh");
const priceHighLow = document.getElementById("sortPriceHighLow");
const ratingHighLow = document.getElementById("sortRating");

let allProducts = [];

//? Rendering cards in product-container
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


//? Fetching API Data
const fetchAPI = async () => {
  let API_URL = "https://dummyjson.com/products?limit=15";
  try {
    const response = await fetch(API_URL);
    const data = await response.json();

    allProducts = data.products;
    renderCards(allProducts);
  } catch (error) {
    console.error(error);
  }
};

//? Sorting price low to high button

const handleSortPriceLowHigh = () => {
  let priceAscArray = JSON.parse(JSON.stringify(allProducts));
  priceAscArray = priceAscArray.sort((a, b) => a.price - b.price);
  // Re-render sorting arr
  renderCards(priceAscArray);

  // Highlight only active button
  [priceLowHigh, priceHighLow, ratingHighLow].forEach((btn) => {
    btn.style.cssText = `background-color:''; color: '';`;
  });

  priceLowHigh.style.cssText = "background-color: blue; color: white;";
};

//? Sorting price high to low button

const handleSortPriceHighLow = () => {
  let priceDesArray = JSON.parse(JSON.stringify(allProducts));
  priceDesArray = priceDesArray.sort((a, b) => b.price - a.price);
  // Re-render sorting arr
  renderCards(priceDesArray);

  // Highlight only active button
  [priceLowHigh, priceHighLow, ratingHighLow].forEach((btn) => {
    btn.style.cssText = `background-color:''; color: '';`;
  });

  priceHighLow.style.cssText = "background-color: blue; color: white;";
};

//? Sorting rating high to low button

const handleSortRating = () => {
  let ratingAcsArray = JSON.parse(JSON.stringify(allProducts));
  ratingAcsArray = ratingAcsArray.sort((a, b) => b.rating - a.rating);
  // Re-render sorting arr
  renderCards(ratingAcsArray);

  // Highlight only active button
  [priceLowHigh, priceHighLow, ratingHighLow].forEach((btn) => {
    btn.style.cssText = `background-color:''; color: '';`;
  });

  ratingHighLow.style.cssText = "background-color: blue; color: white;";
};

//? Event Listeners on the buttons
priceLowHigh.addEventListener("click", handleSortPriceLowHigh);
priceHighLow.addEventListener("click", handleSortPriceHighLow);
ratingHighLow.addEventListener("click", handleSortRating);

fetchAPI();
