import { useState } from "react";
import imageCompression from "browser-image-compression";
import styles from "./productadd.module.scss";
import Placeholder from '../assets/placeholder.png';
import firebase from "../firebase";
import { v4 as uuidv4 } from "uuid";

const ProductAdd = () => {
  const [product_cod, setProductCod] = useState("");
  const [product_price, setProductPrice] = useState(0);
  const [product_image, setProductImage] = useState("");
  const [isImage, setIsImage] = useState(false);
  const [product_image_converted, setProductImageConverted] = useState("");
  const [sizeXS, setXS] = useState(0);
  const [sizeS, setS] = useState(0);
  const [sizeM, setM] = useState(0);
  const [sizeL, setL] = useState(0);
  const [sizeXL, setXL] = useState(0);
  const [sizeXXL, setXXL] = useState(0);
  const [isValidationError,setIsValidationError] = useState(false);

  const addProduct = async () => {
    const isValidate = validateFields();
    if(isValidate === true){
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
    }
  };

  const validateFields = () =>{
    if(product_cod === "" || product_price === 0){
      setIsValidationError(true);
      return false;
    }
    else return true;
  }

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
      setIsImage(true);
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
      <div className={styles.header}>
        <h1 className={styles.labelHeader}>Add Product</h1>
      </div>
      <div className={styles.container}>
          {isImage ?
            (<img
            src={product_image_converted}
            className={styles.image}
            alt="image_preview"
          />)
        :(<img
          src={Placeholder}
          className={styles.image}
          alt="image_preview"
        />)}
          <label htmlFor="file-upload" className={styles.customFileUpload}>Upload Image</label>
          <input
            type="file"
            accept="image/*"
            id="file-upload"
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
            <div className={styles.sizeItem}>
              <label>XS</label>
              <input
                type="number"
                className={styles.sizeField}
                onChange={(e) => setXS(parseInt(e.target.value))}
              />
            </div>
            <div className={styles.sizeItem}>
              <label>S</label>
              <input
                type="number"
                className={styles.sizeField}
                onChange={(e) => setS(parseInt(e.target.value))}
              />
            </div>
            <div className={styles.sizeItem}>
              <label>M</label>
              <input
                type="number"
                className={styles.sizeField}
                onChange={(e) => setM(parseInt(e.target.value))}
              />
            </div>
          </div>
          <div className={styles.productSizeContainer}>
          <div className={styles.sizeItem}>
              <label>L</label>
              <input
                type="number"
                className={styles.sizeField}
                onChange={(e) => setL(parseInt(e.target.value))}
              />
            </div>
            <div className={styles.sizeItem}>
              <label>XL</label>
              <input
                type="number"
                className={styles.sizeField}
                onChange={(e) => setXL(parseInt(e.target.value))}
              />
            </div>
            <div className={styles.sizeItem}>
              <label>XXL</label>
              <input
                type="number"
                className={styles.sizeField}
                onChange={(e) => setXXL(parseInt(e.target.value))}
              />
            </div>
          </div>
          <h1 className={styles.validationError}>*Product cod and product price field must be filled</h1>
          <button onClick={addProduct} className={styles.btnPrimary}>Add Product</button>
      </div>
    </>
  );
};

export default ProductAdd;
