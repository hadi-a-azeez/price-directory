import { useEffect, useState } from "react";
import styles from "./products.module.scss";
import { useHistory } from "react-router-dom";
import { Link } from "react-router-dom";
import firebase from "../firebase";
import Loader from "react-loader-spinner";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";

import { ChakraProvider, Flex, Image, Text, Container } from "@chakra-ui/react";

const Order = () => {
  const history = useHistory();
  const db = firebase.firestore();
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [searchValue, setSearchValue] = useState("");

  useEffect(() => {
    const fetchOrders = async () => {
      setIsLoading(true);
      const data = await db.collection("orders").orderBy("date", "desc").get();
      setOrders(
        data.docs.map((order) => {
          return { ...order.data(), id: order.id };
        })
      );
      setIsLoading(false);
    };
    fetchOrders();
  }, []);
  useEffect(() => {
    if (searchValue == "") {
      setFilteredOrders([]);
    }
  }, [searchValue]);
  const doSearch = async (e) => {
    let searchData = await db
      .collection("orders")
      .where("order_no", "==", parseInt(searchValue))
      .get();
    console.log(searchData);
    searchData.forEach((products) => {
      setFilteredOrders([{ ...products.data(), id: products.id }]);
    });
    console.log(filteredOrders);
  };
  const OrderCard = ({ order }) => {
    return (
      <Link to={`/order_detailed/${order.id}`} className={styles.link}>
        <Flex
          justifyContent="flex-start"
          width="100%"
          backgroundColor="white"
          borderRadius={10}
          m={2}
          boxShadow="lg"
        >
          {order.product_image && (
            <Image
              height="120px"
              width="140px"
              borderRadius="10px"
              src={`https://firebasestorage.googleapis.com/v0/b/abony-price-directory.appspot.com/o/images%2F${order.product_image}?alt=media`}
              m={2}
              objectFit="cover"
            />
          )}
          <Flex
            flexDirection="column"
            width="70%"
            m={2}
            justifyContent="flex-start"
          >
            <Text fontWeight="bold" textAlign="left" fontSize="xl">
              {order.customer_name}
            </Text>
            <Text fontSize="md">{order.product_cod}</Text>
            <Text fontWeight="bold" fontStyle="italic" fontSize="md">
              ₹{order.product_price}
            </Text>
            <Text fontWeight="bold" fontSize="2xl" color="red.500">
              {order.order_no}
            </Text>
          </Flex>
        </Flex>
      </Link>
    );
  };
  const OrderCCard = ({ order }) => {
    return (
      <Link to={`/order_detailed/${order.id}`} className={styles.link}>
        <div className={styles.card}>
          {order.product_image && (
            <img
              src={`https://firebasestorage.googleapis.com/v0/b/abony-price-directory.appspot.com/o/images%2F${order.product_image}?alt=media`}
              alt="product_image`"
              className={styles.thumbnailImage}
            />
          )}
          <div className={styles.details}>
            <h1 className={styles.cod}>{order.product_cod}</h1>
            <h1 className={styles.cod}>{order.customer_name}</h1>
            <h1 className={styles.price}>{`₹${order.product_price}`}</h1>
          </div>
        </div>{" "}
      </Link>
    );
  };

  return (
    <>
      <div className={styles.header}>
        <button className={styles.btnHome} onClick={() => history.push("/")}>
          Home
        </button>
        <input
          type="number"
          placeholder="Search cod here"
          className={styles.search}
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
        />
        <button className={styles.btnHome} onClick={doSearch}>
          Search
        </button>
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
      ) : null}
      <div className={styles.container}>
        <button
          className={styles.btnFloat}
          onClick={() => history.push("/add_order")}
        >
          +
        </button>
        {searchValue.length < 1 ? (
          <Container p={0}>
            {orders.map((order) => (
              <OrderCard order={order} key={order.date} />
            ))}
          </Container>
        ) : (
          <Container p={0}>
            {filteredOrders.map((order) => (
              <OrderCard order={order} key={order.date} />
            ))}
          </Container>
        )}
      </div>
    </>
  );
};

export default Order;
