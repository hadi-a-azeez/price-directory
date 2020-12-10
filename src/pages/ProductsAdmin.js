import { useEffect, useState } from "react";
import styles from "./products.module.scss";
import firebase from "../firebase";
import { Link } from "react-router-dom";
import Loader from "react-loader-spinner";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import { useHistory } from "react-router-dom";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [isProductsDisplayed, setIsProductsDisplayed] = useState(false);
  const [isSearchResultLoading, setIsSearchResultLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const history = useHistory();

  useEffect(() => {
    setIsProductsDisplayed(false);
    const fetchData = async () => {
      setIsLoading(true);
      const db = firebase.firestore();
      const data = await db.collection("products").get();
      setProducts(
        data.docs.map((product) => {
          return { ...product.data(), id: product.id };
        })
      );
      setIsProductsDisplayed(true);
      setIsLoading(false);
    };
    fetchData();
  }, []);

  const doSearch = (e) => {
    setIsProductsDisplayed(false);
    setIsSearchResultLoading(true);

    const searchTerm = e.target.value.toLowerCase();
    setFilteredProducts(
      products.filter((product) => {
        return product.product_cod.toLowerCase().indexOf(searchTerm) >= 0;
      })
    );
    setIsSearchResultLoading(false);
    if (searchTerm === "") {
      setIsProductsDisplayed(true);
    }
  };

  const StockStatus = (data) =>{
    const {sizeXS,sizeS,sizeM,sizeL,sizeXL,sizeXXL} = data.data;
    const totalStock = sizeXS+sizeS+sizeM+sizeL+sizeXL+sizeXXL;
    if(totalStock>0){
      return (<h1 className={styles.InStock}>In Stock</h1>)
    }
    else return (<h1 className={styles.OutOfStock}>Out Of Stock </h1>)
  }

  const handleFloatingButtonClick = ()=>{
    history.push('/admin/product_add');
  }

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
                  alt="productImage"
                  className={styles.thumbnailImage}
                />
                <div className={styles.details}>
                  <h1 className={styles.cod}>{product.product_cod}</h1>
                  <h1 className={styles.price}>{`₹${product.product_price}`}</h1>
                  <StockStatus data={product} />
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
        <button className={styles.btnHome} onClick={()=> history.push('/')}>Home</button>
        <input
          type="text"
          placeholder="Search cod here"
          className={styles.search}
          onChange={(e) => doSearch(e)}
        ></input>
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
      <div className={styles.container}>
      <button className={styles.btnFloat} onClick={handleFloatingButtonClick}>+</button>
        {isProductsDisplayed ? (
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
                  <h1 className={styles.price}>{`₹${product.product_price}`}</h1>
                  <StockStatus data={product} />
                </div>
              </div>
            </Link>  
          ))
        ) : (
          <SearchResult />
        )}
      </div>
      <div style={{marginTop : 20}} />
    </>
  );
};

export default Products;
