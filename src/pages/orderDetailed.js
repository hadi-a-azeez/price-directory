import { React, useRef, useState, useEffect } from "react";
import styles from "./addOrder.module.scss";
import { useHistory } from "react-router-dom";
import backIcon from "../assets/backIcon.png";
import { useFormLocal } from "../components/useFormLocal";
import firebase from "../firebase";
import Loader from "react-loader-spinner";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import {
  Input,
  FormControl,
  FormLabel,
  Textarea,
  Stack,
  Radio,
  RadioGroup,
  Button,
  useToast,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
} from "@chakra-ui/react";

const OrderDetailed = (props) => {
  const [isUpdateOpen, setIsUpdateOpen] = useState(false); //setting state for update btn modal
  const [isDeleteOpen, setIsDeleteOpen] = useState(false); //setting state for delete btn modal
  const [isLoading, setIsLoading] = useState(false);
  const [order, setOrder, updateOrder] = useFormLocal([]);

  const [isBtnLoading, setIsBtnLoading] = useState(false);
  const [orderStatus, setOrderStatus] = useState("");
  const cancelRef = useRef();
  const history = useHistory();
  const id = props.match.params.id;
  const db = firebase.firestore();
  const ref = db.collection("orders");
  const toast = useToast();
  const updateModal = {
    header: "Update Order",
    body: "Are you sure you want to update this order ?",
    button: "Update",
    btnColor: "green",
  };
  const deleteModal = {
    header: "Delete Order",
    body: "Are you sure you want to delete this order ?",
    button: "Delete",
    btnColor: "red",
  };

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      const snapshot = await ref.doc(id).get();
      const data = await snapshot.data();
      setOrder(data);
      setOrderStatus(data.order_status);
      console.log(data);
      setIsLoading(false);
    };
    fetchData();
  }, []);

  const handleUpdateOrder = async () => {
    setIsUpdateOpen(false);
    setIsBtnLoading(true);
    const update = await ref.doc(id).set(order);
    setIsBtnLoading(false);
    toast({
      title: "Order updated.",
      description: "Order updated successfully.",
      status: "success",
      duration: 2000,
      isClosable: true,
      position: "bottom",
    });
  };

  const handlDeleteOrder = () => {
    ref.doc(id).delete();
    history.goBack();
  };

  return (
    <>
      <div className={styles.header}>
        <button className={styles.backButton} onClick={() => history.goBack()}>
          <img src={backIcon} className={styles.backIcon} alt="back_icon" />
        </button>
        <h1 className={styles.label}>Order Detailed</h1>
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
      <div className={styles.container}>
        {!isLoading && (
          <>
            {order.product_image && (
              <img
                src={`https://firebasestorage.googleapis.com/v0/b/abony-price-directory.appspot.com/o/images%2F${order.product_image}?alt=media`}
                alt="product_image`"
                width="200px"
              />
            )}
            <FormControl id="customer_name" w="90%" mt="2" isRequired>
              <FormLabel>Customer Name :</FormLabel>
              <Input
                type="text"
                size="lg"
                name="customer_name"
                value={order.customer_name}
                variant="filled"
                disabled
              />
            </FormControl>
            <FormControl id="customer_address" w="90%" mt="2" isRequired>
              <FormLabel>Address :</FormLabel>
              <Textarea
                type="text"
                size="lg"
                rows="4"
                name="customer_address"
                value={order.customer_address}
                variant="filled"
                disabled
              />
            </FormControl>
            <FormControl id="product_cod" w="90%" mt="2" isRequired>
              <FormLabel>Product Code:</FormLabel>
              <Input
                type="text"
                size="lg"
                name="product_cod"
                variant="filled"
                value={order.product_cod}
                disabled
              />
            </FormControl>
            <FormControl id="product_price" w="90%" mt="2" isRequired>
              <FormLabel>Product Price :</FormLabel>
              <Input
                type="number"
                size="lg"
                name="product_price"
                variant="filled"
                value={order.product_price}
                disabled
              />
            </FormControl>
            <FormControl id="product_size" w="90%" mt="2" isRequired>
              <FormLabel>Product Size :</FormLabel>
              <Input
                type="text"
                size="lg"
                name="product_size"
                variant="filled"
                value={order.product_size}
                disabled
              />
            </FormControl>
            <FormControl id="payment_method" w="90%" mt="2" isRequired>
              <FormLabel>Payment Method :</FormLabel>
              <RadioGroup
                disabled
                value={order.payment_method}
                name="payement_method"
              >
                <Stack direction="row">
                  <Radio value="1">Gpay PhonePe</Radio>
                  <Radio value="2">Account Transfer</Radio>
                  <Radio value="3">COD</Radio>
                </Stack>
              </RadioGroup>
            </FormControl>

            <FormControl id="trasfer_details" w="90%" mt="2" isRequired>
              <FormLabel>Transfer Details :</FormLabel>
              <Textarea
                type="text"
                size="lg"
                rows="2"
                name="transfer_details"
                variant="filled"
                value={order.transfer_details || ""}
                disabled
              />
            </FormControl>

            <FormControl id="order_status" w="90%" mt="2" isRequired>
              <FormLabel>Order Status :</FormLabel>
              <RadioGroup value={order.order_status}>
                <Stack direction="row">
                  <Radio value="1" onChange={updateOrder} name="order_status">
                    Accepted
                  </Radio>
                  <Radio value="2" onChange={updateOrder} name="order_status">
                    Dispatched
                  </Radio>
                  <Radio value="3" onChange={updateOrder} name="order_status">
                    Delivered
                  </Radio>
                </Stack>
              </RadioGroup>
            </FormControl>
            <FormControl id="tracking_id" w="90%" mt="2" isRequired>
              <FormLabel>Tracking Id :</FormLabel>
              <Input
                type="text"
                size="lg"
                name="tracking_id"
                value={order.tracking_id || ""}
                onChange={updateOrder}
              />
            </FormControl>
            <Button
              colorScheme="teal"
              variant="solid"
              size="xs"
              w="90%"
              padding="6"
              mt="6"
              isLoading={isBtnLoading}
              loadingText="Updating"
              onClick={() => setIsUpdateOpen(true)}
            >
              Update Order
            </Button>
            <Button
              colorScheme="red"
              variant="solid"
              size="xs"
              w="90%"
              padding="6"
              mt="3"
              mb="6"
              onClick={() => setIsDeleteOpen(true)}
            >
              Delete Order
            </Button>
            {/* alert dialog for update */}
            <AlertDialog
              isOpen={isUpdateOpen}
              leastDestructiveRef={cancelRef}
              onClose={() => isUpdateOpen(false)}
            >
              <AlertDialogOverlay>
                <AlertDialogContent w="90%" pos="center">
                  <AlertDialogHeader fontSize="lg" fontWeight="bold">
                    {updateModal.header}
                  </AlertDialogHeader>

                  <AlertDialogBody>{updateModal.body}</AlertDialogBody>

                  <AlertDialogFooter>
                    <Button
                      ref={cancelRef}
                      onClick={() => setIsUpdateOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      colorScheme={updateModal.btnColor}
                      ml={3}
                      onClick={handleUpdateOrder}
                    >
                      Update
                    </Button>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialogOverlay>
            </AlertDialog>
            {/* alert dialog for delete */}
            <AlertDialog
              isOpen={isDeleteOpen}
              leastDestructiveRef={cancelRef}
              onClose={() => setIsDeleteOpen(false)}
            >
              <AlertDialogOverlay>
                <AlertDialogContent w="90%" pos="center">
                  <AlertDialogHeader fontSize="lg" fontWeight="bold">
                    {deleteModal.header}
                  </AlertDialogHeader>

                  <AlertDialogBody>{deleteModal.body}</AlertDialogBody>

                  <AlertDialogFooter>
                    <Button
                      ref={cancelRef}
                      onClick={() => setIsDeleteOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      colorScheme={deleteModal.btnColor}
                      ml={3}
                      onClick={handlDeleteOrder}
                    >
                      Delete
                    </Button>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialogOverlay>
            </AlertDialog>
          </>
        )}
      </div>
    </>
  );
};

export default OrderDetailed;
