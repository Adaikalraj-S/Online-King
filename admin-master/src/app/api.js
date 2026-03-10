import axios from "../../axios";

const getAuthHeaders = () => {
  const token = localStorage.getItem("onlineKingToken");
  return token ? { Authorization: `${token}` } : {};
};

export const fetchData = async (url, params = {}) => {
  try {
    const response = await axios.get(url, {
      headers: getAuthHeaders(),
      params: params,
    });
    if (response.status === 200) {
      return response.data;
    }
    throw new Error(`Error fetching data from ${url}`);
  } catch (error) {
    console.error(`Error fetching data from ${url}:`, error);
    throw error;
  }
};

export const getProducts = async () => await fetchData("/api/get-products");

export const getCategories = async () => {
  const data = await fetchData("/api/fetch-categories");

  console.log(data.categories, "data-cat");
  return data.categories;
};

export const getSubCategories = () => fetchData("/api/fetch-subcategories");

export const getSuperSubCategories = () =>
  fetchData("/api/fetch-supersubcategories");

export const getProductBrands = () =>
  fetchData("/api/fetch-product-brands-admin");

export const getCarBrands = () => fetchData("/api/fetch-car-brands");

export const getProductAttributes = () =>
  fetchData("/api/fetch-all-attributes");

export const getAllCustomerData = () => fetchData("/api/fetch-customers");

export const getAllStoreData = async () => {
  const data = await fetchData("/api/fetch-all-store-info");
  if (data.code === 200) {
    return data;
  }
  throw new Error("Error fetching store data");
};

export const getAllTestimonialsData = () =>
  fetchData("/api/fetch-all-testimonials");

export const getAllBannerData = async () => {
  const data = await fetchData("/api/get-banners-admin");
  console.log(data.data);
  return data.banners;
};

export const getAllDealerData = () => fetchData("/api/fetch-dealers");

export const getAttributes = async () => {
  const data = await fetchData("/api/fetch-all-attributes");

  return data.attributes;
};

export const getFeatures = async () => {
  const data = await fetchData("api/fetch-features");

  return data.features;
};
