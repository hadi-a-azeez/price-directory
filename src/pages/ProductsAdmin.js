import { useEffect, useState } from "react";
import styles from "./products.module.scss";
import firebase from "../firebase";
import { Link } from "react-router-dom";
import Loader from "react-loader-spinner";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import { useHistory } from "react-router-dom";
import TabHeader from "../components/tabHeader";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [isProductsDisplayed, setIsProductsDisplayed] = useState(false);
  const [isSearchResultLoading, setIsSearchResultLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const history = useHistory();
  const db = firebase.firestore();

  useEffect(() => {
    setIsProductsDisplayed(false);
    const fetchData = async () => {
      setIsLoading(true);

      const data = await db
        .collection("products")
        .orderBy("date", "desc")
        .get();
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
  //check if search box is empty then show products
  useEffect(() => {
    if (searchValue === "") {
      setIsProductsDisplayed(true);
    }
  }, [searchValue]);
  const doSearch = async (e) => {
    setIsProductsDisplayed(false);
    setIsSearchResultLoading(true);
    let searchData = await db
      .collection("products")
      .where("product_cod", "==", `PNR${searchValue}`)
      .get();
    searchData.forEach((products) => {
      setFilteredProducts([
        ...filteredProducts,
        { ...products.data(), id: products.id },
      ]);
    });
    console.log(filteredProducts);
    setIsSearchResultLoading(false);
  };

  const StockStatus = (data) => {
    const { sizeXS, sizeS, sizeM, sizeL, sizeXL, sizeXXL } = data.data;
    const totalStock = [sizeXS, sizeS, sizeM, sizeL, sizeXL, sizeXXL];
    if (totalStock.some((s) => s > 0)) {
      return <h1 className={styles.InStock}>In Stock</h1>;
    } else return <h1 className={styles.OutOfStock}>Out Of Stock </h1>;
  };

  const handleFloatingButtonClick = () => {
    history.push("/admin/product_add");
  };

  return (
    <>
      <div className={styles.header}>
        <button className={styles.btnHome} onClick={() => history.push("/")}>
          Home
        </button>
        <input
          type="text"
          placeholder="Search cod here"
          className={styles.search}
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
        />
        <button className={styles.btnHome} onClick={doSearch}>
          Search
        </button>
        <TabHeader selected="products" />
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
        <button className={styles.btnFloat} onClick={handleFloatingButtonClick}>
          +
        </button>
        {isProductsDisplayed ? (
          products.map((product, index) => (
            <Link
              to={`/admin/product_edit_admin/${product.id}`}
              key={index}
              className={styles.link}
            >
              <div className={styles.card}>
                {product.product_image && (
                  <img
                    src={`https://firebasestorage.googleapis.com/v0/b/abony-price-directory.appspot.com/o/images%2F${product.product_image[0]}?alt=media`}
                    alt="product_image`"
                    className={styles.thumbnailImage}
                  />
                )}
                <div className={styles.details}>
                  <h1 className={styles.cod}>{product.product_cod}</h1>
                  <h1
                    className={styles.price}
                  >{`₹${product.product_price}`}</h1>
                  <StockStatus data={product} />
                </div>
              </div>
            </Link>
          ))
        ) : (
          <>
            {filteredProducts.map((product, index) => (
              <Link
                to={`/admin/product_edit_admin/${product.id}`}
                key={index}
                className={styles.link}
              >
                <div className={styles.card}>
                  {product.product_image && (
                    <img
                      src={`https://firebasestorage.googleapis.com/v0/b/abony-price-directory.appspot.com/o/images%2F${product.product_image[0]}?alt=media`}
                      alt="product_image`"
                      className={styles.thumbnailImage}
                    />
                  )}
                  <div className={styles.details}>
                    <h1 className={styles.cod}>{product.product_cod}</h1>
                    <h1
                      className={styles.price}
                    >{`₹${product.product_price}`}</h1>
                    <StockStatus data={product} />
                  </div>
                </div>
              </Link>
            ))}
          </>
        )}
      </div>
      <div style={{ marginTop: 20 }} />
    </>
  );
};

export default Products;
