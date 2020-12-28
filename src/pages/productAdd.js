import { useState, useEffect, useRef } from "react";
import imageCompression from "browser-image-compression";
import styles from "./productadd.module.scss";
import Placeholder from "../assets/placeholder.png";
import firebase from "../firebase";
import { v4 as uuidv4 } from "uuid";
import Loader from "react-loader-spinner";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import { useHistory } from "react-router-dom";
import backIcon from "../assets/backIcon.png";
import { useFormLocal } from "../components/useFormLocal";
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

const ProductAdd = () => {
  const [product_image, setProductImage] = useState([]);
  const [product, setProduct, updateProduct] = useFormLocal({});
  const [isValidationError, setIsValidationError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const history = useHistory();
  const cancelRef = useRef();
  const fabricsArray = [
    "Cotton",
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
      setProduct({ type: "Top" });
    };
    fetchCategories();
  }, []);

  // const validateSubmit = (runSubmit) => {
  //   if (product.product_cod != "" || product.product_price != 0) {
  //     runSubmit();
  //   } else setIsValidationError(true);
  // };
  const addProduct = async () => {
    console.log("prodcut added");
    setIsOpen(false);
    setIsLoading(true);
    let imageName = await imageToServer(product_image);
    db.collection("products").add({
      date: Date.now(),
      ...product,
      product_image: imageName,
    });
    setIsLoading(false);
    history.push("/admin/products");
  };
  const deleteImageFromArr = (image) => {
    setProductImage((previmage) =>
      previmage.filter((imageInState) => imageInState.name !== image.name)
    );
  };

  const validateFields = (addCallback) => {
    if (!product.product_cod || !product.product_price) {
      setIsOpen(false);
      setIsValidationError(true);
    } else {
      setIsValidationError(false);
      setIsOpen(false);
      setIsValidationError(false);
      addCallback();
    }
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
        <SimpleGrid columns={3} spacing={2} mt="6" mb="6" w="90%">
          {product_image.length > 0 ? (
            product_image.map((image, index) => (
              <Image
                key={index}
                style={{ background: "#212121" }}
                src={URL.createObjectURL(image)}
                boxSize="100px"
                objectFit="cover"
                alt="image_preview"
                onClick={() => deleteImageFromArr(image)}
              />
            ))
          ) : (
            <Image src={Placeholder} boxSize="100px" alt="image_preview" />
          )}
          <label htmlFor="file-upload" className={styles.customFileUpload}>
            +
          </label>
        </SimpleGrid>
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
            size="lg"
            value={product.product_cod || ""}
          />
        </FormControl>
        <Select
          name="type"
          id="type"
          w="90%"
          size="lg"
          mt="4"
          onChange={updateProduct}
          name="type"
          value={product.type || ""}
        >
          {typeArray.map((type, index) => (
            <option value={type} key={index}>
              {type}
            </option>
          ))}
        </Select>
        <FormControl id="product_price" w="90%" mt="2" isRequired>
          <FormLabel>Product Price</FormLabel>
          <Input
            type="number"
            onChange={updateProduct}
            value={product.product_price || ""}
            name="product_price"
            size="lg"
          />
        </FormControl>
        <FormControl id="product_length" w="90%" mt="2" isRequired>
          <FormLabel>Product Length</FormLabel>
          <Input
            type="number"
            onChange={updateProduct}
            value={product.product_length || ""}
            name="product_length"
            size="lg"
          />
        </FormControl>
        <Select
          name="fabric"
          id="fabrics"
          w="90%"
          size="lg"
          mt="4"
          onChange={updateProduct}
          name="fabric"
          value={product.fabric || "DEFAULT"}
        >
          <option value="DEFAULT" disabled>
            Select a fabric
          </option>
          {fabricsArray.map((fabric, index) => (
            <option value={fabric} key={index}>
              {fabric}
            </option>
          ))}
        </Select>
        <Select
          name="categories"
          id="categories"
          w="90%"
          size="lg"
          mt="4"
          onChange={updateProduct}
          name="category"
          value={product.category || "DEFAULT"}
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
        </Select>
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
        {isValidationError && (
          <h1 className={styles.validationError}>
            *Product cod and product price field must be filled
          </h1>
        )}
        <Button
          onClick={() => setIsOpen(true)}
          colorScheme="teal"
          variant="solid"
          size="xs"
          w="90%"
          padding="6"
          mt="6"
          mb="6"
          isLoading={isLoading}
          loadingText="Uploading"
        >
          Add Product
        </Button>
        <AlertDialog
          isOpen={isOpen}
          leastDestructiveRef={cancelRef}
          onClose={() => setIsOpen(false)}
        >
          <AlertDialogOverlay>
            <AlertDialogContent w="90%" pos="center">
              <AlertDialogHeader fontSize="lg" fontWeight="bold">
                Add Product
              </AlertDialogHeader>

              <AlertDialogBody>
                Are you sure you want to add this Product ?
              </AlertDialogBody>

              <AlertDialogFooter>
                <Button ref={cancelRef} onClick={() => setIsOpen(false)}>
                  Cancel
                </Button>
                <Button
                  colorScheme="green"
                  ml={3}
                  onClick={() => validateFields(addProduct)}
                >
                  Add
                </Button>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialogOverlay>
        </AlertDialog>
      </div>
    </>
  );
};

export default ProductAdd;
