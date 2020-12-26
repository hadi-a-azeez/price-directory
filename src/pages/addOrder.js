import { React, useRef, useState } from "react";
import styles from "./addOrder.module.scss";
import imageCompression from "browser-image-compression";
import { v4 as uuidv4 } from "uuid";
import { useHistory } from "react-router-dom";
import backIcon from "../assets/backIcon.png";
import { useFormLocal } from "../components/useFormLocal";
import firebase from "../firebase";
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

const AddOrder = () => {
  const [paymentMethod, setPaymentMethod] = useState("3");
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [order, setOrder, updateOrder] = useFormLocal([]);
  const [imageConverted, setImageConverted] = useState();
  const cancelRef = useRef();
  const history = useHistory();
  const db = firebase.firestore();

  const addOrder = async () => {
    setIsOpen(false);
    setIsLoading(true);

    let imageName = await imageToServer(imageConverted);
    db.collection("orders").add({
      date: Date.now(),
      payment_method: paymentMethod,
      order_status: "1",
      product_image: imageName,
      ...order,
    });
    setIsLoading(false);
    history.push("/orders");
  };
  const compressImage = async (event) => {
    //compresses image to below 1MB
    const options = {
      maxSizeMB: 1,
      maxWidthOrHeight: 1280,
      useWebWorker: true,
    };
    try {
      const compressedFile = await imageCompression(
        event.target.files[0],
        options
      );
      setImageConverted(compressedFile);
      // setProductImageConverted(URL.createObjectURL(compressedFile));
    } catch (error) {
      console.log(error);
    }
  };
  const imageToServer = async (image) => {
    //upload image to firebase storage
    let storageRef = firebase.storage().ref();
    let imagesRef = storageRef.child("images");
    let imageName = uuidv4();
    let spaceRef = imagesRef.child(imageName);
    let resp = await spaceRef.put(image);
    return imageName;
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
          <FormLabel>Customer Name :</FormLabel>
          <Input
            type="text"
            size="lg"
            name="customer_name"
            onChange={updateOrder}
          />
        </FormControl>
        <FormControl id="customer_address" w="90%" mt="2" isRequired>
          <FormLabel>Address :</FormLabel>
          <Textarea
            type="text"
            size="lg"
            rows="4"
            name="customer_address"
            onChange={updateOrder}
          />
        </FormControl>
        <img
          src={imageConverted && URL.createObjectURL(imageConverted)}
          width="200px"
          alt="image_preview"
        />
        <input
          type="file"
          accept="image/*"
          id="file-upload"
          onChange={(event) => compressImage(event)}
        />
        <FormControl id="product_cod" w="90%" mt="2" isRequired>
          <FormLabel>Product Code:</FormLabel>
          <Input
            type="text"
            size="lg"
            name="product_cod"
            onChange={updateOrder}
          />
        </FormControl>
        <FormControl id="product_price" w="90%" mt="2" isRequired>
          <FormLabel>Product Price :</FormLabel>
          <Input
            type="number"
            size="lg"
            name="product_price"
            onChange={updateOrder}
          />
        </FormControl>
        <FormControl id="product_size" w="90%" mt="2" isRequired>
          <FormLabel>Product Size :</FormLabel>
          <Input
            type="text"
            size="lg"
            name="product_size"
            onChange={updateOrder}
          />
        </FormControl>
        <FormControl id="payment_method" w="90%" mt="2" isRequired>
          <FormLabel>Payment Method :</FormLabel>
          <RadioGroup
            onChange={setPaymentMethod}
            value={paymentMethod}
            name="payement_method"
          >
            <Stack direction="row">
              <Radio value="1">Gpay PhonePe</Radio>
              <Radio value="2">Account Transfer</Radio>
              <Radio value="3">COD</Radio>
            </Stack>
          </RadioGroup>
        </FormControl>
        {paymentMethod !== "3" && (
          <FormControl id="trasfer_details" w="90%" mt="2" isRequired>
            <FormLabel>Transfer Details :</FormLabel>
            <Textarea
              type="text"
              size="lg"
              rows="2"
              name="transfer_details"
              onChange={updateOrder}
            />
          </FormControl>
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
                <Button colorScheme="green" ml={3} onClick={addOrder}>
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
