import { React, useRef, useState, useEffect } from "react";
import styles from "./addOrder.module.scss";
import { useHistory } from "react-router-dom";
import backIcon from "../assets/backIcon.png";
import { useFormLocal } from "../components/useFormLocal";
import Loader from "react-loader-spinner";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import { apiRoot } from "../config";
import {
  getSingleOrderAPI,
  updateOrderAPI,
  deleteOrderAPI,
} from "../API/order";
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
  border,
} from "@chakra-ui/react";

const OrderDetailed = (props) => {
  const [isUpdateOpen, setIsUpdateOpen] = useState(false); //setting state for update btn modal
  const [isDeleteOpen, setIsDeleteOpen] = useState(false); //setting state for delete btn modal
  const [isLoading, setIsLoading] = useState(false);
  const [order, setOrder, updateOrder] = useFormLocal([]);
  const [orderTotal, setOrderTotal] = useState(0);

  const [isBtnLoading, setIsBtnLoading] = useState(false);

  const cancelRef = useRef();
  const history = useHistory();
  const orderId = props.match.params.id;
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
      const orderResponse = await getSingleOrderAPI(orderId);
      console.log(orderResponse);
      setOrder(orderResponse.data);
      const amountFull = orderResponse.data.orderproducts.reduce(
        (acc, curr) => acc + curr.price,
        0
      );
      setOrderTotal(amountFull);
      setIsLoading(false);
    };
    fetchData();
  }, []);

  const handleUpdateOrder = async () => {
    setIsUpdateOpen(false);
    setIsBtnLoading(true);
    const updateResponse = await updateOrderAPI(
      {
        status: order.status,
        tracking_id: order.tracking_id,
        order_note: order.order_note,
      },
      orderId
    );
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

  const handlDeleteOrder = async () => {
    await deleteOrderAPI(orderId);
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
            <FormControl w="90%" mt="2">
              <FormLabel>Order Full Amount</FormLabel>
              <Input
                type="text"
                size="lg"
                name="order"
                value={`₹${orderTotal}`}
                variant="filled"
                disabled
              />
            </FormControl>
            <FormControl id="date" w="90%" mt="2">
              <FormLabel>Order Date</FormLabel>
              {order.date && (
                <Input
                  type="text"
                  size="lg"
                  name="order"
                  value={new Date(order.date).toLocaleDateString()}
                  variant="filled"
                  disabled
                />
              )}
            </FormControl>
            <FormControl id="customer_name" w="90%" mt="2" isRequired>
              <FormLabel>Order ID:</FormLabel>
              <Input
                type="text"
                size="lg"
                name="customer_name"
                value={order.id}
                variant="filled"
                disabled
              />
            </FormControl>
            <FormControl id="customer_name" w="90%" mt="2" isRequired>
              <FormLabel>Customer Name :</FormLabel>
              <Input
                type="text"
                size="lg"
                name="customer_name"
                value={order.name}
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
                value={order.address}
                variant="filled"
                disabled
              />
            </FormControl>
            <h1>Products</h1>
            {order.orderproducts &&
              order.orderproducts.map((product) => (
                <div
                  key={product.id}
                  style={{
                    width: "90%",
                    border: "1px solid grey",
                    borderRadius: "5px",
                    padding: "15px",
                    marginBottom: "8px",
                  }}
                >
                  <img
                    src={`${apiRoot}/order-images/${product.image}.jpeg`}
                    width="100"
                  />
                  <FormControl id="product_cod" w="90%" mt="2" isRequired>
                    <FormLabel>Product Code:</FormLabel>
                    <Input
                      type="text"
                      size="lg"
                      name="product_cod"
                      variant="filled"
                      value={product.code}
                      disabled
                    />
                  </FormControl>
                  <Stack direction="row">
                    <FormControl id="product_price" w="90%" mt="2" isRequired>
                      <FormLabel>Product Price :</FormLabel>
                      <Input
                        type="number"
                        size="lg"
                        name="product_price"
                        variant="filled"
                        value={product.price}
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
                        value={product.size}
                        disabled
                      />
                    </FormControl>
                  </Stack>
                </div>
              ))}
            <FormControl id="payment_method" w="90%" mt="2" isRequired>
              <FormLabel>Payment Method :</FormLabel>
              <RadioGroup
                disabled
                value={order.payment_method}
                name="payement_method"
              >
                <Stack direction="row">
                  <Radio value="GPAY">Gpay PhonePe</Radio>
                  <Radio value="ACCOUNT">Account Transfer</Radio>
                  <Radio value="COD">COD</Radio>
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
              <RadioGroup value={order.status}>
                <Stack direction="row">
                  <Radio value="PACKED" onChange={updateOrder} name="status">
                    Packed
                  </Radio>
                  <Radio
                    value="DISPATCHED"
                    onChange={updateOrder}
                    name="status"
                  >
                    Dispatched
                  </Radio>
                  <Radio value="DELIVERED" onChange={updateOrder} name="status">
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
            <FormControl id="date" w="90%" mt="2">
              <FormLabel>Order Note</FormLabel>

              <Input
                type="text"
                size="lg"
                name="order_note"
                value={order.order_note || ""}
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
