import React, { useEffect, useState } from "react";
import styles from "./productDetailed.module.scss";
import backIcon from "../assets/backIcon.png";
import firebase from "../firebase";
import Loader from "react-loader-spinner";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import { useHistory } from "react-router-dom";
import { resellerCopy, instagramCopy } from "../components/CopyItems";
import Whatsapp from "../assets/whatsapp.png";
import Instagram from "../assets/instagram.png";

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
  let pantSizesArr = [
    { name: "XS", length: 26 },
    { name: "S", length: 28 },
    { name: "M", length: 30 },
    { name: "L", length: 32 },
    { name: "XL", length: 34 },
    { name: "XXL", length: 36 },
  ];
  let topSizesArr = [
    { name: "XS", length: 36 },
    { name: "S", length: 38 },
    { name: "M", length: 40 },
    { name: "L", length: 42 },
    { name: "XL", length: 44 },
    { name: "XXL", length: 46 },
  ];
  function copyText(textToCopy) {
    var textArea;

    function isOS() {
      //can use a better detection logic here
      return navigator.userAgent.match(/ipad|iphone/i);
    }

    function createTextArea(text) {
      textArea = document.createElement("textArea");
      textArea.readOnly = true;
      textArea.contentEditable = true;
      textArea.value = text;
      document.body.appendChild(textArea);
    }

    function selectText() {
      var range, selection;

      if (isOS()) {
        range = document.createRange();
        range.selectNodeContents(textArea);
        selection = window.getSelection();
        selection.removeAllRanges();
        selection.addRange(range);
        textArea.setSelectionRange(0, 999999);
      } else {
        textArea.select();
      }
    }

    function copyTo() {
      document.execCommand("copy");
      document.body.removeChild(textArea);
    }

    createTextArea(textToCopy);
    selectText();
    copyTo();
  }

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
  let availableSizesArr = [
    { name: "XS", stock: sizeXS },
    { name: "S", stock: sizeS },
    { name: "M", stock: sizeM },
    { name: "L", stock: sizeL },
    { name: "XL", stock: sizeXL },
    { name: "XXL", stock: sizeXXL },
  ];
  //filter array to size avaialable >0
  let availableSizesFiltered = availableSizesArr.filter(
    (size) => size.stock > 0
  );

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
              <h1 className={styles.resellerPrice}>
                Reseller Price:
                {` ₹${parseInt(
                  product.product_price - (product.product_price / 100) * 10
                )}`}
              </h1>
              <h1 className={styles.fabric}>{product.fabric}</h1>
              <button
                className={styles.btnWtsp}
                onClick={() => {
                  copyText(resellerCopy(product, sizeArr));
                  setCopySuccess("copied!");
                }}
              >
                <img
                  src={Whatsapp}
                  alt="whatsapp"
                  width="20px"
                  height="20px"
                  style={{ marginRight: `3px` }}
                />
                Copy For Resellers
              </button>

              <p>{copySuccess}</p>
              <button
                className={styles.btnInstagram}
                onClick={() => {
                  copyText(instagramCopy(product, sizeArr));
                  setcopySuccessInsta("copied!");
                }}
              >
                <img
                  src={Instagram}
                  width="20px"
                  alt="instagram"
                  height="20px"
                  style={{ marginRight: `3px` }}
                />
                Copy For Instagram
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
                  {availableSizesFiltered.map((size) => (
                    <div className={styles.tableRow}>
                      <div className={styles.tabelData}>
                        <h1 className={styles.tableText}>{size.name}</h1>
                      </div>
                      <div className={styles.tabelData}>
                        <h1 className={styles.tableText}>{size.stock}</h1>
                      </div>
                    </div>
                  ))}
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
                  {pantSizesArr.map((size) => (
                    <div className={styles.tableRow}>
                      <div className={styles.tabelData}>
                        <h1 className={styles.tableText}>{size.name}</h1>
                      </div>
                      <div className={styles.tabelData}>
                        <h1 className={styles.tableText}>{size.length}</h1>
                      </div>
                    </div>
                  ))}
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
                  {topSizesArr.map((size) => (
                    <div className={styles.tableRow}>
                      <div className={styles.tabelData}>
                        <h1 className={styles.tableText}>{size.name}</h1>
                      </div>
                      <div className={styles.tabelData}>
                        <h1 className={styles.tableText}>{size.length}</h1>
                      </div>
                    </div>
                  ))}
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
