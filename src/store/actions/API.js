import axios from "axios";

export const API = axios.create({
  baseURL: "https://yeepule-nft.herokuapp.com/",
});
