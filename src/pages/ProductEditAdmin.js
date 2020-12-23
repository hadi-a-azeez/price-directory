import { useState, useEffect } from "react";
import imageCompression from "browser-image-compression";
import styles from "./productadd.module.scss";
import firebase from "../firebase";
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from "react-responsive-carousel";
import { v4 as uuidv4 } from "uuid";
import Loader from "react-loader-spinner";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import { useHistory } from "react-router-dom";
import backIcon from "../assets/backIcon.png";
import {
  Input,
  FormControl,
  FormLabel,
  Select,
  Stack,
  Image,
  Button,
  SimpleGrid,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
} from "@chakra-ui/react";

const ProductAdmin = (props) => {
  const [product, setProduct] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isUpdateLoading, setIsUpdateLoading] = useState(false);
  const [isDeleteLoading, setIsDeleteLoading] = useState(false);
  const ref = firebase.firestore().collection("products");
  const id = props.match.params.id;
  const history = useHistory();

  useEffect(() => {
    setIsLoading(true);
    const fetchData = async () => {
      const snapshot = await ref.doc(id).get();
      const data = await snapshot.data();
      setProduct(data);
      setIsLoading(false);
    };
    fetchData();
  }, []);

  const updateProduct = async () => {
    setIsUpdateLoading(true);

    const db = firebase.firestore();
    db.collection("products")
      .doc(id)
      .set({ ...product });
    setIsUpdateLoading(false);
    history.push("/admin/products");
  };

  const deleteProduct = () => {
    setIsDeleteLoading(true);
    const db = firebase.firestore();
    db.collection("products").doc(id).delete();
    setIsDeleteLoading(false);
    history.goBack();
  };

  // const compressImage = async (event) => {
  //   //compresses image to below 1MB
  //   let imagesFromInput = event.target.files;
  //   const options = {
  //     maxSizeMB: 1,
  //     maxWidthOrHeight: 1280,
  //     useWebWorker: true,
  //   };
  //   try {
  //     for (let i = 0; i < imagesFromInput.length; i++) {
  //       const compressedFile = await imageCompression(
  //         imagesFromInput[i],
  //         options
  //       );
  //       //look here
  //       setProductImages((prevImages) => [...prevImages, compressedFile]);
  //     }

  //     // setProductImageConverted(URL.createObjectURL(compressedFile));
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  // const imageToServer = async (image) => {
  //   // Upload image to firebase storage
  //   let storageRef = firebase.storage().ref();
  //   let imagesRef = storageRef.child("images");
  //   let imageNames = product.product_image;
  //   // Points to 'images'
  //   for (let i = 0; i < image.length; i++) {
  //     let imageName = uuidv4();
  //     let spaceRef = imagesRef.child(imageName);
  //     let resp = await spaceRef.put(image[i]);
  //     imageNames.push(imageName);
  //   }
  //   return imageNames;
  // };

  const handleBackClick = () => {
    history.goBack();
  };

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
            <Carousel
              infiniteLoop
              dynamicHeight
              showThumbs={false}
              showStatus={false}
              className={styles.carousel}
            >
              {product.product_image &&
                product.product_image.map((image, index) => (
                  <div style={{ height: 300, backgroundColor: `white` }}>
                    <img
                      key={index}
                      src={`https://firebasestorage.googleapis.com/v0/b/abony-price-directory.appspot.com/o/images%2F${image}?alt=media`}
                      className={styles.image}
                      alt="image_preview"
                    />
                  </div>
                ))}
            </Carousel>
            <FormControl id="product_cod" w="90%" mt="2" isRequired>
              <FormLabel>Product cod</FormLabel>
              <Input
                type="text"
                value={product.product_cod}
                size="lg"
                onChange={(e) =>
                  setProduct({ ...product, product_cod: e.target.value })
                }
              />
            </FormControl>
            <FormControl id="product_price" w="90%" mt="2" isRequired>
              <FormLabel>Product Price</FormLabel>
              <Input
                type="number"
                size="lg"
                value={product.product_price}
                onChange={(e) =>
                  setProduct({ ...product, product_price: e.target.value })
                }
              />
            </FormControl>
            <label>Product Sizes</label>
            <div className={styles.productSizeContainer}>
              <div className={styles.sizeItem}>
                <label>XS</label>
                <input
                  type="number"
                  value={product.sizeXS}
                  className={styles.sizeField}
                  onChange={(e) =>
                    setProduct({ ...product, sizeXS: e.target.value })
                  }
                />
              </div>
              <div className={styles.sizeItem}>
                <label>S</label>
                <input
                  type="number"
                  value={product.sizeS}
                  className={styles.sizeField}
                  onChange={(e) =>
                    setProduct({
                      ...product,
                      sizeS: e.target.value,
                    })
                  }
                />
              </div>
              <div className={styles.sizeItem}>
                <label>M</label>
                <input
                  type="number"
                  value={product.sizeM}
                  className={styles.sizeField}
                  onChange={(e) =>
                    setProduct({
                      ...product,
                      sizeM: e.target.value,
                    })
                  }
                />
              </div>
            </div>
            <div className={styles.productSizeContainer}>
              <div className={styles.sizeItem}>
                <label>L</label>
                <input
                  type="number"
                  value={product.sizeL}
                  className={styles.sizeField}
                  onChange={(e) =>
                    setProduct({
                      ...product,
                      sizeL: e.target.value,
                    })
                  }
                />
              </div>
              <div className={styles.sizeItem}>
                <label>XL</label>
                <input
                  type="number"
                  value={product.sizeXL}
                  className={styles.sizeField}
                  onChange={(e) =>
                    setProduct({
                      ...product,
                      sizeXL: e.target.value,
                    })
                  }
                />
              </div>
              <div className={styles.sizeItem}>
                <label>XXL</label>
                <input
                  type="number"
                  value={product.sizeXXL}
                  className={styles.sizeField}
                  onChange={(e) =>
                    setProduct({
                      ...product,
                      sizeXXL: e.target.value,
                    })
                  }
                />
              </div>
            </div>
            <button onClick={updateProduct} className={styles.btnPrimary}>
              {isUpdateLoading ? (
                <div className={styles.loader}>
                  <Loader
                    type="Oval"
                    color="white"
                    height={18}
                    width={18}
                    visible={isUpdateLoading}
                  />
                </div>
              ) : (
                <div>Update Product</div>
              )}
            </button>
            <button onClick={deleteProduct} className={styles.btnDanger}>
              {isDeleteLoading ? (
                <div className={styles.loader}>
                  <Loader
                    type="Oval"
                    color="white"
                    height={18}
                    width={18}
                    visible={isDeleteLoading}
                  />
                </div>
              ) : (
                <div>Delete Product</div>
              )}
            </button>
          </div>
        </>
      )}
    </>
  );
};

export default ProductAdmin;
