import { useState } from "react";
import imageCompression from "browser-image-compression";
import styles from "./productadd.module.scss";
import firebase from "../firebase";
import { v4 as uuidv4 } from "uuid";

const ProductAdd = () => {
  const [product_cod, setProductCod] = useState("");
  const [product_price, setProductPrice] = useState(0);
  const [product_image, setProductImage] = useState("");
  const [product_image_converted, setProductImageConverted] = useState("");
  const [sizeXS, setXS] = useState(0);
  const [sizeS, setS] = useState(0);
  const [sizeM, setM] = useState(0);
  const [sizeL, setL] = useState(0);
  const [sizeXL, setXL] = useState(0);
  const [sizeXXL, setXXL] = useState(0);

  const addProduct = async () => {
    let imageName = await imageToServer(product_image);
    const db = firebase.firestore();
    db.collection("products").add({
      product_image: imageName,
      product_cod,
      product_price,
      sizeXS,
      sizeS,
      sizeM,
      sizeL,
      sizeXL,
      sizeXXL,
    });
  };

  const compressImage = async (event) => {
    //compresses image to below 1MB
    const imageFile = event.target.files[0];
    const options = {
      maxSizeMB: 1,
      maxWidthOrHeight: 1920,
      useWebWorker: true,
    };
    try {
      const compressedFile = await imageCompression(imageFile, options);
      setProductImage(compressedFile);
      setProductImageConverted(URL.createObjectURL(compressedFile));
    } catch (error) {
      console.log(error);
    }
  };
  const imageToServer = async (image) => {
    //upload image to firebase storage
    let storageRef = firebase.storage().ref();
    // Points to 'images'
    let imageName = uuidv4();
    let imagesRef = storageRef.child("images");
    var spaceRef = imagesRef.child(imageName);
    await spaceRef.put(image);
    return imageName;
  };

  return (
    <>
      <div className={styles.container}>
        <div className={styles.containerForm}>
          <img
            src={product_image_converted}
            width="200px"
            alt="image_preview"
          />
          <label>Product Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={(event) => compressImage(event)}
          />
          <label>Product cod</label>
          <input type="text" onChange={(e) => setProductCod(e.target.value)} />
          <label>Product Price</label>
          <input
            type="number"
            onChange={(e) => setProductPrice(parseInt(e.target.value))}
          />
          <label>Product Sizes</label>
          <div className={styles.productSizeContainer}>
            <label>XS</label>
            <input
              type="number"
              onChange={(e) => setXS(parseInt(e.target.value))}
            />
            <label>S</label>
            <input
              type="number"
              onChange={(e) => setS(parseInt(e.target.value))}
            />
            <label>M</label>
            <input
              type="number"
              onChange={(e) => setM(parseInt(e.target.value))}
            />
            <label>L</label>
            <input
              type="number"
              onChange={(e) => setL(parseInt(e.target.value))}
            />
            <label>XL</label>
            <input
              type="number"
              onChange={(e) => setXL(parseInt(e.target.value))}
            />
            <label>XXL</label>
            <input
              type="number"
              onChange={(e) => setXXL(parseInt(e.target.value))}
            />
          </div>
          <button onClick={addProduct}>Add Product</button>
        </div>
      </div>
    </>
  );
};

export default ProductAdd;
