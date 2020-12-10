import { useState, useEffect } from "react";
import imageCompression from "browser-image-compression";
import styles from "./productadd.module.scss";
import firebase from "../firebase";
import { v4 as uuidv4 } from "uuid";
import Loader from "react-loader-spinner";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import { useHistory } from "react-router-dom";
import backIcon from "../assets/backIcon.png";

const ProductAdd = (props) => {
  const [product, setProduct] = useState({});
  const [product_image, setProductImage] = useState("");
  const [isImage, setIsImage] = useState(false);
  const [product_image_converted, setProductImageConverted] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isUpdateLoading, setIsUpdateLoading] = useState(false);
  const [isDeleteLoading, setIsDeleteLoading] = useState(false);
  const ref = firebase.firestore().collection("products");
  const id = props.match.params.id;
  const history = useHistory();

  useEffect(() => {
    console.log(product_image);
    setIsLoading(true);
    const fetchData = async () => {
      const snapshot = await ref.doc(id).get();
      const data = await snapshot.data();
      setProduct(data);
      setIsLoading(false);
    };
    fetchData();
  }, []);

  const addProduct = async () => {
    setIsUpdateLoading(true);
    let imageName;
    if (isImage) {
      imageName = await imageToServer(product_image);
    }
    const db = firebase.firestore();
    if (isImage) {
      db.collection("products")
        .doc(id)
        .set({ ...product, product_image: imageName });
    } else {
      db.collection("products")
        .doc(id)
        .set({ ...product });
    }
    setIsUpdateLoading(false);
    history.push("/admin/products_admin");
  };

  const deleteProduct = () => {
    setIsDeleteLoading(true);
    const db = firebase.firestore();
    db.collection("products").doc(id).delete();
    setIsDeleteLoading(false);
    history.push("/admin/products_admin");
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

  const handleBackClick = () => {
    history.goBack();
  };

  return (
    <>
      <div className={styles.header}>
        <button className={styles.backButton} onClick={handleBackClick}>
          <img src={backIcon} className={styles.backIcon} alt="back_icon" />
        </button>
        <h1 className={styles.label}>Product</h1>
      </div>
      {isLoading ? (
        <div className={styles.loaderwraper}>
          <Loader
            type="Oval"
            color="#0278ae"
            height={50}
            width={50}
            visible={isLoading}
          />
        </div>
      ) : (
        <div></div>
      )}
      {!isLoading && (
        <>
          <div className={styles.container}>
            {isImage ? (
              <img
                src={product_image_converted}
                className={styles.image}
                alt="image_preview"
              />
            ) : (
              <img
                src={`https://firebasestorage.googleapis.com/v0/b/abony-price-directory.appspot.com/o/images%2F${product.product_image}?alt=media`}
                className={styles.image}
                alt="image_preview"
              />
            )}
            <label htmlFor="file-upload" className={styles.customFileUpload}>
              Upload Image
            </label>
            <input
              type="file"
              accept="image/*"
              id="file-upload"
              onChange={(event) => compressImage(event)}
            />
            <label>Product cod</label>
            <input
              type="text"
              value={product.product_cod}
              onChange={(e) =>
                setProduct({ ...product, product_cod: e.target.value })
              }
            />
            <label>Product Price</label>
            <input
              type="number"
              value={product.product_price}
              onChange={(e) =>
                setProduct({ ...product, product_price: e.target.value })
              }
            />
            <label>Product Sizes</label>
            <div className={styles.productSizeContainer}>
              <div className={styles.sizeItem}>
                <label>XS</label>
                <input
                  type="number"
                  value={product.sizeXS}
                  className={styles.sizeField}
                  onChange={(e) =>
                    setProduct({ ...product, sizeXS: e.target.value })
                  }
                />
              </div>
              <div className={styles.sizeItem}>
                <label>S</label>
                <input
                  type="number"
                  value={product.sizeS}
                  className={styles.sizeField}
                  onChange={(e) =>
                    setProduct({
                      ...product,
                      sizeS: e.target.value,
                    })
                  }
                />
              </div>
              <div className={styles.sizeItem}>
                <label>M</label>
                <input
                  type="number"
                  value={product.sizeM}
                  className={styles.sizeField}
                  onChange={(e) =>
                    setProduct({
                      ...product,
                      sizeM: e.target.value,
                    })
                  }
                />
              </div>
            </div>
            <div className={styles.productSizeContainer}>
              <div className={styles.sizeItem}>
                <label>L</label>
                <input
                  type="number"
                  value={product.sizeL}
                  className={styles.sizeField}
                  onChange={(e) =>
                    setProduct({
                      ...product,
                      sizeL: e.target.value,
                    })
                  }
                />
              </div>
              <div className={styles.sizeItem}>
                <label>XL</label>
                <input
                  type="number"
                  value={product.sizeXL}
                  className={styles.sizeField}
                  onChange={(e) =>
                    setProduct({
                      ...product,
                      sizeXL: e.target.value,
                    })
                  }
                />
              </div>
              <div className={styles.sizeItem}>
                <label>XXL</label>
                <input
                  type="number"
                  value={product.sizeXXL}
                  className={styles.sizeField}
                  onChange={(e) =>
                    setProduct({
                      ...product,
                      sizeXXL: e.target.value,
                    })
                  }
                />
              </div>
            </div>
            <button onClick={addProduct} className={styles.btnPrimary}>
              {isUpdateLoading ? (
                <div className={styles.loader}>
                  <Loader
                    type="Oval"
                    color="white"
                    height={18}
                    width={18}
                    visible={isUpdateLoading}
                  />
                </div>
              ) : (
                <div>Update Product</div>
              )}
            </button>
            <button onClick={deleteProduct} className={styles.btnDanger}>
              {isDeleteLoading ? (
                <div className={styles.loader}>
                  <Loader
                    type="Oval"
                    color="white"
                    height={18}
                    width={18}
                    visible={isDeleteLoading}
                  />
                </div>
              ) : (
                <div>Delete Product</div>
              )}
            </button>
          </div>
        </>
      )}
    </>
  );
};

export default ProductAdd;