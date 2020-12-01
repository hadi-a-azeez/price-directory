import { useEffect, useState } from "react";
import styles from "./products.module.scss";
import firebase from "../firebase";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      const db = firebase.firestore();
      const data = await db.collection("products").get();
      setProducts(data.docs.map((product) => product.data()));
      setIsLoading(false);
      console.log(products);
    };
    fetchData();
  }, [products]);

  return (
    <>
      <div className={styles.header}>
        <input
          type="text"
          placeholder="Search cod here"
          className={styles.search}
        ></input>
      </div>
      <div className={styles.container}>
        {isLoading &&
          products.map((product, index) => (
            <div className={styles.card} key={index}>
              <img
                src={product.product_image}
                alt="product"
                className={styles.thumbnailImage}
              />
              <div className={styles.details}>
                <h1 className={styles.cod}>{product.product_cod}</h1>
                <h1 className={styles.price}>{product.product_price}</h1>
                <h1 className={styles.stock}>In Stock</h1>
              </div>
            </div>
          ))}
      </div>
    </>
  );
};

export default Products;
