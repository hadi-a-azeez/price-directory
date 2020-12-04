import { useEffect, useState } from "react";
import styles from "./products.module.scss";
import firebase from "../firebase";
import { Link } from "react-router-dom";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [isProductsLoading, setIsProductsLoading] = useState(false);
  const [isSearchResultLoading, setIsSearchResultLoading] = useState(false);
  const [filteredProducts, setFilteredProducts] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      setIsProductsLoading(true);
      const db = firebase.firestore();
      const data = await db.collection("products").get();
      setProducts(
        data.docs.map((product) => {
          return { ...product.data(), id: product.id };
        })
      );
      setIsProductsLoading(false);
    };
    fetchData();
  }, []);

  const doSearch = (e) => {
    setIsProductsLoading(true);
    setIsSearchResultLoading(true);

    const searchTerm = e.target.value.toLowerCase();
    setFilteredProducts(
      products.filter((product) => {
        return product.product_cod.toLowerCase().indexOf(searchTerm) >= 0;
      })
    );
    setIsSearchResultLoading(false);
    if (searchTerm === "") {
      setIsProductsLoading(false);
    }
  };

  const SearchResult = () => {
    return (
      <>
        {!isSearchResultLoading &&
          filteredProducts.map((product, index) => (
            <Link
              to={`/admin/product_edit_admin/${product.id}`}
              key={index}
              className={styles.link}
            >
              <div className={styles.card} key={index}>
                <img
                  src={`https://firebasestorage.googleapis.com/v0/b/abony-price-directory.appspot.com/o/images%2F${product.product_image}?alt=media`}
                  alt="product_image`"
                  className={styles.thumbnailImage}
                />
                <div className={styles.details}>
                  <h1 className={styles.cod}>{product.product_cod}</h1>
                  <h1 className={styles.price}>{product.product_price}</h1>
                  <h1 className={styles.stock}>In Stock</h1>
                </div>
              </div>{" "}
            </Link>
          ))}
      </>
    );
  };
  return (
    <>
      <div className={styles.header}>
        <input
          type="text"
          placeholder="Search cod here"
          className={styles.search}
          onChange={(e) => doSearch(e)}
        ></input>
      </div>
      <div className={styles.container}>
        {!isProductsLoading ? (
          products.map((product, index) => (
            <Link
              to={`/admin/product_edit_admin/${product.id}`}
              key={index}
              className={styles.link}
            >
              <div className={styles.card}>
                <img
                  src={`https://firebasestorage.googleapis.com/v0/b/abony-price-directory.appspot.com/o/images%2F${product.product_image}?alt=media`}
                  alt="product_image`"
                  className={styles.thumbnailImage}
                />
                <div className={styles.details}>
                  <h1 className={styles.cod}>{product.product_cod}</h1>
                  <h1 className={styles.price}>{product.product_price}</h1>
                  <h1 className={styles.stock}>In Stock</h1>
                </div>
              </div>
            </Link>
          ))
        ) : (
          <SearchResult />
        )}
      </div>
    </>
  );
};

export default Products;
