import axios from "../../../axios";
import {create} from "zustand";
import { debounce } from "lodash";
import Swal from 'sweetalert2'
//import { headers } from "next/headers";

const useProductStore = create((set, get) => ({
  isAuthenticated: false,
  error: null,
  DealOfTheDayProducts: [],
  PopularProducts: [],
  fetchProductByStatus: [],
  BannersData: [],
  searchProducts: [],
  faqData: [],
  recommendedProducts: [],
  categoryData: [],
  subCategoryData: [],
  productData: [],
  productDetails: {},
  totalProducts: 0,
  user: {},
  userProfile: {},
  cartData: [],
  totalMrp: 0,
  cartCount: 0,
  totalPrice: 0,
  wishlistData: [],
  wishlistCount: 0,
  offersData: [],
  brands: [],
  superSubCategoryData: [],
  priceRangeProduct: [],
  orderDetail: [],
  PreOrderCarts: [],
  PreOrderCartsCount: 0,
  PreOrderTotalMrp: 0,
  PreOrderTotalPrice: 0,
  BannerProductTypeData: [],

  checkLocalStorageAndVerifyToken: async () => {
    const token = localStorage.getItem("onlineKingWebToken");
    if (!token) {
      set({ isAuthenticated: false, error: "Token not found in localStorage" });
      return;
    }
    
    try {
      const response = await axios.get("/api/verify-token", {
        headers: {
          Authorization: token,
        },
      });
      
      if (response.data.verifier !== "Session expired") {
        set({
          isAuthenticated: true,
          error: null,
          user: response.data.verifier,
          userProfile: response.data.user,
        });
      } else {
        set({
          isAuthenticated: false,
          error: response.data.verifier,
          user: response.data.verifier,
        });
      }
    } catch (error) {
      set({ isAuthenticated: false, error: error.message });
    }
  },

  loginUser: async (payload, loginType = "CUSTOMER", openSnackbar, router) => {
    try {
      const res = await axios.post(
        `/api/login-user-dealer?type=${loginType}`,
        payload
      );
      if (res.data.status === "success") {
        openSnackbar(res.data.message, "success");
        localStorage.setItem("onlineKingWebToken", res.data.token);
        localStorage.setItem("onlineKinguserid", res.data.user_id);
        localStorage.setItem("onlineKinglogintype", "logedin");
        set({
          isAuthenticated: true,
        });
        router.push("/");
      } else {
        openSnackbar(res.data.message, "error");
      }
    } catch (error) {
      console.log(error);
      openSnackbar(err.response.data.message, "error");
    }
  },

  fetchProductData: async (
    category_id,
    sub_category_id,
    product_brand_id,
    product_name,
    super_sub_category_id = null,
    q = "",
  ) => {
    try {
      let query = `/api/get-products-customer?`;
      if (category_id) query += `category_id=${category_id}&`;
      if (sub_category_id) query += `sub_category_id=${sub_category_id}&`;
      if (product_brand_id) query += `product_brand_id=${product_brand_id}&`;
      if (product_name) query += `product_name=${product_name}&`;
      if (super_sub_category_id)
        query += `super_sub_category_id=${super_sub_category_id}`;
      if (q) query += `&q=${q}`;

      query = query.endsWith("&") ? query.slice(0, -1) : query;

      const response = await axios.get(query);

      if (response.status === 200) {
        set({
          productData: response.data.products,
          totalProducts: response.data.products.length,
          priceRangeProduct: [response.data.min_price, response.data.max_price],
        });
      }
    } catch (error) {
      set({ error: error.message });
    }
  },

  setPriceRangeProduct: (range) => set({ priceRangeProduct: range }),

  // fetchFilterProductData: async (
  //   category_id,
  //   sub_category_id,
  //   product_brand_id,
  //   product_name,
  //   price_min, // Adding price_min parameter
  //   price_max // Adding price_max parameter
  // ) => {
  //   try {
  //     let query = `/api/get-products-customer?`;
  //     if (category_id) query += `category_id=${category_id}&`;
  //     if (sub_category_id) query += `sub_category_id=${sub_category_id}&`;
  //     if (product_brand_id) query += `product_brand_id=${product_brand_id}&`;
  //     if (product_name) query += `product_name=${product_name}&`;
  //     if (price_min) query += `price_min=${price_min}&`; // Append price_min
  //     if (price_max) query += `price_max=${price_max}&`; // Append price_max

  //     // Clean up the trailing '&' if it exists
  //     query = query.endsWith("&") ? query.slice(0, -1) : query;

  //     const response = await axios.get("/api/get-product-customer");

  //     if (response.status === 200) {
  //       set({
  //         productData: response.data.products,
  //         totalProducts: response.data.products.length,
  //       });
  //     }
  //   } catch (error) {
  //     set({ error: error.message });
  //   }
  // },

  fetchFilterProductData: async (filterOptions = {}) => {
    console.log(filterOptions, "gh");
    try {
      const response = await axios.get("/api/get-products-customer", {
        params: filterOptions,
      });

      if (response.status === 200) {
        set({
          productData: response.data.products,
          totalProducts: response.data.products.length,
        });
      }
    } catch (error) {
      set({ error: error.message });
    }
  },

  fetchProductDetails: async (id, type) => {
    try {
      if (type == 'id') {
        const response = await axios.get(
          `/api/get-products-customer?product_id=${id}`
        );
        if (response.status === 200) {
          set({ productDetails: response.data.products[0] });
        }
      } else if (type == 'name') {
        const response = await axios.get(
          `/api/get-products-customer?product_name=${id}`
        );
        if (response.status === 200) {
          set({ productDetails: response.data.products[0] });
        }
      }
    } catch (error) {
      set({ error: error.message });
    }
  },

  fetchCategoryData: async () => {
    try {
      const response = await axios.get(`/api/fetch-categories-customer`);
      set({ categoryData: response.data.categories });
    } catch (error) {
      set({ error: error.message });
    }
  },

  fetchSubCategoryData: async (options = {}) => {
    try {
      const response = await axios.get(`/api/fetch-subcategories-customers`, {
        params: options,
      });
      set({ subCategoryData: response.data.subcategories });
    } catch (error) {
      set({ error: error.message });
    }
  },
  fetchSubCategoryData1: async (category_id) => {
    try {
      const response = await axios.get(
        `api/fetch-subcategories-customers?category_id=${category_id}`
      );
      if (response.status === 200) {
        console.log(
          response.data.subcategories,
          "Subcategories fetched in Hero"
        );
        return response.data.subcategories;
      }
    } catch (error) {
      console.error("Error fetching subcategories:", error);
    }
  },

  fetchBrandsData: async (options = {}) => {
    try {
      const response = await axios.get(`/api/fetch-product-brands-customer`, {
        params: options,
      });
      set({ brands: response.data.brandNames });
    } catch (error) {
      set({ error: error.message });
    }
  },

  fetchSuperSubCategoryData: async (query = {}) => {
    try {
      const response = await axios.get(
        `/api/fetch-supersubcategories-customers`,
        {
          params: query,
        }
      );
      set({ superSubCategoryData: response.data.superSubcategories });
    } catch (error) {
      set({ error: error.message });
    }
  },

  DealOfTheDayFetch: async () => {
    try {
      const response = await axios.get(
        `/api/fetch-product-by-status?status=Deals`
      );
      set({ DealOfTheDayProducts: response.data.products });
    } catch (error) {
      set({ error: error.message });
    }
  },

  FetchPopularProduct: async () => {
    try {
      const response = await axios.get(
        `/api/fetch-product-by-status?status=Popular`
      );
      set({ PopularProducts: response.data.products });
    } catch (error) {
      set({ error: error.message });
    }
  },

  fetchProductsByStatus: async (status) => {
    try {
      const response = await axios.get(
        `/api/fetch-product-by-status?status=${status}`
      );
      set({ fetchProductByStatus: response.data.products });
    } catch (error) {
      set({ error: error.message });
    }
  },

  // FetchBannerData: async () => {
  //   try {
  //     const response = await axios.get(`/api/get-banners-customer`);
  //     console.log("res", response);
  //     set({ BannersData: response.data.banners });
  //   } catch (error) {
  //     set({ error: error.message });
  //   }
  // },

  // fetchSearchProductData: async (query) => {
  //   try {
  //     const response = await axios.get(`/api/get-products-customer?q=${query}`);
  //     if (response.status === 200) {
  //       set({ searchProducts: response.data.products });
  //     }
  //   } catch (error) {
  //     console.error("Error fetching products:", error);
  //     throw error.message;
  //   }
  // },

  fetchFaqData: async (id) => {
    try {
      const response = await axios.get(`/api/get-product-faq?product_id=${id}`);
      if (response.status === 200) {
        set({ faqData: response.data.faq });
      }
    } catch (error) {
      console.error("Error fetching products:", error);
      throw error;
    }
  },

  createproductFaq: async (paylaod, openSnackbar) => {
    try {
      const response = await axios.post(`/api/create-product-faq`, paylaod, {
        headers: {
          Authorization: localStorage.getItem("onlineKingWebToken"),
        },
      });
      if (response.status === 200) {
        //set({ faqData: response.data.faq });
        console.log(response.data.data, "faq");
        openSnackbar(
          "Thank you for your question! We will get back to you soon.",
          "success"
        );
      } else {
        openSnackbar(response.data.message, "error");
      }
    } catch (error) {
      console.error("Error fetching products:", error);
      throw error;
    }
  },

  fetchRecomendedProduct: async (id) => {
    try {
      const response = await axios.get(
        `/api/fetch-recommended-products?product_id=${id}`
      );
      if (response.status === 200) {
        set({ recommendedProducts: response.data.faq });
      }
    } catch (error) {
      console.error("Error fetching products:", error);
      throw error;
    }
  },

  fetchCartData: async () => {
    const { checkLocalStorageAndVerifyToken } = get();
    await checkLocalStorageAndVerifyToken();
    const { isAuthenticated } = get();

    if (!isAuthenticated) {
      return;
    }

    try {
      const response = await axios.get("/api/get-carts", {
        headers: {
          Authorization: localStorage.getItem("onlineKingWebToken"),
        },
      });

      if (response.data.status === "success") {
        set({
          cartData: response.data.cartItems,
          cartCount: response.data.cartItems.length,
          totalPrice: response.data.totalPrice,
          totalMrp: response.data.totalMrp,
        });
      }
    } catch (error) {
      console.log(error);
    }
  },

  addToCart: async (data, combination, quantity, openSnackbar, router) => {
    const { checkLocalStorageAndVerifyToken } = get();
    await checkLocalStorageAndVerifyToken();
    const { isAuthenticated } = get();
    const { error } = get();
    const { fetchCartData } = get();

    let combinationStock = null;

    if (error === "Session expired") {
      openSnackbar(error, "error");
      router.push("/Login");
      return;
    }

    if (!isAuthenticated) {
      openSnackbar("Please login to add product to cart", "error");
      router.push("/Login");
      return;
    }

    const findCombinationId = (attributesCombinations, combination) => {
      const combinationString = Object.values(combination)
        .sort()
        .join("-")
        .toLowerCase();

      for (const item of attributesCombinations) {
        const itemCombinationString = item.attributes_combinations
          .map((attr) => attr.attribute_value)
          .sort()
          .join("-")
          .toLowerCase();

        if (itemCombinationString === combinationString) {
          combinationStock = item.stock;
          return item.id;
        }
      }

      return null;
    };

    const combinationId = findCombinationId(
      data.product_attributes_associations,
      combination
    );

    if (combinationId && combinationStock === 0) {
      return openSnackbar("Stock unavailable for this variants", "error");
    } else if (data.stock === 0) {
      return openSnackbar("Stock unavailable for this product", "error");
    }

    const productToAdd = {
      product_id: data.id,
      combination_id: combinationId ? combinationId : null,
      quantity: quantity ? quantity : 1,
    };

    try {
      const response = await axios.post("/api/add-to-cart", productToAdd, {
        headers: {
          Authorization: localStorage.getItem("onlineKingWebToken"),
        },
      });

      if (response.data.status === "success") {
        openSnackbar(response.data.message, "success");
        await fetchCartData();
      } else if (response.data.message === "Product is already in the cart") {
        openSnackbar(response.data.message, "error");
      } else {
        openSnackbar(response.data.message, "error");
      }
    } catch (error) {
      console.log(error);
      openSnackbar("An error occurred", "error");
    }
  },

  // handleIncreaseQuantity: async (data, openSnackbar) => {
  //     const { checkLocalStorageAndVerifyToken } = get();
  //     await checkLocalStorageAndVerifyToken();
  //     const { isAuthenticated } = get();
  //     const { fetchCartData } = get();

  //     if (!isAuthenticated) {
  //         return;
  //     }

  //     try {
  //         const response = await axios.post("/api/cart-increament", {
  //             product_id: data.product_id,
  //             combination_id: data.combination_id ? data.combination_id : null,
  //          }, {
  //             headers: {
  //                 Authorization: localStorage.getItem('onlineKingWebToken'),
  //             },
  //         });
  //         if (response.data.status === "success") {
  //             openSnackbar(response.data.message, "success");
  //            await fetchCartData();
  //         } else {
  //             openSnackbar(response.data.message, "error");
  //         }
  //     } catch (error) {
  //         console.log(error);
  //     }
  // },

  handleIncreaseQuantity: debounce(async (data, openSnackbar) => {
    const {
      checkLocalStorageAndVerifyToken,
      isAuthenticated,
      fetchCartData,
      fetchPreCartData,
    } = get();
    await checkLocalStorageAndVerifyToken();
    if (!isAuthenticated) {
      return;
    }

    try {
      const response = await axios.post(
        "/api/cart-increament",
        {
          product_id: data.product_id,
          combination_id: data.combination_id ? data.combination_id : null,
        },
        {
          headers: {
            Authorization: localStorage.getItem("onlineKingWebToken"),
          },
        }
      );
      if (response.data.status === "success") {
        openSnackbar(response.data.message, "success");
        await fetchCartData();
      } else {
        openSnackbar(response.data.message, "error");
      }
    } catch (error) {
      console.log(error);
    }
  }, 300),

  handleDecreaseQuantity: debounce(async (data, openSnackbar) => {
    const {
      checkLocalStorageAndVerifyToken,
      isAuthenticated,
      fetchPreCartData,
      fetchCartData,
    } = get();
    await checkLocalStorageAndVerifyToken();
    if (!isAuthenticated) {
      return;
    }

    try {
      const response = await axios.post(
        "/api/cart-decreament",
        {
          product_id: data.product_id,
          combination_id: data.combination_id ? data.combination_id : null,
        },
        {
          headers: {
            Authorization: localStorage.getItem("onlineKingWebToken"),
          },
        }
      );
      if (response.data.status === "success") {
        openSnackbar(response.data.message, "success");
        await fetchCartData();
      }
    } catch (error) {
      console.log(error);
    }
  }, 300),

  handlePreCartIncreaseQuantity: debounce(async (data, openSnackbar) => {
    const {
      checkLocalStorageAndVerifyToken,
      isAuthenticated,
      fetchCartData,
      fetchPreCartData,
    } = get();
    await checkLocalStorageAndVerifyToken();
    if (!isAuthenticated) {
      return;
    }

    try {
      const response = await axios.post(
        "/api/pre-order-cart-increament",
        {
          product_id: data.product_id,
          combination_id: data.combination_id ? data.combination_id : null,
        },
        {
          headers: {
            Authorization: localStorage.getItem("onlineKingWebToken"),
          },
        }
      );
      if (response.data.status === "success") {
        openSnackbar(response.data.message, "success");
        await fetchPreCartData();
      } else {
        openSnackbar(response.data.message, "error");
      }
    } catch (error) {
      console.log(error);
    }
  }, 300),

  handlePreCartDecreaseQuantity: debounce(async (data, openSnackbar) => {
    const {
      checkLocalStorageAndVerifyToken,
      isAuthenticated,
      fetchPreCartData,
      fetchCartData,
    } = get();
    await checkLocalStorageAndVerifyToken();
    if (!isAuthenticated) {
      return;
    }

    try {
      const response = await axios.post(
        "/api/pre-order-cart-decreament",
        {
          product_id: data.product_id,
          combination_id: data.combination_id ? data.combination_id : null,
        },
        {
          headers: {
            Authorization: localStorage.getItem("onlineKingWebToken"),
          },
        }
      );
      if (response.data.status === "success") {
        openSnackbar(response.data.message, "success");
        await fetchPreCartData();
      }
    } catch (error) {
      console.log(error);
    }
  }, 300),

  handleRemoveFromCart: async (data, openSnackbar) => {
    const { checkLocalStorageAndVerifyToken } = get();
    await checkLocalStorageAndVerifyToken();
    const { isAuthenticated } = get();
    const { fetchCartData } = get();
  
    if (!isAuthenticated) {
      return;
    }
  
    Swal.fire({
      title: "Remove from Cart",
      text: `Are you sure you want to remove ${data.name || "this item"} from your cart?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#46b345",
      cancelButtonColor: "#d33",
      cancelButtonText: "No",
      confirmButtonText: "Yes! Remove it",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await axios.post(
            "/api/remove-from-cart",
            {
              product_id: data.product_id,
              combination_id: data.combination_id ? data.combination_id : null,
            },
            {
              headers: {
                Authorization: localStorage.getItem("onlineKingWebToken"),
              },
            }
          );
          if (response.data.status === "success") {
            openSnackbar(response.data.message, "success");
            await fetchCartData(); // Refresh the cart data after removal
          } else {
            openSnackbar(response.data.message, "error");
          }
        } catch (error) {
          console.error(error);
          openSnackbar("Something went wrong. Please try again.", "error");
        }
      }
    });
  },
  

  handleRemoveFromPreOrderCart: async (data, openSnackbar) => {
    const { checkLocalStorageAndVerifyToken } = get();
    await checkLocalStorageAndVerifyToken();
    const { isAuthenticated } = get();
    const { fetchPreCartData } = get();
  
    if (!isAuthenticated) {
      return;
    }
  
    Swal.fire({
      title: "Remove from Pre-Order Cart",
      text: `Are you sure you want to remove ${data.name || "this item"} from your pre-order cart?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#46b345",
      cancelButtonColor: "#d33",
      cancelButtonText: "No",
      confirmButtonText: "Yes! Remove it",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await axios.post(
            "/api/remove-from-pre-order-cart",
            {
              product_id: data.product_id,
              combination_id: data.combination_id ? data.combination_id : null,
            },
            {
              headers: {
                Authorization: localStorage.getItem("onlineKingWebToken"),
              },
            }
          );
          if (response.data.status === "success") {
            openSnackbar(response.data.message, "success");
            await fetchPreCartData(); // Refresh the pre-order cart data after removal
          } else {
            openSnackbar(response.data.message, "error");
          }
        } catch (error) {
          console.error(error);
          openSnackbar("Something went wrong. Please try again.", "error");
        }
      }
    });
  },
  
  fetchWishlistData: async () => {
    const { checkLocalStorageAndVerifyToken } = get();
    await checkLocalStorageAndVerifyToken();
    const { isAuthenticated } = get();

    if (!isAuthenticated) {
      return;
    }

    try {
      const response = await axios.get("/api/get-all-wishlists", {
        headers: {
          Authorization: localStorage.getItem("onlineKingWebToken"),
        },
      });

      if (response.data.status === "success") {
        set({
          wishlistData: response.data.data.filter(e => e.product),
          wishlistCount: response.data.data.filter(e => e.product).length,
        });
      }
    } catch (error) {
      console.log(error);
    }
  },

  handleRemoveFromWishlist: async (data, combination, openSnackbar, router) => {
    const { checkLocalStorageAndVerifyToken } = get();
    await checkLocalStorageAndVerifyToken();
    const { isAuthenticated } = get();
    const { fetchWishlistData } = get();
    const { error } = get();

    if (error === "Session expired") {
      openSnackbar(error, "error");
      router.push("/Login");
      return;
    }

    if (!isAuthenticated) {
      openSnackbar("Not authenticated", "error");
      router.push("/Login");
      return;
    }
    Swal.fire({
      title: "Remove from Wishlist",
      text: `Are you sure you want to remove ${data.name || "this item"} from your wishlist?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#46b345",
      cancelButtonColor: "#d33",
      cancelButtonText: "No",
      confirmButtonText: "Yes! Remove it",
    }).then(async (result) => {
      if (result.isConfirmed) {

    try {
      const response = await axios.post(
        "/api/remove-from-wishlist",
        {
          product_id: data.id,
          combination_id: combination ? combination : null,
        },
        {
          headers: {
            Authorization: localStorage.getItem("onlineKingWebToken"),
          },
        }
      );
      if (response.data.status === "success") {
        openSnackbar(response.data.message, "success");
        await fetchWishlistData();
      }
    } catch (error) {
      console.log(error);
    }

      }
    });
  },

  handleAddToWishlist: async (data, combination, openSnackbar, router) => {
    const { checkLocalStorageAndVerifyToken } = get();
    await checkLocalStorageAndVerifyToken();
    const { isAuthenticated } = get();
    const { fetchWishlistData } = get();
    const { error } = get();

    if (error === "Session expired") {
      openSnackbar(error, "error");
      router.push("/Login");
      return;
    }

    if (!isAuthenticated) {
      openSnackbar("Not authenticated", "error");
      router.push("/Login");
      return;
    }

    // handleIncreaseQuantity: async (data, openSnackbar) => {
    //     const { checkLocalStorageAndVerifyToken } = get();
    //     await checkLocalStorageAndVerifyToken();
    //     const { isAuthenticated } = get();
    //     const { fetchCartData } = get();

    //     if (!isAuthenticated) {
    //         return;
    //     }

    //     return null;
    // };

    // const combinationId = findCombinationId(data.product_attributes_associations, combination)

    try {
      const response = await axios.post(
        "/api/add-to-wishlist",
        {
          product_id: data.id,
          combination_id: combination ? combination : null,
        },
        {
          headers: {
            Authorization: localStorage.getItem("onlineKingWebToken"),
          },
        }
      );
      if (response.data.status === "success") {
        openSnackbar(response.data.message, "success");
        await fetchWishlistData();
      }
    } catch (error) {
      console.log(error);
    }
  },

  DealOfTheDayFetch: async () => {
    try {
      const response = await axios.get(
        `/api/fetch-product-by-status?status=Deals`
      );
      set({ DealOfTheDayProducts: response.data.products });
    } catch (error) {
      set({ error: error.message });
    }
  },
  // RecomendedFetch: async (id) => {
  //     try {
  //         const response = await axios.get(`/api/fetch-recommended-products?product_id=${id}`);
  //         set({ RecomendedProducts: response.data.products });
  //         console.log("response.data.REc",response.data.products);
  //     } catch (error) {
  //         set({ error: error.message });
  //     }
  // },

  RecomendedFetch: async (id) => {
    try {
      console.log('222',id)
      const response = await axios.get(
        `/api/fetch-recommended-products?product_id=${id}`
      );

      console.log("API Response:", response); // Log the entire response

      if (response.status === 200) {
        console.log("API Data Response:", response.data); // Log the entire response
        // Log the fetched data
        console.log("Recommended products fetched:", response.data.products);
        console.log(
          "Recommended products fetched [0]:",
          response.data.products
        );

        // Correctly set the recommended products to the state
        set({ RecomendedProducts: response.data.products });
      } else {
        console.error(
          "Failed to fetch recommended products:",
          response.data.message
        );
        set({ error: response.data.message });
      }
    } catch (error) {
      console.error("Error fetching recommended products:", error);
      set({ error: error.message });
    }
  },

  FetchPopularProduct: async () => {
    try {
      const response = await axios.get(
        `/api/fetch-product-by-status?status=Popular`
      );
      set({ PopularProducts: response.data.products });
    } catch (error) {
      set({ error: error.message });
    }
  },

  // fetchProductsByStatus: async (status) => {
  //   try {
  //     const response = await axios.get(
  //       `/api/fetch-product-by-status?status=${status}`
  //     );
  //     set({ fetchProductByStatus: response.data.products });
  //   } catch (error) {
  //     set({ error: error.message });
  //   }
  // },

  FetchBannerData: async (option = {}) => {
    try {
      const response = await axios.get(`/api/get-banners-customer`, {
        params: option,
      });
      console.log("res", response.data.banners);
      console.log("res", response.data.banners.banner_product_associations);
      set({
        BannersData: response.data.banners,
        BannerProductTypeData:
          response.data.banners[0]?.banner_product_associations,
      });
    } catch (error) {
      set({ error: error.message });
    }
  },

  fetchSearchProductData: async (query = "") => {
    try {
      const response = await axios.get(`/api/get-products-customer?q=${query}`);
      if (response.status === 200) {
        set({ searchProducts: response.data.products });
      }
    } catch (error) {
      console.error("Error fetching products:", error);
      throw error;
    }
  },

  fetchFaqData: async (id) => {
    try {
      const response = await axios.get(`/api/get-product-faq?product_id=${id}`);
      if (response.status === 200) {
        set({ faqData: response.data.faq });
      }
    } catch (error) {
      console.error("Error fetching products:", error);
      throw error;
    }
  },

  // fetchRecomendedProduct: async (id) => {
  //     try {
  //         const response = await axios.get(`/api/fetch-recommended-products?product_id=${id}`);
  //         if (response.status === 200) {
  //             set({ recommendedProducts: response.data.faq })
  //         }
  //     } catch (error) {
  //         console.error("Error fetching products:", error);
  //         throw error;
  //     }
  // },

  fetchCartData: async () => {
    const { checkLocalStorageAndVerifyToken } = get();
    await checkLocalStorageAndVerifyToken();
    const { isAuthenticated } = get();

    if (!isAuthenticated) {
      return;
    }

    try {
      const response = await axios.get("/api/get-carts", {
        headers: {
          Authorization: localStorage.getItem("onlineKingWebToken"),
        },
      });

      if (response.data.status === "success") {
        console.log("response.data.cartItems", response.data.cartItems);
        console.log("response.data.totalMrp", response.data.totalMrp);
        set({
          cartData: response.data.cartItems,
          totalMRP: response.data.totalMrp,
          cartCount: response.data.cartItems.length,
          totalPrice: response.data.totalPrice,
        });
      }
    } catch (error) {
      console.log(error);
    }
  },

  fetchPreCartData: async () => {
    const { checkLocalStorageAndVerifyToken } = get();
    await checkLocalStorageAndVerifyToken();
    const { isAuthenticated } = get();

    if (!isAuthenticated) {
      return;
    }

    try {
      const response = await axios.get("/api/get-pre-order-carts", {
        headers: {
          Authorization: localStorage.getItem("onlineKingWebToken"),
        },
      });

      if (response.data.status === "success") {
        console.log("response.data.cartItems", response.data.cartItems);
        console.log("response.data.totalMrp", response.data.totalMrp);
        set({
          PreOrderCarts: response.data.cartItems,
          PreOrderTotalMrp: response.data.totalMrp,
          PreOrderCartsCount: response.data.cartItems.length,
          PreOrderTotalPrice: response.data.totalPrice,
        });
      }
    } catch (error) {
      console.log(error);
    }
  },

  // addToCart: async (data, combination, quantity, openSnackbar, router) => {
  //   const { checkLocalStorageAndVerifyToken } = get();
  //   await checkLocalStorageAndVerifyToken();
  //   const { isAuthenticated } = get();
  //   const { error } = get();
  //   const { fetchCartData } = get();

  //   if (error === "Session expired") {
  //     openSnackbar(error, "error");
  //     router.push("/Login");
  //     return;
  //   }

  //   if (!isAuthenticated) {
  //     openSnackbar("Not authenticated", "error");
  //     router.push("/Login");
  //     return;
  //   }

  //   const findCombinationId = (attributesCombinations, combination) => {
  //     const combinationString = Object.values(combination)
  //       .sort()
  //       .join("-")
  //       .toLowerCase();

  //     for (const item of attributesCombinations) {
  //       const itemCombinationString = item.attributes_combinations
  //         .map((attr) => attr.attribute_value)
  //         .sort()
  //         .join("-")
  //         .toLowerCase();

  //       if (itemCombinationString === combinationString) {
  //         return item.id;
  //       }
  //     }

  //     return null;
  //   };

  //   const combinationId = findCombinationId(
  //     data.product_attributes_associations,
  //     combination
  //   );

  //   const productToAdd = {
  //     product_id: data.id,
  //     combination_id: combinationId ? combinationId : null,
  //     quantity: quantity ? quantity : 1,
  //   };

  //   try {
  //     const response = await axios.post("/api/add-to-cart", productToAdd, {
  //       headers: {
  //         Authorization: localStorage.getItem("onlineKingWebToken"),
  //       },
  //     });

  //     if (response.data.status === "success") {
  //       openSnackbar(response.data.message, "success");
  //       await fetchCartData();
  //     } else if (response.data.message === "Product is already in the cart") {
  //       openSnackbar(response.data.message, "error");
  //     } else {
  //       openSnackbar(response.data.message, "error");
  //     }
  //   } catch (error) {
  //     console.log(error);
  //     openSnackbar("An error occurred", "error");
  //   }
  // },

  addToPreOrderCart: async (
    data,
    combination,
    quantity,
    openSnackbar,
    router
  ) => {
    const { checkLocalStorageAndVerifyToken } = get();
    await checkLocalStorageAndVerifyToken();
    const { isAuthenticated } = get();
    const { error } = get();
    const { fetchPreCartData } = get();

    if (error === "Session expired") {
      openSnackbar(error, "error");
      router.push("/Login");
      return;
    }

    if (!isAuthenticated) {
      openSnackbar("Please login to add product to cart", "error");
      router.push("/Login");
      return;
    }

    const findCombinationId = (attributesCombinations, combination) => {
      const combinationString = Object.values(combination)
        .sort()
        .join("-")
        .toLowerCase();

      for (const item of attributesCombinations) {
        const itemCombinationString = item.attributes_combinations
          .map((attr) => attr.attribute_value)
          .sort()
          .join("-")
          .toLowerCase();

        if (itemCombinationString === combinationString) {
          return item.id;
        }
      }

      return null;
    };

    const combinationId = findCombinationId(
      data.product_attributes_associations,
      combination
    );

    const productToAdd = {
      product_id: data.id,
      combination_id: combinationId ? combinationId : null,
      quantity: quantity ? quantity : 1,
    };

    try {
      const response = await axios.post("/api/add-to-pre-order", productToAdd, {
        headers: {
          Authorization: localStorage.getItem("onlineKingWebToken"),
        },
      });

      if (response.data.status === "success") {
        openSnackbar(response.data.message, "success");
        await fetchPreCartData();
      } else if (response.data.message) {
        openSnackbar(response.data.message, "error");
      } else {
        openSnackbar(response.data.message, "error");
      }
    } catch (error) {
      console.log(error);
      openSnackbar("An error occurred", "error");
    }
  },

  clearAuthentication: () => {
    localStorage.removeItem("onlineKingWebToken");
    set({ isAuthenticated: false, error: null });
  },

  fetchDiscountOffer: async (query = {}) => {
    try {
      const res = await axios.get(
        "/api/get-all-discounts-like-offer",
        {},
        query
      );
      if (res.data.status === "success") {
        console.log(res.data.discounts, "offer");
        set({
          offersData: res.data.discounts,
        });
      } else {
        console.log("Error in fetching offer");
      }
    } catch (error) {
      throw new Error(error);
    }
  },

  forgetPasswordOtp: async (username) => {
    try {
      const res = await axios.post(
        `/api/send-otp-forgot-password?type=CUSTOMER`,
        username
      );
      console.log(res.data, "otp");
      return res.data;
    } catch (error) {
      console.log("Error in sending otp", error);
    }
  },

  verifyForgetPassword: async (payload, openSnackbar) => {
    try {
      const res = await axios.post(
        "/api/verify-forgot-password?type=CUSTOMER",
        payload
      );
      console.log(res.data, "verift-data");
      if (res.data.status === "success") {
        openSnackbar(res.data.message, "success");
        return res.data;
      } else {
        openSnackbar(res.data.message, "error");
        return res.data;
      }
    } catch (error) {
      const { response } = error;
      console.log("Error in verying forget password", error);
      openSnackbar(response.data.message, "error");
      return response.data;
    }
  },

  fetchUserOrder: async (params = {}, openSnackbar) => {
    try {
      const res = await axios.get("/api/fetch-orders", {
        headers: {
          Authorization: localStorage.getItem("onlineKingWebToken"),
        },
        params: params,
      });
      console.log(res.data, "order-user");
      if (res.data.status === "success") {
        openSnackbar(res.data.message, "success");
        set({ orderDetail: res.data.orders });
      } else {
        openSnackbar(res.data.message, "error");
      }
      return res.data;
    } catch (error) {
      console.log("Error in fetching order", error);
    }
  },

  updateOrderStatus: async (payload) => {
    try {
      const res = await axios.post("/api/order-status-update", payload);
      if (res.data.status) {
        return res.data;
      } else {
        return res.data;
      }
    } catch (error) {
      console.log("Error in updating status");
    }
  },
}));

export default useProductStore;
