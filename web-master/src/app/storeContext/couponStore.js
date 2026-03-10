import axios from "../../../axios";
import {create} from "zustand";
import { debounce } from "lodash";

const useCouponStore = create((set, get) => ({
  isAuthenticated: false,
  error: null,
  coupons: [],
  message: null,
  discountedPrice: 0,

  checkLocalStorageAndVerifyToken: async () => {
    const token = localStorage.getItem("onlineKingWebToken");
    if (!token) {
      set({ isAuthenticated: false });
      return;
    }

    try {
      const response = await axios.get("/api/verify-token", {
        headers: {
          Authorization: token,
        },
      });
      if (response.data.status === "success") {
        set({ isAuthenticated: true });
      } else {
        set({ isAuthenticated: false });
      }
    } catch (error) {
      set({ isAuthenticated: false });
    }
  },

  fetchCoupons: async () => {
    const { checkLocalStorageAndVerifyToken } = get();
    await checkLocalStorageAndVerifyToken();
    const { isAuthenticated } = get();

    if (!isAuthenticated) {
      return;
    }

    try {
      const response = await axios.get("/api/get-coupons", {
        headers: {
          Authorization: localStorage.getItem("onlineKingWebToken"),
        },
      });
      if (response.data.status === "success") {
        set({ coupons: response.data.coupons });
      }
    } catch (error) {
      set({ error: error.message });
    }
  },

  checkCouponApplicability: async (id, totalPrice, openSnackbar) => {
    const { checkLocalStorageAndVerifyToken } = get();
    await checkLocalStorageAndVerifyToken();
    const { isAuthenticated } = get();

    if (!isAuthenticated) {
      return;
    }

    try {
      const response = await axios.post(
        "/api/check-coupons-applicable",
        {
          coupon_id: id,
          totalprice: totalPrice,
        },
        {
          headers: {
            Authorization: localStorage.getItem("onlineKingWebToken"),
          },
        }
      );
      if (response.data.status === "success") {
        openSnackbar(response.data.message, "success");
        set({
          message: response.data.message,
          discountedPrice: response.data.discountPrice,
        });
      } else {
        throw new Error(response.data.message)
      }
    } catch (error) {
      set({ error: error.message });
    }
  },
}));

export default useCouponStore;
