import React, { useEffect, useState } from "react";
import styles from "./productDetailed.module.scss";
import backIcon from "../assets/backIcon.png";
import firebase from "../firebase";
import Loader from "react-loader-spinner";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import { useHistory } from "react-router-dom";
import { resellerCopy, instagramCopy } from "../components/CopyItems";

const ProductDetailed = (props) => {
  const [isLoading, setIsLoading] = useState(false);
  const [product, setProduct] = useState([]);
  const [pantVisible, setPantVisible] = useState("none");
  const [topVisible, setTopVisible] = useState("none");
  const history = useHistory();
  const ref = firebase.firestore().collection("products");
  const id = props.match.params.id;
  const [copySuccess, setCopySuccess] = useState("");
  const [copySuccessInsta, setcopySuccessInsta] = useState("");

  const copyText = (text) => {
    var input = document.createElement("textarea");
    input.innerHTML = text;
    document.body.appendChild(input);
    input.select();
    var result = document.execCommand("copy");
    document.body.removeChild(input);
    return result;
  };

  useEffect(() => {
    setIsLoading(true);
    const fetchData = async () => {
      setIsLoading(true);
      const snapshot = await ref.doc(id).get();
      const data = snapshot.data();
      setProduct(data);
      setIsLoading(false);
    };
    fetchData();
  }, []);

  const handleBackClick = () => {
    history.goBack();
  };

  const handlePantToggle = () => {
    if (pantVisible === "none") {
      setPantVisible("block");
    } else {
      setPantVisible("none");
    }
  };

  const handleTopToggle = () => {
    if (topVisible === "none") {
      setTopVisible("block");
    } else {
      setTopVisible("none");
    }
  };
  const { sizeXS, sizeS, sizeM, sizeL, sizeXL, sizeXXL } = product;

  let arr = [
    { XS: sizeXS },
    { S: sizeS },
    { M: sizeM },
    { L: sizeL },
    { XL: sizeXL },
    { XXL: sizeXXL },
  ];

  //check avaialble size and converts it to text x,s,m like
  let newArr = arr.filter((s) => {
    if (JSON.stringify(s).split(":").pop().split("}")[0] !== 0) {
      console.log(JSON.stringify(s).split(":").pop().split("}")[0]);
      return true;
    }
  });
  let sizeArr = newArr.map(
    (s) => JSON.stringify(s).split("{").pop().split(":")[0]
  );

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
              <div className={styles.badgePrimary}>{product.type}</div>
              <h1 className={styles.price}>{`₹${product.product_price}`}</h1>
              <h1 className={styles.fabric}>
                Reseller Price:
                {parseInt(
                  product.product_price - (product.product_price / 100) * 10
                )}
              </h1>
              <h1 className={styles.fabric}>{product.fabric}</h1>
              <button
                onClick={() => {
                  copyText(resellerCopy(product, sizeArr));
                  setCopySuccess("copied!");
                }}
              >
                Copy For Resellers
              </button>

              <p>{copySuccess}</p>
              <button
                onClick={() => {
                  copyText(instagramCopy(product, sizeArr));
                  setcopySuccessInsta("copied!");
                }}
              >
                Copy For Insta
              </button>

              <p>{copySuccessInsta}</p>
              <div>
                <div className={styles.table}>
                  <div className={styles.tableHeader}>
                    <div className={styles.headerItem}>
                      <h1 className={styles.headerText}>Size</h1>
                    </div>
                    <div className={styles.headerItem}>
                      <h1 className={styles.headerText}>Stock</h1>
                    </div>
                  </div>
                  <div className={styles.tableContent}>
                    <div className={styles.tableRow}>
                      <div className={styles.tabelData}>
                        <h1 className={styles.tableText}>XS</h1>
                      </div>
                      <div className={styles.tabelData}>
                        <h1 className={styles.tableText}>{product.sizeXS}</h1>
                      </div>
                    </div>
                  </div>
                  <div className={styles.tableRow}>
                    <div className={styles.tabelData}>
                      <h1 className={styles.tableText}>S</h1>
                    </div>
                    <div className={styles.tabelData}>
                      <h1 className={styles.tableText}>{product.sizeS}</h1>
                    </div>
                  </div>
                  <div className={styles.tableRow}>
                    <div className={styles.tabelData}>
                      <h1 className={styles.tableText}>M</h1>
                    </div>
                    <div className={styles.tabelData}>
                      <h1 className={styles.tableText}>{product.sizeM}</h1>
                    </div>
                  </div>
                  <div className={styles.tableRow}>
                    <div className={styles.tabelData}>
                      <h1 className={styles.tableText}>L</h1>
                    </div>
                    <div className={styles.tabelData}>
                      <h1 className={styles.tableText}>{product.sizeL}</h1>
                    </div>
                  </div>
                  <div className={styles.tableRow}>
                    <div className={styles.tabelData}>
                      <h1 className={styles.tableText}>XL</h1>
                    </div>
                    <div className={styles.tabelData}>
                      <h1 className={styles.tableText}>{product.sizeXL}</h1>
                    </div>
                  </div>
                  <div className={styles.tableContent}>
                    <div className={styles.tableRow}>
                      <div className={styles.tabelData}>
                        <h1 className={styles.tableText}>XXL</h1>
                      </div>
                      <div className={styles.tabelData}>
                        <h1 className={styles.tableText}>{product.sizeXXL}</h1>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <h1 className={styles.fabric}>Size Chart </h1>
              <button className={styles.pantOrTop} onClick={handlePantToggle}>
                Pant
              </button>
              <div style={{ display: `${pantVisible}` }}>
                <div className={styles.table}>
                  <div className={styles.tableHeader}>
                    <div className={styles.headerItem}>
                      <h1 className={styles.headerText}>Size</h1>
                    </div>
                    <div className={styles.headerItem}>
                      <h1 className={styles.headerText}>Length</h1>
                    </div>
                  </div>
                  <div className={styles.tableContent}>
                    <div className={styles.tableRow}>
                      <div className={styles.tabelData}>
                        <h1 className={styles.tableText}>XS</h1>
                      </div>
                      <div className={styles.tabelData}>
                        <h1 className={styles.tableText}>26</h1>
                      </div>
                    </div>
                  </div>
                  <div className={styles.tableRow}>
                    <div className={styles.tabelData}>
                      <h1 className={styles.tableText}>S</h1>
                    </div>
                    <div className={styles.tabelData}>
                      <h1 className={styles.tableText}>28</h1>
                    </div>
                  </div>
                  <div className={styles.tableRow}>
                    <div className={styles.tabelData}>
                      <h1 className={styles.tableText}>M</h1>
                    </div>
                    <div className={styles.tabelData}>
                      <h1 className={styles.tableText}>30</h1>
                    </div>
                  </div>
                  <div className={styles.tableRow}>
                    <div className={styles.tabelData}>
                      <h1 className={styles.tableText}>L</h1>
                    </div>
                    <div className={styles.tabelData}>
                      <h1 className={styles.tableText}>32</h1>
                    </div>
                  </div>
                  <div className={styles.tableRow}>
                    <div className={styles.tabelData}>
                      <h1 className={styles.tableText}>XL</h1>
                    </div>
                    <div className={styles.tabelData}>
                      <h1 className={styles.tableText}>34</h1>
                    </div>
                  </div>
                  <div className={styles.tableContent}>
                    <div className={styles.tableRow}>
                      <div className={styles.tabelData}>
                        <h1 className={styles.tableText}>XXL</h1>
                      </div>
                      <div className={styles.tabelData}>
                        <h1 className={styles.tableText}>36</h1>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <button className={styles.pantOrTop} onClick={handleTopToggle}>
                Top
              </button>
              <div style={{ display: `${topVisible}` }}>
                <div className={styles.table}>
                  <div className={styles.tableHeader}>
                    <div className={styles.headerItem}>
                      <h1 className={styles.headerText}>Size</h1>
                    </div>
                    <div className={styles.headerItem}>
                      <h1 className={styles.headerText}>Length</h1>
                    </div>
                  </div>
                  <div className={styles.tableContent}>
                    <div className={styles.tableRow}>
                      <div className={styles.tabelData}>
                        <h1 className={styles.tableText}>XS</h1>
                      </div>
                      <div className={styles.tabelData}>
                        <h1 className={styles.tableText}>36</h1>
                      </div>
                    </div>
                  </div>
                  <div className={styles.tableRow}>
                    <div className={styles.tabelData}>
                      <h1 className={styles.tableText}>S</h1>
                    </div>
                    <div className={styles.tabelData}>
                      <h1 className={styles.tableText}>38</h1>
                    </div>
                  </div>
                  <div className={styles.tableRow}>
                    <div className={styles.tabelData}>
                      <h1 className={styles.tableText}>M</h1>
                    </div>
                    <div className={styles.tabelData}>
                      <h1 className={styles.tableText}>40</h1>
                    </div>
                  </div>
                  <div className={styles.tableRow}>
                    <div className={styles.tabelData}>
                      <h1 className={styles.tableText}>L</h1>
                    </div>
                    <div className={styles.tabelData}>
                      <h1 className={styles.tableText}>42</h1>
                    </div>
                  </div>
                  <div className={styles.tableRow}>
                    <div className={styles.tabelData}>
                      <h1 className={styles.tableText}>XL</h1>
                    </div>
                    <div className={styles.tabelData}>
                      <h1 className={styles.tableText}>44</h1>
                    </div>
                  </div>
                  <div className={styles.tableContent}>
                    <div className={styles.tableRow}>
                      <div className={styles.tabelData}>
                        <h1 className={styles.tableText}>XXL</h1>
                      </div>
                      <div className={styles.tabelData}>
                        <h1 className={styles.tableText}>46</h1>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div style={{ marginTop: `20px` }} />
        </>
      )}
    </>
  );
};

export default ProductDetailed;
