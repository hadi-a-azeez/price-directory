import { useState, useEffect } from "react";
import imageCompression from "browser-image-compression";
import styles from "./productadd.module.scss";
import Placeholder from "../assets/placeholder.png";
import firebase from "../firebase";
import { v4 as uuidv4 } from "uuid";
import Loader from "react-loader-spinner";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import { useHistory } from "react-router-dom";
import backIcon from "../assets/backIcon.png";
import { useForm } from "../components/useForm";
import {
  Input,
  FormControl,
  FormLabel,
  Textarea,
  Stack,
  Radio,
  RadioGroup,
  Button,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
} from "@chakra-ui/react";

const ProductAdd = () => {
  // const [product_cod, setProductCod] = useState("");
  // const [product_price, setProductPrice] = useState(0);
  const [product_image, setProductImage] = useState([]);
  // const [sizeXS, setXS] = useState(0);
  // const [sizeS, setS] = useState(0);
  // const [sizeM, setM] = useState(0);
  // const [sizeL, setL] = useState(0);
  // const [sizeXL, setXL] = useState(0);
  // const [sizeXXL, setXXL] = useState(0);
  // const [fabric, setFabric] = useState("");
  // const [category, setCategory] = useState("");
  // const [type, setType] = useState("Top");

  const [product, setProduct, updateProduct] = useForm({});
  const [isValidationError, setIsValidationError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const history = useHistory();
  const fabricsArray = [
    "cotton",
    "Muslin",
    "Rayon",
    "Denim",
    "Gorjet",
    "Linen",
    "Cotton mix",
    "Linen cotton",
    "Schifon",
  ];
  const typeArray = ["Top", "Pant", "Set"];
  const [categories, setCategories] = useState([]);
  const db = firebase.firestore();

  useEffect(() => {
    const fetchCategories = async () => {
      setIsLoading(true);
      const db = firebase.firestore();
      const data = await db.collection("categories").get();
      setCategories(
        data.docs.map((category) => {
          return { ...category.data(), id: category.id };
        })
      );
      setIsLoading(false);
    };
    fetchCategories();
  }, []);

  const addProduct = async () => {
    setIsLoading(true);
    const isValidate = validateFields();
    if (isValidate === true) {
      let imageName = await imageToServer(product_image);
      db.collection("products").add({
        date: Date.now(),
        ...product,
        product_image: imageName,
      });
      setIsLoading(false);
      history.push("/admin/products");
    } else setIsLoading(false);
  };
  const deleteImageFromArr = (image) => {
    setProductImage((previmage) =>
      previmage.filter((imageInState) => imageInState.name !== image.name)
    );
  };

  const validateFields = () => {
    if (product.product_cod === "" || product.product_price === 0) {
      setIsValidationError(true);
      return false;
    } else return true;
  };

  const compressImage = async (event) => {
    //compresses image to below 1MB
    let imagesFromInput = event.target.files;
    const options = {
      maxSizeMB: 1,
      maxWidthOrHeight: 1280,
      useWebWorker: true,
    };
    try {
      for (let i = 0; i < imagesFromInput.length; i++) {
        const compressedFile = await imageCompression(
          imagesFromInput[i],
          options
        );
        setProductImage((oldArray) => [...oldArray, compressedFile]);
      }

      // setProductImageConverted(URL.createObjectURL(compressedFile));
    } catch (error) {
      console.log(error);
    }
  };
  const imageToServer = async (image) => {
    //upload image to firebase storage
    let storageRef = firebase.storage().ref();
    let imagesRef = storageRef.child("images");
    let imageNames = [];
    // Points to 'images'
    for (let i = 0; i < image.length; i++) {
      let imageName = uuidv4();
      let spaceRef = imagesRef.child(imageName);
      let resp = await spaceRef.put(image[i]);
      console.log(resp);
      imageNames.push(imageName);
    }
    return imageNames;
  };

  const handleBackClick = () => {
    history.goBack();
  };

  return (
    <>
      <div className={styles.header}>
        <button className={styles.backButton} onClick={handleBackClick}>
          <img src={backIcon} className={styles.backIcon} alt="back_icon" />
        </button>
        <h1 className={styles.label}>Add Product</h1>
      </div>
      <div className={styles.container}>
        {product_image.length > 0 ? (
          product_image.map((image, index) => (
            <img
              key={index}
              src={URL.createObjectURL(image)}
              className={styles.image}
              alt="image_preview"
              onClick={() => deleteImageFromArr(image)}
            />
          ))
        ) : (
          <img src={Placeholder} className={styles.image} alt="image_preview" />
        )}
        <label htmlFor="file-upload" className={styles.customFileUpload}>
          Upload Image
        </label>
        <input
          type="file"
          accept="image/*"
          id="file-upload"
          onChange={(event) => compressImage(event)}
          multiple
        />
        <FormControl id="product_cod" w="90%" mt="2" isRequired>
          <FormLabel>Product cod</FormLabel>
          <Input
            type="text"
            onChange={updateProduct}
            name="product_cod"
            value={product.product_cod || ""}
          />
        </FormControl>
        <select
          name="type"
          id="type"
          className={styles.dropdown}
          onChange={updateProduct}
          name="type"
          value={product.type || ""}
        >
          {typeArray.map((type, index) => (
            <option value={type} key={index}>
              {type}
            </option>
          ))}
        </select>
        <label>Product Price</label>
        <input
          type="number"
          onChange={updateProduct}
          value={product.product_price || ""}
          name="product_price"
        />
        <select
          name="fabric"
          id="fabrics"
          className={styles.dropdown}
          defaultValue={"DEFAULT"}
          onChange={updateProduct}
          name="fabric"
          value={product.fabric || ""}
        >
          <option value="DEFAULT" disabled>
            Select a fabric
          </option>
          {fabricsArray.map((fabric, index) => (
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
          onChange={updateProduct}
          name="category"
          value={product.category || ""}
        >
          <option value="DEFAULT" disabled>
            Select a Category
          </option>
          {!isLoading &&
            categories.map((category) => (
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
              onChange={updateProduct}
              name="sizeXS"
              value={product.sizeXS || ""}
            />
          </div>
          <div className={styles.sizeItem}>
            <label>S</label>
            <input
              type="number"
              className={styles.sizeField}
              onChange={updateProduct}
              name="sizeS"
              value={product.sizeS || ""}
            />
          </div>
          <div className={styles.sizeItem}>
            <label>M</label>
            <input
              type="number"
              className={styles.sizeField}
              onChange={updateProduct}
              name="sizeM"
              value={product.sizeM || ""}
            />
          </div>
        </div>
        <div className={styles.productSizeContainer}>
          <div className={styles.sizeItem}>
            <label>L</label>
            <input
              type="number"
              className={styles.sizeField}
              onChange={updateProduct}
              name="sizeL"
              value={product.sizeL || ""}
            />
          </div>
          <div className={styles.sizeItem}>
            <label>XL</label>
            <input
              type="number"
              className={styles.sizeField}
              onChange={updateProduct}
              name="sizeXL"
              value={product.sizeXL || ""}
            />
          </div>
          <div className={styles.sizeItem}>
            <label>XXL</label>
            <input
              type="number"
              className={styles.sizeField}
              onChange={updateProduct}
              name="sizeXXL"
              value={product.sizeXXL || ""}
            />
          </div>
        </div>
        {isValidationError && (
          <h1 className={styles.validationError}>
            *Product cod and product price field must be filled
          </h1>
        )}
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
          ) : (
            <div>Add Product</div>
          )}
        </button>
      </div>
    </>
  );
};

export default ProductAdd;
