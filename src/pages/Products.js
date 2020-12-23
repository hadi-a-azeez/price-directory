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
  const [isProductsDisplayed, setIsProductsDisplayed] = useState(false);
  const [isSearchResultLoading, setIsSearchResultLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [lastDocFetched, setLastDocFetched] = useState();
  const [isEmpty, setIsEmpty] = useState(false);
  const [isMoreProductsLoading, setIsMoreProductLoading] = useState(false);
  const history = useHistory();
  const db = firebase.firestore();
  const productsRef = db.collection("products").orderBy("date", "desc");

  useEffect(() => {
    setIsProductsDisplayed(false);
    const fetchData = async () => {
      setIsLoading(true);
      const data = await productsRef.limit(10).get();
      updateProductsState(data);
      setIsProductsDisplayed(true);
      setIsLoading(false);
    };
    fetchData();
  }, []);

  const updateProductsState = (data) => {
    const isDataEmpty = data.size === 0;
    if (!isDataEmpty) {
      const lastDoc = data.docs[data.docs.length - 1];
      setLastDocFetched(lastDoc);
      setProducts([
        ...products,
        ...data.docs.map((product) => {
          return { ...product.data(), id: product.id };
        }),
      ]);
    } else {
      setIsEmpty(true);
    }
    setIsMoreProductLoading(false);
  };

  const fetchMore = async () => {
    setIsMoreProductLoading(true);
    const data = await productsRef.startAfter(lastDocFetched).limit(10).get();
    updateProductsState(data);
  };

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

  const StockStatus = (data) => {
    const { sizeXS, sizeS, sizeM, sizeL, sizeXL, sizeXXL } = data.data;
    const totalStock = sizeXS + sizeS + sizeM + sizeL + sizeXL + sizeXXL;
    if (totalStock > 0) {
      return <h1 className={styles.InStock}>In Stock</h1>;
    } else return <h1 className={styles.OutOfStock}>Out Of Stock </h1>;
  };

  const ProductCard = ({ product }) => {
    return (
      <Link
        to={`/product_detailed/${product.id}`}
        key={product.id}
        className={styles.link}
      >
        <div className={styles.card} key={product.id}>
          {product.product_image && (
            <img
              src={`https://firebasestorage.googleapis.com/v0/b/abony-price-directory.appspot.com/o/images%2F${product.product_image[0]}?alt=media`}
              alt="product_image`"
              className={styles.thumbnailImage}
            />
          )}
          <div className={styles.details}>
            <h1 className={styles.cod}>{product.product_cod}</h1>
            <h1 className={styles.price}>{`₹${product.product_price}`}</h1>
            <StockStatus data={product} />
          </div>
        </div>{" "}
      </Link>
    );
  };

  const SearchResult = () => {
    return (
      <>
        {!isSearchResultLoading &&
          filteredProducts.map((product) => <ProductCard product={product} />)}
      </>
    );
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
          onChange={(e) => doSearch(e)}
        ></input>
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
        {isProductsDisplayed ? (
          <>
            {products.map((product) => (
              <ProductCard product={product} />
            ))}
            {!isMoreProductsLoading && !isEmpty && (
              <button className={styles.btnLoadMore} onClick={fetchMore}>
                More products
              </button>
            )}
            {isMoreProductsLoading && <h1>Loading</h1>}
            {isEmpty && <h1>No more products</h1>}
          </>
        ) : (
          <SearchResult />
        )}
      </div>
      <div style={{ marginTop: `20px` }} />
    </>
  );
};

export default Products;
