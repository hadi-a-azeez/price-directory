import { useEffect, useState } from "react";
import styles from "./products.module.scss";
import { useHistory } from "react-router-dom";
import { Link } from "react-router-dom";
import Loader from "react-loader-spinner";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import {
  Input,
  InputGroup,
  InputRightElement,
  IconButton,
  Box,
} from "@chakra-ui/react";
import { SearchIcon, ArrowBackIcon } from "@chakra-ui/icons";
import Placeholder from "../assets/placeholder.png";
import { ChakraProvider, Flex, Image, Text, Container } from "@chakra-ui/react";
import { getOrderAPI, searchOrderAPI } from "../API/order";
import { apiRoot } from "../config";

const Order = () => {
  const history = useHistory();
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [searchValue, setSearchValue] = useState("");

  useEffect(() => {
    const fetchOrders = async () => {
      setIsLoading(true);
      const orderResponse = await getOrderAPI();
      console.log(orderResponse);
      setOrders(orderResponse.data);

      setIsLoading(false);
    };
    fetchOrders();
  }, []);
  useEffect(() => {
    if (searchValue == "") {
      setFilteredOrders([]);
    } else {
      doSearch();
    }
  }, [searchValue]);

  const doSearch = async () => {
    const searchResponse = await searchOrderAPI(searchValue);
    setFilteredOrders(searchResponse.data);
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
          {order.orderproducts.length > 0 && (
            <Image
              height="120px"
              width="140px"
              borderRadius="10px"
              src={`${apiRoot}/order-images/${order.orderproducts[0].image}.jpeg`}
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
              {order.name}
            </Text>
            <Text fontSize="md">{order.product_cod}</Text>
            <Text fontWeight="bold" fontSize="xl" color="green.500">
              ₹{order.orderproducts.reduce((acc, curr) => acc + curr.price, 0)}
            </Text>

            <Text fontWeight="bold" fontSize="2xl" color="red.500">
              {order.id}
            </Text>
          </Flex>
        </Flex>
      </Link>
    );
  };

  return (
    <>
      <div className={styles.header}>
        <IconButton
          borderRadius="full"
          colorScheme="blue"
          ml="4"
          mt="2"
          alignSelf="flex-start"
          icon={<ArrowBackIcon color="white" />}
          onClick={() => history.push("/")}
        />
        <InputGroup
          w="90%"
          mb="3"
          mt="2"
          size="lg"
          backgroundColor="white"
          borderRadius="6px"
        >
          <InputRightElement
            children={
              <IconButton
                backgroundColor="white"
                borderRadius="30px"
                onClick={doSearch}
                icon={<SearchIcon />}
              />
            }
          />
          <Input
            type="text"
            placeholder="search in this store"
            borderRadius="6px"
            borderColor="white"
            onChange={(e) => setSearchValue(e.target.value)}
          />
        </InputGroup>
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
              <OrderCard order={order} key={order.id} />
            ))}
          </Container>
        ) : (
          <Container p={0}>
            {filteredOrders.map((order) => (
              <OrderCard order={order} key={order.id} />
            ))}
          </Container>
        )}
      </div>
    </>
  );
};

export default Order;
