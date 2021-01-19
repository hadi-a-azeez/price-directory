import axios from "axios";
import { apiRoot } from "./config";

//add a order
export const addOrderAPI = async (order) => {
  try {
    const response = await axios.post(`${apiRoot}/order`, order);
    return response;
  } catch (error) {
    console.log(error);
  }
};

//get all orders
export const getOrderAPI = async () => {
  try {
    return await axios.get(`${apiRoot}/order`);
  } catch (error) {}
};

//update single order
export const updateOrderAPI = async (order, orderId) => {
  try {
    return await axios.put(`${apiRoot}/order/${orderId}`, order);
  } catch (error) {
    console.log(error);
  }
};

//search for order with id and customer name

export const searchOrderAPI = async (searchTerm) => {
  return await axios.get(`${apiRoot}/order/search/${searchTerm}`);
};
//delete a order
export const deleteOrderAPI = async (orderId) => {
  try {
    return await axios.delete(`${apiRoot}/order/${orderId}`);
  } catch (error) {}
};

//get single order
export const getSingleOrderAPI = async (orderId) => {
  try {
    return await axios.get(`${apiRoot}/order/single/${orderId}`);
  } catch (error) {}
};

//upload order images
export const uploadOrderImageAPI = async (images) => {
  try {
    const formData = new FormData();
    images.map((image) => {
      formData.append("order-image", image.image);
    });
    return await axios.post(`${apiRoot}/order/image`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  } catch (error) {}
};
