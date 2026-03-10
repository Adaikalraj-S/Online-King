"use client";
import { createContext, useCallback, useEffect, useState } from "react";
import axios from "../../../axios";
import { useRouter } from "next/navigation";
import { useSnackbar } from "../SnackBarProvider";

// CREATING CONTEXT API
export const CartContext = createContext(null);

const CartContextWrapper = (props) => {
  const router = useRouter();
  const [cartData, setCartData] = useState([]);
  const { openSnackbar } = useSnackbar();

  const fetchCartDetails = useCallback(() => {
    let token;
    if (typeof window !== "undefined") {
      token = localStorage.getItem("onlineKingWebToken");
    }

    if (token) {
      axios
        .get("/api/get-carts", {
          headers: {
            Authorization: token,
          },
        })
        .then((res) => {
          console.log(res);
          if (
            res.data.message === "Session expired" ||
            !localStorage.getItem("onlineKingWebToken")
          ) {
            // router.push('/login');
            localStorage.removeItem("onlineKinguserid");
          } else if (res.data.status === "success") {
            setCartData(res.data.cartItems);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, []);

  useEffect(() => {
    let unmounted = false;
    if (!unmounted) {
      fetchCartDetails();
    }

    return () => {
      unmounted = true;
    };
  }, [fetchCartDetails]);

  const [cartCounter, setCartCounter] = useState(0);
  useEffect(() => {
    if (cartData) {
      setCartCounter(cartData.length);
    }
  }, [cartData]);

  const isLocalStorageAvailable = () => {
    try {
      const testKey = "__test__";
      localStorage.setItem(testKey, testKey);
      localStorage.removeItem(testKey);
      return true;
    } catch (e) {
      return false;
    }
  };

  useEffect(() => {
    if (isLocalStorageAvailable()) {
      // Your localStorage code
      const storedValue = localStorage.getItem("kardifyCartCounter");
      setCartCounter(storedValue !== null ? parseInt(storedValue) : 0);

      const handleStorageChange = (event) => {
        if (event.key === "kardifyCartCounter") {
          setCartCounter(
            event.newValue !== null ? parseInt(event.newValue) : 0
          );
        }
      };

      window.addEventListener("storage", handleStorageChange);

      return () => {
        window.removeEventListener("storage", handleStorageChange);
      };
    } else {
      console.error("localStorage is not available");
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("kardifyCartCounter", cartCounter);
    fetchCartDetails();
  }, [cartCounter, fetchCartDetails]);

  //--------------------------Handle Increment and Decrement------------------------------

  const [count, setCount] = useState(1);
  const handleIncrement = (data) => {
    axios
      .post(
        "/api/cart-increament",
        {
          product_id: data.id,
        },
        {
          headers: {
            Authorization: localStorage.getItem("onlineKingWebToken"),
          },
        }
      )
      .then((res) => {
        if (res.data.status === "success") {
          openSnackbar(res.data.message, "success");
          setCartCounter((prev) => prev + 1);
          setCount((prev) => prev + 1);
          // fetchCartData();
          fetchCartDetails();
        } else {
          openSnackbar(res.data.message, "error");
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleDecrement = (data) => {
    axios
      .post(
        "/api/cart-decreament",
        {
          product_id: data.id,
          combination_id: null,
        },
        {
          headers: {
            Authorization: localStorage.getItem("onlineKingWebToken"),
          },
        }
      )
      .then((res) => {
        if (res.data.status === "success") {
          openSnackbar(res.data.message, "success");
          setCartCounter((prev) => prev - 1);

          setCount((prev) => {
            if (prev > 1) {
              return prev - 1;
            }
            return prev;
          });

          // fetchCartData();
          fetchCartDetails();
        } else {
          openSnackbar(res.data.message, "error");
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  //------------------WISHLIST-----------------------------------
  const [wishListData, setWishListData] = useState([]);
  const [wishListCount, setWishListCount] = useState(0);

  const fetchWishListData = useCallback(() => {
    if (!localStorage.getItem("onlineKingWebToken")) return;

    axios
      .get(`/api/get-all-wishlists`, {
        headers: {
          Authorization: localStorage.getItem("onlineKingWebToken"),
        },
      })
      .then((res) => {
        console.log(res, "RR");
        if (res.data.code == 200) {
          setWishListData(res.data.data);
          setWishListCount(res.data.data.length);
          // Update the count here
        }
        // else if (res.data.message === 'Session expired') {
        //     openSnackbar(res.data.message, 'error');
        //     router.push('/login')
        // }
      })
      .catch((err) => {
        console.log(err);
        if (err.response && err.response.data.statusCode === 400) {
          openSnackbar(err.response.data.message, "error");
        }
      });
  }, []);

  useEffect(() => {
    fetchWishListData();
  }, [fetchWishListData]);

  const addToWish = (data) => {
    if (!localStorage.getItem("onlineKingWebToken")) {
      openSnackbar("Login Required", "error");
      localStorage.removeItem("onlineKinguserid");
      // router.push('/Login')
      return;
    }

    axios
      .post(
        "/api/add-to-wishlist",
        {
          product_id: data?.id,
        },
        {
          headers: {
            Authorization: localStorage.getItem("onlineKingWebToken"),
          },
        }
      )
      .then((res) => {
        console.log(res, "RR");
        if (res.data.code == 200) {
          setWishListData(res.data.data);
          setWishListCount(res.data.data.length); // This should update the count
          console.log("Wishlist count updated to:", res.data.data.length);
        } else {
          openSnackbar("Product Already in WishList", "error");
          localStorage.removeItem("onlineKinguserid");
          // router.push('/Login')
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const removeFromWish = (data) => {
    console.log(data, "RE");
    axios
      .post(
        "/api/remove-from-wishlist",
        {
          product_id: data,
        },
        {
          headers: {
            Authorization: localStorage.getItem("onlineKingWebToken"),
          },
        }
      )
      .then((res) => {
        if (res.data.status === "success") {
          openSnackbar(res.data.message, "success");
          fetchWishListData();
        } else {
          openSnackbar(res.data.message, "error");
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    // PASSING DATA STATE GETTER & SETTER AS CONTEXT VALUE
    <CartContext.Provider
      value={{
        cartCounter,
        wishListCount,
        addToWish,
        fetchWishListData,
        removeFromWish,
        wishListData,
        fetchCartDetails,
        cartData,
        handleIncrement,
        count,
        handleDecrement,
      }}
    >
      {props.children}
    </CartContext.Provider>
  );
};

export default CartContextWrapper;
