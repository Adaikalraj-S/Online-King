import axios from "../../../axios";
import {create} from "zustand";
import { debounce } from "lodash";

const useUserStore = create((set, get) => ({
  isAuthenticated: false,
  error: null,
  user: {},
  userAddress: [],
  defaultSelectedAddress: null,
  userBillingAddress: [],
  defaultBillingSelectedAddress: null,
  shippingAddress: {
    fullname: "",
    mobile: "",
    email: "",
    add_type: "",
    add1: "",
    add2: "",
    landmark: "",
    city: "",
    state: "",
    pincode: "",
    country: "",
  },
  billingAddress: {
    fullname: "",
    mobile: "",
    email: "",
    add_type: "",
    add1: "",
    add2: "",
    landmark: "",
    city: "",
    state: "",
    pincode: "",
    country: "",
  },
  isFormeditable : false,
  setisFormeditable : (value) => set({ isFormeditable: value }),
  setShippingAddress: (address) => set({ shippingAddress: address }),
  setBillingAddress: (address) => set({ billingAddress: address }),

  resetShippingAddress: () => {
    set({
      shippingAddress: {
        fullname: "",
        mobile: "",
        email: "",
        add_type: "",
        add1: "",
        add2: "",
        landmark: "",
        city: "",
        state: "",
        pincode: "",
        country: "",
      },
    });
  },

  resetBillingAddress: () => {
    set({
      billingAddress: {
        fullname: "",
        mobile: "",
        email: "",
        add_type: "",
        add1: "",
        add2: "",
        landmark: "",
        city: "",
        state: "",
        pincode: "",
        country: "",
      },
    });
  },

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

  fetchUserAddress: async () => {
    const { checkLocalStorageAndVerifyToken } = get();
    await checkLocalStorageAndVerifyToken();
    const { isAuthenticated } = get();

    if (!isAuthenticated) {
      return;
    }

    try {
      const response = await axios.get("/api/get-all-addresses", {
        headers: {
          Authorization: localStorage.getItem("onlineKingWebToken"),
        },
      });
      console.log(response, "response");
      if (response.data.status === "success") {
        set({
          userAddress: response.data.addresses,
          defaultSelectedAddress: response.data.addresses[0],
        });
      }
    } catch (error) {
      set({ error: error.message });
    }
  },

  fetchUserBillingAddress: async () => {
    const { checkLocalStorageAndVerifyToken } = get();
    await checkLocalStorageAndVerifyToken();
    const { isAuthenticated } = get();

    if (!isAuthenticated) {
      return;
    }

    try {
      const response = await axios.get("/api/get-all-billing-addresses", {
        headers: {
          Authorization: localStorage.getItem("onlineKingWebToken"),
        },
      });
      if (response.data.status === "success") {
        set({
          userBillingAddress: response.data.addresses,
          defaultBillingSelectedAddress: response.data.addresses[0],
        });
      }
    } catch (error) {
      set({ error: error.message });
    }
  },

  addShippingAddress: async (data, openSnackbar, router) => {
    const { checkLocalStorageAndVerifyToken } = get();
    await checkLocalStorageAndVerifyToken();
    const { isAuthenticated, resetShippingAddress } = get();

    if (!isAuthenticated) {
      openSnackbar("Not authenticated", "error");
      router.push("/Login");
      return;
    }

    try {
      const response = await axios.post(
        "/api/add-addresses",
        { ...data, type: "Shipping" },
        {
          headers: {
            Authorization: localStorage.getItem("onlineKingWebToken"),
          },
        }
      );

      if (response.data.status === "success") {
        await get().fetchUserAddress();
        openSnackbar(response.data.message, "success");
        resetShippingAddress();
      } else {
        openSnackbar(response.data.message, "error");
      }
    } catch (error) {
      set({ error: error.message });
    }
  },

  addBillingAddress: async (data, openSnackbar, router) => {
    const { checkLocalStorageAndVerifyToken } = get();
    await checkLocalStorageAndVerifyToken();
    const { isAuthenticated, resetBillingAddress, billingAddress } = get();

    if (!isAuthenticated) {
      openSnackbar("Not authenticated", "error");
      router.push("/Login");
      return;
    }

    try {
      const response = await axios.post(
        "/api/add-addresses",
        { ...data, type: "Billing" },
        {
          headers: {
            Authorization: localStorage.getItem("onlineKingWebToken"),
          },
        }
      );
      if (response.data.status === "success") {
        await get().fetchUserBillingAddress();
        openSnackbar(response.data.message, "success");
        resetBillingAddress();
      } else {
        openSnackbar(response.data.message, "error");
      }
    } catch (error) {
      set({ error: error.message });
    }
  },

  addAddressOnRegistration: async (data, openSnackbar) => {
    const { user_id, ...rest } = data;
    try {
      const response = await axios.post(
        `/api/add-addresses?user_id=${user_id}`,
        {
          ...rest,
          type: "Billing",
        }
      );
      if (response.data.status === "success") {
        openSnackbar(response.data.message, "success");
      } else {
        openSnackbar(response.data.message, "error");
      }
    } catch (error) {
      set({ error: error.message });
    }
  },

  handleAddressDelete: async (payload, openSnackbar) => {
    try {
      const res = await axios.post("/api/delete-addresses", payload, {
        headers: {
          Authorization: localStorage.getItem("onlineKingWebToken"),
        },
      });
      console.log(res, "fg");
      if (res.data.status === "success") {
        const { fetchUserAddress } = get();
        openSnackbar(res.data.message, "success");
        fetchUserAddress();
        return res.data;
      } else {
        openSnackbar(res.data.message, "error");
        res.data;
      }
    } catch (error) {
      console.log("Error in deleting addreess", error);
    }
  },
  handleAddressEdit: async (payload, openSnackbar) => {
    try {
      const res = await axios.post("/api/edit-addresses", payload, {
        headers: {
          Authorization: localStorage.getItem("onlineKingWebToken"),
        },
      });
  
      if (res.data.status === "success") {
        const { fetchUserAddress } = get(); // Assuming get() provides the necessary state to refresh addresses
        openSnackbar(res.data.message, "success");
        fetchUserAddress(); // Refresh address list after edit
        return res.data;
      } else {
        openSnackbar(res.data.message, "error");
        return res.data;
      }
    } catch (error) {
      console.log("Error in editing address", error);
      openSnackbar("An error occurred while editing the address. Please try again.", "error");
    }
  },
  
  

}));

export default useUserStore;
