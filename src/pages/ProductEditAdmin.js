import { useState, useEffect } from "react";
import { useFormLocal } from "../components/useFormLocal";
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
  const [product, setProduct, updateProduct] = useFormLocal({});
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

  const updateProductServer = async () => {
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
                  <div
                    style={{ height: 300, backgroundColor: `white` }}
                    key={index}
                  >
                    <img
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
                name="product_cod"
                onChange={updateProduct}
              />
            </FormControl>
            <FormControl id="product_price" w="90%" mt="2" isRequired>
              <FormLabel>Product Price</FormLabel>
              <Input
                type="number"
                size="lg"
                name="product_price"
                value={product.product_price}
                onChange={updateProduct}
              />
            </FormControl>
            <FormControl id="product_length" w="90%" mt="2" isRequired>
              <FormLabel>Product Length</FormLabel>
              <Input
                type="number"
                size="lg"
                name="product_length"
                value={product.product_length}
                onChange={updateProduct}
              />
            </FormControl>

            <FormControl id="product_sizes" w="90%" mt="2" isRequired>
              <FormLabel>Product Sizes</FormLabel>

              <Stack direction="row">
                <FormControl id="product_sizes" w="90%">
                  <FormLabel>XS</FormLabel>
                  <Input
                    type="number"
                    onChange={updateProduct}
                    name="sizeXS"
                    size="lg"
                    w="70%"
                    value={product.sizeXS || ""}
                  />
                </FormControl>
                <FormControl id="product_sizes" w="90%" mt="2">
                  <FormLabel>S</FormLabel>
                  <Input
                    type="number"
                    onChange={updateProduct}
                    name="sizeS"
                    size="lg"
                    w="70%"
                    value={product.sizeS || ""}
                  />
                </FormControl>
                <FormControl id="product_sizes" w="90%" mt="2">
                  <FormLabel>M</FormLabel>
                  <Input
                    type="number"
                    onChange={updateProduct}
                    name="sizeM"
                    size="lg"
                    w="70%"
                    value={product.sizeM || ""}
                  />
                </FormControl>
              </Stack>

              <Stack direction="row">
                <FormControl id="product_sizes" w="90%">
                  <FormLabel>L</FormLabel>
                  <Input
                    type="number"
                    onChange={updateProduct}
                    name="sizeL"
                    size="lg"
                    w="70%"
                    value={product.sizeL || ""}
                  />
                </FormControl>
                <FormControl id="product_sizes" w="90%" mt="2">
                  <FormLabel>XL</FormLabel>
                  <Input
                    type="number"
                    onChange={updateProduct}
                    name="sizeXL"
                    size="lg"
                    w="70%"
                    value={product.sizeXL || ""}
                  />
                </FormControl>
                <FormControl id="product_sizes" w="90%" mt="2">
                  <FormLabel>XXL</FormLabel>
                  <Input
                    type="number"
                    onChange={updateProduct}
                    name="sizeXXL"
                    size="lg"
                    w="70%"
                    value={product.sizeXXL || ""}
                  />
                </FormControl>
              </Stack>
            </FormControl>
            <button onClick={updateProductServer} className={styles.btnPrimary}>
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
