import { useEffect, useState } from "react";
import styles from "./products.module.scss";
import firebase from "../firebase";
import { Link } from "react-router-dom";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [isProductsLoading, setIsProductsLoading] = useState(false);
  const [isSearchResultLoading, setIsSearchResultLoading] = useState(false);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [counter, setCouner] = useState("");

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
  const ImageFetch = async ({ imageUrl }) => {
    let storageRef = firebase.storage().ref();
    // Points to 'images'
    let imagesRef = storageRef.child("images");
    var spaceRef = imagesRef.child(imageUrl);
    let image = await spaceRef.getDownloadURL();
    return <img src={image} alt="productImage" />;
  };

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
              to={`/product_detailed/${product.id}`}
              key={index}
              className={styles.link}
            >
              <div className={styles.card}>
                <ImageFetch imageUrl={product.product_image} />
                <div className={styles.details}>
                  <h1 className={styles.cod}>{product.product_image}</h1>
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
