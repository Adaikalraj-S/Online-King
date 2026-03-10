import axios from "axios";

const instance = axios.create({
  // baseURL: "http://localhost:4000/",
  // baseURL: "http://103.86.177.4:8888/",
  //baseURL: "http://192.168.68.108:4002",
  baseURL: "https://api.onlineking.in/",
  headers: {
    post: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    get: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  },
  withCredentials: false,
});

export default instance;
