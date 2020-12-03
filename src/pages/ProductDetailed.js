import React, { useEffect, useState } from "react";
import styles from "./productDetailed.module.scss";
import backIcon from "../assets/backIcon.png";
import firebase from "../firebase";

const ProductDetailed = (props) => {
  const [isLoading, setIsLoading] = useState(false);
  const [product, setProduct] = useState([]);
  const ref = firebase.firestore().collection("products");
  const id = props.match.params.id;

  useEffect(() => {
    setIsLoading(true);
    console.log(id);
    const fetchData = async () => {
      setIsLoading(true);
      const snapshot = await ref.doc(id).get();
      const data = snapshot.data();
      setProduct(data);
      setIsLoading(false);
    };
    fetchData();
    console.log(product);
  }, []);

  const handleClick = () => {
    console.log(product);
  };

  return (
    <>
      {!isLoading && (
        <>
          <div className={styles.header}>
            <img src={backIcon} className={styles.backIcon} alt="back_icon" />
            <h1 className={styles.label}>{product.product_cod}</h1>
          </div>
          <div className={styles.container}>
            <img
              src={`https://firebasestorage.googleapis.com/v0/b/abony-price-directory.appspot.com/o/images%2F${product.product_image}?alt=media`}
              alt="product_image`"
              className={styles.productImage}
            />
            <div className={styles.details}>
              <h1 className={styles.cod}>{product.product_cod}</h1>
              <h1 className={styles.price}>{product.product_price}</h1>
              <h1 className={styles.stock}>Stock</h1>
              <h1 className={styles.size}>Small : 5</h1>
              <button onClick={handleClick}>Click me</button>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default ProductDetailed;
