import { useState, useEffect } from "react";
import imageCompression from "browser-image-compression";
import styles from "./productadd.module.scss";
import Placeholder from '../assets/placeholder.png';
import firebase from "../firebase";
import { v4 as uuidv4 } from "uuid";
import Loader from "react-loader-spinner";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import { useHistory } from "react-router-dom";
import backIcon from "../assets/backIcon.png";

const ProductAdd = () => {
  const [product_cod, setProductCod] = useState("");
  const [product_price, setProductPrice] = useState(0);
  const [product_image, setProductImage] = useState("");
  const [isImage, setIsImage] = useState(false);
  const [product_image_converted, setProductImageConverted] = useState("");
  const [sizeXS, setXS] = useState(0);
  const [sizeS, setS] = useState(0);
  const [sizeM, setM] = useState(0);
  const [sizeL, setL] = useState(0);
  const [sizeXL, setXL] = useState(0);
  const [sizeXXL, setXXL] = useState(0);
  const [fabric, setFabric] = useState("");
  const [category,setCategory] = useState("");
  const [type, setType] = useState("Top");
  const [isValidationError,setIsValidationError] = useState(false);
  const [isLoading,setIsLoading] = useState(false);
  const history = useHistory();
  const fabricsArray = ['cotton','Muslin','Rayon','Denim','Gorjet','Linen','Cotton mix','Linen cotton','Schifon'];
  const typeArray = ['Top','Pant','Set'];
  const [categories, setCategories] = useState([]);
  const db = firebase.firestore();

  useEffect(() => {
    const fetchCategories = async()=>{
      setIsLoading(true);
            const db = firebase.firestore();
            const data = await db.collection("categories").get();
            setCategories(
              data.docs.map((category) => {
                return { ...category.data(), id: category.id };
              })
            );
            setIsLoading(false);
    }
    fetchCategories();
  }, []);

  const addProduct = async () => {
    setIsLoading(true);
    const isValidate = validateFields();
    if(isValidate === true){
      let imageName = await imageToServer(product_image);
      db.collection("products").add({
        fabric,
        type,
        product_image: imageName,
        product_cod,
        product_price,
        sizeXS,
        sizeS,
        sizeM,
        sizeL,
        sizeXL,
        sizeXXL,
        category,
      });
      setIsLoading(false);
      history.push('/admin/products_admin');
    }
    else setIsLoading(false);
  };

  const validateFields = () =>{
    if(product_cod === "" || product_price === 0){
      setIsValidationError(true);
      return false;
    }
    else return true;
  }

  const compressImage = async (event) => {
    //compresses image to below 1MB
    const imageFile = event.target.files[0];
    const options = {
      maxSizeMB: 1,
      maxWidthOrHeight: 1920,
      useWebWorker: true,
    };
    try {
      const compressedFile = await imageCompression(imageFile, options);
      setProductImage(compressedFile);
      setIsImage(true);
      setProductImageConverted(URL.createObjectURL(compressedFile));
    } catch (error) {
      console.log(error);
    }
  };
  const imageToServer = async (image) => {
    //upload image to firebase storage
    let storageRef = firebase.storage().ref();
    // Points to 'images'
    let imageName = uuidv4();
    let imagesRef = storageRef.child("images");
    var spaceRef = imagesRef.child(imageName);
    await spaceRef.put(image);
    return imageName;
  };

  const handleBackClick = () => {
    history.goBack();
  };

  const handleFabricClick = (val) => {
    setFabric(val);
    console.log(val);
  };
  const handleTypeClick = (val) => {
    setType(val);
    console.log(val);
  };
  const handleCategoryClick = (val) =>{
    setCategory(val);
  }
  return (
    <>
     <div className={styles.header}>
        <button className={styles.backButton} onClick={handleBackClick}>
          <img src={backIcon} className={styles.backIcon} alt="back_icon" />
        </button>
        <h1 className={styles.label}>Add Product</h1>
      </div>
      <div className={styles.container}>
          {isImage ?
            (<img
            src={product_image_converted}
            className={styles.image}
            alt="image_preview"
          />)
        :(<img
          src={Placeholder}
          className={styles.image}
          alt="image_preview"
        />)}
          <label htmlFor="file-upload" className={styles.customFileUpload}>Upload Image</label>
          <input
            type="file"
            accept="image/*"
            id="file-upload"
            onChange={(event) => compressImage(event)}
          />
          <label>Product cod</label>
          <input type="text" onChange={(e) => setProductCod(e.target.value)} />
          <select
            name="type"
            id="type"
            className={styles.dropdown}
            onChange={(e) => handleTypeClick(e.target.value)}
          >
            {typeArray.map((type,index)=>(
              <option value={type} key={index}>
                {type}
              </option>
            ))}
          </select>
          <label>Product Price</label>
          <input
            type="number"
            onChange={(e) => setProductPrice(parseInt(e.target.value))}
          />
          <select
            name="fabric"
            id="fabrics"
            className={styles.dropdown}
            defaultValue={"DEFAULT"}
            onChange={(e) => handleFabricClick(e.target.value)}
          >
            <option value="DEFAULT" disabled>
              Select a fabric
            </option>
            {fabricsArray.map((fabric,index)=>(
              <option value={fabric} key={index}>
                {fabric}
              </option>
            ))}
          </select>
          <select
            name="categories"
            id="categories"
            className={styles.dropdown}
            defaultValue={"DEFAULT"}
            onChange={(e) => handleCategoryClick(e.target.value)}
          >
            <option value="DEFAULT" disabled>
              Select a Category
            </option>
            {!isLoading &&
            categories.map((category)=>(
              <option value={category.category} key={category.id}>
                {category.category}
              </option>
            ))}
          </select>
          <label>Product Sizes</label>
          <div className={styles.productSizeContainer}>
            <div className={styles.sizeItem}>
              <label>XS</label>
              <input
                type="number"
                className={styles.sizeField}
                onChange={(e) => setXS(parseInt(e.target.value))}
              />
            </div>
            <div className={styles.sizeItem}>
              <label>S</label>
              <input
                type="number"
                className={styles.sizeField}
                onChange={(e) => setS(parseInt(e.target.value))}
              />
            </div>
            <div className={styles.sizeItem}>
              <label>M</label>
              <input
                type="number"
                className={styles.sizeField}
                onChange={(e) => setM(parseInt(e.target.value))}
              />
            </div>
          </div>
          <div className={styles.productSizeContainer}>
          <div className={styles.sizeItem}>
              <label>L</label>
              <input
                type="number"
                className={styles.sizeField}
                onChange={(e) => setL(parseInt(e.target.value))}
              />
            </div>
            <div className={styles.sizeItem}>
              <label>XL</label>
              <input
                type="number"
                className={styles.sizeField}
                onChange={(e) => setXL(parseInt(e.target.value))}
              />
            </div>
            <div className={styles.sizeItem}>
              <label>XXL</label>
              <input
                type="number"
                className={styles.sizeField}
                onChange={(e) => setXXL(parseInt(e.target.value))}
              />
            </div>
          </div>
          {isValidationError &&
            <h1 className={styles.validationError}>*Product cod and product price field must be filled</h1>}
          <button onClick={addProduct} className={styles.btnPrimary}>
            {isLoading ? (
              <div className={styles.loader}>
                <Loader
                  type="Oval"
                  color="white"
                  height={18}
                  width={18}
                  visible={isLoading}
                />
              </div>
            ) : 
            <div>Add Product</div>}
        </button>
      </div>
    </>
  );
};

export default ProductAdd;
