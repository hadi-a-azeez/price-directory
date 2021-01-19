import axios from "axios";
import { apiRoot } from "./config";

export const getcategoriesAPI = async () => {
  try {
    return await axios.get(`${apiRoot}/category`);
  } catch (error) {
    console.log(error);
  }
};

export const addcategoriesAPI = async (category) => {
  try {
    return await axios.post(`${apiRoot}/category`, category);
  } catch (error) {
    console.log(error);
  }
};
