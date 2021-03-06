import { React, useRef, useState, useEffect } from "react";
import styles from "./addOrder.module.scss";
import imageCompression from "browser-image-compression";
import { v4 as uuidv4 } from "uuid";
import { useHistory } from "react-router-dom";
import backIcon from "../assets/backIcon.png";
import { useFormLocal } from "../components/useFormLocal";
import DatePicker from "react-date-picker";

import "react-datepicker/dist/react-datepicker.css";
import { CloseIcon } from "@chakra-ui/icons";

import {
  Box,
  InputGroup,
  InputLeftAddon,
  Input,
  FormControl,
  FormLabel,
  Textarea,
  Stack,
  Radio,
  RadioGroup,
  Button,
  IconButton,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
} from "@chakra-ui/react";
import { addOrderAPI, uploadOrderImageAPI } from "../API/order";

const AddOrder = () => {
  const [paymentMethod, setPaymentMethod] = useState("GPAY");
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [order, setOrder, updateOrder] = useFormLocal([]);
  const [orderProducts, setOrderProducts] = useState([
    { code: "", image: uuidv4(), convertedimage: "", price: 0, size: "" },
  ]);
  const [isValidationError, setIsValidationError] = useState(false);
  const [imageConverted, setImageConverted] = useState([]);
  const cancelRef = useRef();
  const history = useHistory();

  useEffect(() => {
    setOrder({ date: new Date() });
  }, []);

  //change or edit products array in state
  const handleOrderProduct = (name, value, id) => {
    let index = orderProducts.findIndex((product) => product.image == id);
    let newArray = [...orderProducts];
    newArray[index] = {
      ...newArray[index],
      [name]: value,
    };
    setOrderProducts(newArray);
  };

  const deleteOrderProduct = (id) => {
    let newArr = orderProducts.filter((product) => product.image != id);
    let newImageArr = imageConverted.filter((image) => image.name != id);
    setImageConverted(newImageArr);
    setOrderProducts(newArr);
  };

  //add product to products state
  const addOrderProduct = () => {
    const id = uuidv4();
    const newProducts = {
      code: "",
      convertedimage: "",
      image: id,
      price: 0,
      size: "",
    };
    setOrderProducts((old) => [...old, newProducts]);
    console.log(orderProducts);
  };

  //add order to server
  const addOrder = async () => {
    setIsOpen(false);
    setIsLoading(true);

    console.log({
      ...order,
      payment_method: paymentMethod,
      products: orderProducts,
    });
    const response = await addOrderAPI({
      ...order,
      payment_method: paymentMethod,
      products: orderProducts,
    });
    await imageToServer();

    setIsLoading(false);
    history.push("/orders");
  };
  const imageToServer = async () => {
    let imagesArr = orderProducts.map((product) => product.convertedimage);
    console.log(imagesArr);
    await uploadOrderImageAPI(imagesArr);
  };
  const validateFields = async (addCallback) => {
    const isproducts = orderProducts.filter(
      (product) => !product.code || !product.price || !product.size
    );
    if (!order.name || !order.address || isproducts.length > 0) {
      setIsOpen(false);
      setIsValidationError(true);
    } else {
      setIsValidationError(false);
      setIsOpen(false);
      setIsValidationError(false);
      addCallback();
    }
  };
  const compressImage = async (event, productId) => {
    //compresses image to below 1MB
    const options = {
      maxSizeMB: 0.6,
      maxWidthOrHeight: 1280,
      useWebWorker: true,
    };
    try {
      const compressedFile = await imageCompression(
        event.target.files[0],
        options
      );
      compressedFile.lastModifiedDate = new Date();
      const convertedBlobFile = new File([compressedFile], productId, {
        type: compressedFile.type,
        lastModified: Date.now(),
      });
      handleOrderProduct("convertedimage", convertedBlobFile, productId);

      // setImageConverted((old) => [
      //   ...old,
      //   { name: productId, image: convertedBlobFile },
      // ]);
    } catch (error) {
      console.log(error);
    }
  };

  //product image component
  const ProductImage = ({ productId }) => {
    let imageObject = imageConverted.filter((image) => image.name == productId);
    if (imageObject.length > 0) {
      return (
        <img
          src={URL.createObjectURL(imageObject[0].image)}
          width="200px"
          alt="image_preview"
        />
      );
    } else return <p>Uplaod Image</p>;
  };

  return (
    <>
      <div className={styles.header}>
        <button className={styles.backButton} onClick={() => history.goBack()}>
          <img src={backIcon} className={styles.backIcon} alt="back_icon" />
        </button>
        <h1 className={styles.label}>Add Order</h1>
      </div>
      <div className={styles.container}>
        <FormControl w="90%" mt="2" isRequired>
          <FormLabel>Order Date :</FormLabel>
          <DatePicker
            format="dd/MM/yyyy"
            value={order.date}
            onChange={(date) => {
              setOrder({ date: date });
            }}
          />
        </FormControl>

        <FormControl w="90%" mt="2" isRequired>
          <FormLabel>Customer Name :</FormLabel>
          <Input type="text" size="lg" name="name" onChange={updateOrder} />
        </FormControl>
        <FormControl id="customer_address" w="90%" mt="2" isRequired>
          <FormLabel>Address :</FormLabel>
          <Textarea
            type="text"
            size="lg"
            rows="4"
            name="address"
            onChange={updateOrder}
          />
        </FormControl>

        {/* products start */}
        {/* productt.image is used as id */}
        {orderProducts.length > 0 &&
          orderProducts.map((product) => (
            <div
              style={{ display: "flex", justifyContent: "center" }}
              key={product.image}
            >
              <Box
                rounded="md"
                bg="white"
                boxShadow="xs"
                w="95%"
                mt="3"
                d="flex"
                alignItems="center"
                flexDirection="column"
                position="relative"
              >
                <IconButton
                  icon={<CloseIcon />}
                  position="absolute"
                  top="2"
                  right="2"
                  borderRadius="full"
                  onClick={() => deleteOrderProduct(product.image)}
                />
                {product.convertedimage && (
                  <img
                    src={URL.createObjectURL(product.convertedimage)}
                    width="100"
                  />
                )}
                <input
                  type="file"
                  accept="image/*"
                  id="file-upload"
                  name="order-image"
                  onChange={(event) => compressImage(event, product.image)}
                />
                <FormControl id="product_cod" w="95%" mt="2" isRequired>
                  <InputGroup>
                    <InputLeftAddon children="Code" />
                    <Input
                      type="text"
                      name="code"
                      value={product.code}
                      onChange={(e) =>
                        handleOrderProduct(
                          e.target.name,
                          e.target.value,
                          product.image
                        )
                      }
                    />
                  </InputGroup>
                </FormControl>
                <Stack direction="row" w="95%" mt="2" mb="2">
                  <FormControl id="product_price" w="50%" isRequired>
                    <InputGroup>
                      <InputLeftAddon children="Price" />
                      <Input
                        type="number"
                        name="price"
                        value={product.price}
                        onChange={(e) =>
                          handleOrderProduct(
                            e.target.name,
                            parseInt(e.target.value),
                            product.image
                          )
                        }
                      />
                    </InputGroup>
                  </FormControl>
                  <FormControl id="product_size" w="50%" isRequired>
                    <InputGroup>
                      <InputLeftAddon children="Size/Color" />
                      <Input
                        type="text"
                        name="size"
                        value={product.size}
                        onChange={(e) =>
                          handleOrderProduct(
                            e.target.name,
                            e.target.value,
                            product.image
                          )
                        }
                      />
                    </InputGroup>
                  </FormControl>
                </Stack>
              </Box>
            </div>
          ))}
        <Button
          onClick={addOrderProduct}
          mt="3"
          alignSelf="flex-start"
          ml="3"
          colorScheme="blue"
        >
          Add Prduct
        </Button>
        {/* products end */}

        <FormControl id="payment_method" w="90%" mt="2" isRequired>
          <FormLabel>Payment Method :</FormLabel>
          <RadioGroup
            onChange={setPaymentMethod}
            value={paymentMethod}
            name="payment_method"
          >
            <Stack direction="row">
              <Radio value="GPAY">Gpay PhonePe</Radio>
              <Radio value="ACCOUNT">Account Transfer</Radio>
              <Radio value="COD">COD</Radio>
            </Stack>
          </RadioGroup>
        </FormControl>

        <FormControl w="90%" mt="2">
          <FormLabel>Order Note</FormLabel>
          <Input
            type="text"
            size="lg"
            name="order_note"
            onChange={updateOrder}
          />
        </FormControl>
        {isValidationError && (
          <Alert status="error" mt={2}>
            <AlertIcon />
            <AlertTitle mr={2}>Please Fill All Fields!</AlertTitle>
          </Alert>
        )}
        <Button
          colorScheme="teal"
          variant="solid"
          size="xs"
          w="90%"
          padding="6"
          mt="6"
          mb="6"
          isLoading={isLoading}
          loadingText="Uploading"
          onClick={() => setIsOpen(true)}
        >
          Add order
        </Button>
        <AlertDialog
          isOpen={isOpen}
          leastDestructiveRef={cancelRef}
          onClose={() => setIsOpen(false)}
        >
          <AlertDialogOverlay>
            <AlertDialogContent w="90%" pos="center">
              <AlertDialogHeader fontSize="lg" fontWeight="bold">
                Add Order
              </AlertDialogHeader>

              <AlertDialogBody>
                Are you sure you want to add this order ?
              </AlertDialogBody>

              <AlertDialogFooter>
                <Button ref={cancelRef} onClick={() => setIsOpen(false)}>
                  Cancel
                </Button>
                <Button
                  colorScheme="green"
                  ml={3}
                  onClick={() => validateFields(addOrder)}
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

export default AddOrder;
