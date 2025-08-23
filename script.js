let API_URL = "https://dummyjson.com/products?limit=15";

const fetchAPI = async () => {
  try {
    const response = await fetch(API_URL);
    const data = await response.json();
    console.log(data.products);
  } catch (error) {
    console.error(error);
  }
};

fetchAPI();