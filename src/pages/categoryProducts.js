import {useState,useEffect} from 'react';
import firebase from "../firebase";
import styles from "./products.module.scss";
import {Link} from 'react-router-dom';
import { useHistory } from "react-router-dom";
import Loader from "react-loader-spinner";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";

const CategoryProducts = (props) => {
    const [products, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const category = props.match.params.category;  
    const db = firebase.firestore(); 
    const history = useHistory();

    useEffect(() => {
        const fetchProuducts = async() =>{
            setIsLoading(true);
            const data = await db.collection("products").where("category", "==" , category).get();
            setProducts(
                data.docs.map((product) => {
                  return { ...product.data(), id: product.id };
                })
              );
              setIsLoading(false);
        }
        fetchProuducts();
    }, []);

    const StockStatus = (data) => {
      const { sizeXS, sizeS, sizeM, sizeL, sizeXL, sizeXXL } = data.data;
      const totalStock = sizeXS + sizeS + sizeM + sizeL + sizeXL + sizeXXL;
      if (totalStock > 0) {
        return <h1 className={styles.InStock}>In Stock</h1>;
      } else return <h1 className={styles.OutOfStock}>Out Of Stock </h1>;
    };

    return ( <>
            <div className={styles.header}>
                <button className={styles.btnHome} onClick={() => history.push("/")}>
                Home
                </button>
                <input
                type="text"
                placeholder="Search cod here"
                className={styles.search}
                /* onChange={(e) => doSearch(e)} */
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
          {
            !isLoading &&
            products.map((product) => (
                <Link
                  to={`/product_detailed/${product.id}`}
                  key={product.id}
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
                      <h1
                        className={styles.price}
                      >{`₹${product.product_price}`}</h1>
                     <StockStatus data={product} />
                    </div>
                  </div>
                </Link>
              ))
          }
          </div>
    </> );
}
 
export default CategoryProducts;