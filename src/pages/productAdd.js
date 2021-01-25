import { useState, useEffect, useRef } from "react";
import imageCompression from "browser-image-compression";
import styles from "./productadd.module.scss";
import Placeholder from "../assets/placeholder.png";

import { v4 as uuidv4 } from "uuid";
import Loader from "react-loader-spinner";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import { useHistory } from "react-router-dom";
import backIcon from "../assets/backIcon.png";
import { getcategoriesAPI } from "../API/category";
import { useFormLocal } from "../components/useFormLocal";
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableCaption,
} from "@chakra-ui/react";
import {
  Box,
  InputGroup,
  InputRightElement,
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
import { addProductAPI, uploadImagesAPI } from "../API/product";

const ProductAdd = () => {
  const [product_image, setProductImage] = useState([]);
  const [codeType, setCodeType] = useState("PNR");
  const [productCod, setProductCod] = useState("");
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

  useEffect(() => {
    const fetchCategories = async () => {
      setIsLoading(true);

      const categories = await getcategoriesAPI();
      setCategories(categories.data);
      setIsLoading(false);
      setProduct({ type: "Top" });
    };
    fetchCategories();
  }, []);

  const addProduct = async () => {
    setIsOpen(false);
    setIsLoading(true);
    const productResponse = await addProductAPI({
      ...product,
      code: codeType + productCod,
    });
    let imageNames = await uploadImagesAPI(
      product_image,
      productResponse.data.id
    );
    setIsLoading(false);
    history.push("/products");
  };
  const deleteImageFromArr = (image) => {
    setProductImage((previmage) =>
      previmage.filter(
        (imageInState) => imageInState.imageName !== image.imageName
      )
    );
  };

  const validateFields = (addCallback) => {
    if (!productCod || !product.price) {
      setIsOpen(false);
      setIsValidationError(true);
    } else {
      setIsValidationError(false);
      setIsOpen(false);
      setIsValidationError(false);
      addCallback();
    }
  };
  const SizeProduct = ({ name, title }) => {
    return (
      <Tr>
        <Td>{title}</Td>
        <Td>
          <Button
            size="xs"
            colorScheme="red"
            onClick={() => setProduct({ [name]: --product[name] || 0 })}
            mr="5"
          >
            -
          </Button>
          {product[name] || 0}
          <Button
            ml="5"
            colorScheme="teal"
            onClick={() => setProduct({ [name]: ++product[name] || 1 })}
          >
            +
          </Button>
        </Td>
      </Tr>
    );
  };

  const compressImage = async (event) => {
    //compresses image to below 1MB
    let imagesFromInput = event.target.files;
    const options = {
      maxSizeMB: 3,
      maxWidthOrHeight: 1280,
      useWebWorker: true,
    };
    try {
      for (let i = 0; i < imagesFromInput.length; i++) {
        const compressedFile = await imageCompression(
          imagesFromInput[i],
          options
        );
        let imageName = uuidv4();
        compressedFile.lastModifiedDate = new Date();
        const convertedBlobFile = new File(
          [compressedFile],
          imagesFromInput[i].name,
          {
            type: imagesFromInput[i].type,
            lastModified: Date.now(),
          }
        );
        setProductImage((oldArray) => [
          ...oldArray,
          { image: convertedBlobFile, imageName },
        ]);
      }

      // setProductImageConverted(URL.createObjectURL(compressedFile));
    } catch (error) {
      console.log(error);
    }
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
                src={URL.createObjectURL(image.image)}
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
          <Stack direction="row">
            <Select
              w="40%"
              size="lg"
              onChange={(e) => setCodeType(e.target.value)}
              value={codeType || ""}
            >
              <option value="PNR">PNR</option>
              <option value="AB">AB</option>
            </Select>
            <Input
              type="number"
              onChange={(e) => {
                setProductCod(e.target.value);
              }}
              name="product_cod"
              size="lg"
              value={productCod}
            />
          </Stack>
        </FormControl>
        <FormControl id="product_cod" w="90%" mt="2" isRequired>
          <FormLabel>Product Type</FormLabel>
          <Select
            name="type"
            id="type"
            w="100%"
            size="lg"
            mt="4"
            onChange={updateProduct}
            value={product.type || ""}
          >
            {typeArray.map((type, index) => (
              <option value={type} key={index}>
                {type}
              </option>
            ))}
          </Select>
        </FormControl>
        <FormControl id="product_price" w="90%" mt="2" isRequired>
          <FormLabel>Product Price</FormLabel>
          <Input
            type="number"
            onChange={(e) => setProduct({ price: +e.target.value })}
            value={product.price || ""}
            name="price"
            size="lg"
          />
        </FormControl>
        <FormControl id="product_length" w="90%" mt="2" isRequired>
          <FormLabel>Product Length</FormLabel>
          <Input
            type="number"
            onChange={(e) => setProduct({ length: +e.target.value })}
            value={product.length || ""}
            name="length"
            size="lg"
          />
        </FormControl>
        <FormControl w="90%" mt="2" isRequired>
          <FormLabel>Fabrics</FormLabel>
          <Select
            name="fabric"
            id="fabrics"
            w="100%"
            size="lg"
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
        </FormControl>
        <FormControl w="90%" mt="2" isRequired>
          <FormLabel>Categories</FormLabel>
          <Select
            name="categoryId"
            w="100%"
            size="lg"
            mt="4"
            onChange={(e) => setProduct({ categoryId: +e.target.value })}
            value={product.categoryId || "DEFAULT"}
          >
            <option value="DEFAULT" disabled>
              Select a Category
            </option>
            {!isLoading &&
              categories.map((category) => (
                <option value={category.id} key={category.id}>
                  {category.name}
                </option>
              ))}
          </Select>
        </FormControl>
        <FormControl id="product_sizes" w="90%" mt="2" isRequired>
          <FormLabel>Product Sizes</FormLabel>
          <Box
            rounded="md"
            bg="white"
            boxShadow="xs"
            key={product.id}
            d="flex"
            direction="row"
            justifyContent="center"
            w="95%"
            flexShrink="0"
            mt="3"
          >
            <Table colorScheme="blue" variant="striped">
              <Thead>
                <Tr>
                  <Th>Size</Th>
                  <Th>Stock</Th>
                </Tr>
              </Thead>
              <Tbody>
                <SizeProduct name="sizeXS" title="XS" />
                <SizeProduct name="sizeS" title="S" />
                <SizeProduct name="sizeM" title="M" />
                <SizeProduct name="sizeL" title="L" />
                <SizeProduct name="sizeXL" title="XL" />
                <SizeProduct name="sizeXXL" title="XXL" />
              </Tbody>
            </Table>
          </Box>
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
