import React, { useEffect, useState } from "react";
import styles from "./productDetailed.module.scss";
import backIcon from "../assets/backIcon.png";
import firebase from "../firebase";
import Loader from "react-loader-spinner";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import { useHistory } from "react-router-dom";

const ProductDetailed = (props) => {
  const [isLoading, setIsLoading] = useState(false);
  const [product, setProduct] = useState([]);
  const history = useHistory();
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

  const handleBackClick = () =>{
    history.goBack();
  }

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
            <img
              src={`https://firebasestorage.googleapis.com/v0/b/abony-price-directory.appspot.com/o/images%2F${product.product_image}?alt=media`}
              alt="product_image`"
              className={styles.productImage}
            />
            <div className={styles.details}>
              <h1 className={styles.cod}>{product.product_cod}</h1>
              <h1 className={styles.price}>{`₹${product.product_price}`}</h1>
              <div>
                <div className={styles.table}>
                  <div className={styles.tableHeader}>
                    <div className={styles.headerItem}><h1  className={styles.headerText}>Size</h1></div>
                    <div className={styles.headerItem}><h1 className={styles.headerText} >Stock</h1></div>
                  </div>
                  <div className={styles.tableContent}>	
                    <div className={styles.tableRow}>		
                      <div className={styles.tabelData}><h1 className={styles.tableText} >XS</h1></div>
                      <div className={styles.tabelData}><h1 className={styles.tableText} >{product.sizeXS}</h1></div>
                    </div>
                    </div>
                    <div className={styles.tableRow}>		
                      <div className={styles.tabelData}><h1 className={styles.tableText} >S</h1></div>
                      <div className={styles.tabelData}><h1 className={styles.tableText} >{product.sizeS}</h1></div>
                    </div>
                    <div className={styles.tableRow}>		
                      <div className={styles.tabelData}><h1 className={styles.tableText} >M</h1></div>
                      <div className={styles.tabelData}><h1 className={styles.tableText} >{product.sizeM}</h1></div>
                    </div>
                    <div className={styles.tableRow}>		
                      <div className={styles.tabelData}><h1 className={styles.tableText} >L</h1></div>
                      <div className={styles.tabelData}><h1 className={styles.tableText} >5</h1></div>
                    </div>
                    <div className={styles.tableRow}>		
                      <div className={styles.tabelData}><h1 className={styles.tableText} >XL</h1></div>
                      <div className={styles.tabelData}><h1 className={styles.tableText} >{product.sizeXL}</h1></div>
                    </div>
                    <div className={styles.tableContent}>	
                    <div className={styles.tableRow}>		
                      <div className={styles.tabelData}><h1 className={styles.tableText} >XXL</h1></div>
                      <div className={styles.tabelData}><h1 className={styles.tableText} >{product.sizeXXL}</h1></div>
                    </div>
                  </div>	
                </div>  
              </div>
            </div>
          </div>
          <div style={{marginTop : `20px`}} />
        </>
      )}
    </>
  );
};

export default ProductDetailed;
