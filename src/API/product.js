import axios from "axios";
import { apiRoot } from "../config";

//get all products
export const getProductAPI = async () => {
  try {
    const response = await axios.get(`${apiRoot}/product`);
    return response.data;
  } catch (error) {}
};

//delete a product
export const deleteSingleProductAPI = async (productId) => {
  try {
    const response = await axios.delete(`${apiRoot}/product/${productId}`);
    console.log(response);
  } catch (error) {
    console.log(error);
  }
};

//get products by category
export const getProductByCategoryAPI = async (categoryId) => {
  try {
    const response = await axios.get(
      `${apiRoot}/product/category/${categoryId}`
    );
    console.log(response);
    return response.data;
  } catch (error) {}
};
//update productt
export const updateProductAPI = async (product) => {
  try {
    const response = await axios.put(`${apiRoot}/product`, product);
    return response;
  } catch (error) {}
};

//get single product
export const getSingleProduct = async (productId) => {
  try {
    const response = await axios.get(`${apiRoot}/product/single/${productId}`);
    return response.data;
  } catch (error) {
    console.log(error);
  }
};
//search for products
export const searchProductAPI = async (searchTerm) => {
  try {
    const response = await axios.get(`${apiRoot}/product/search/${searchTerm}`);
    return response.data;
  } catch (error) {}
};

//add a product
export const addProductAPI = async (product) => {
  try {
    const response = await axios.post(`${apiRoot}/product`, product);
    console.log(response);
    return response;
  } catch (error) {
    console.log(error);
  }
};

//upload product images
export const uploadImagesAPI = async (productImages, productId) => {
  console.log("in image upload");
  let formData = new FormData();
  productImages.map((image) => {
    formData.append("product_image", image.image);
  });
  console.log("finished appending");
  console.time();
  try {
    const response = await axios.post(
      `${apiRoot}/product/image/${productId}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    console.log("finished uploading");
    console.timeEnd();
    return response;
  } catch (error) {
    console.log(error);
    return error;
  }
};
