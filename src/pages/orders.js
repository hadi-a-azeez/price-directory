import { useEffect, useState } from "react";
import styles from "./products.module.scss";
import { useHistory } from "react-router-dom";
import { Link } from "react-router-dom";
import firebase from "../firebase";
import Loader from "react-loader-spinner";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";

const Order = () => {
  const history = useHistory();
  const db = firebase.firestore();
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

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

  const OrderCard = ({ order }) => {
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
          type="text"
          placeholder="Search cod here"
          className={styles.search}
        ></input>
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
        <button
          className={styles.btnFloat}
          onClick={() => history.push("/add_order")}
        >
          +
        </button>
        {orders.map((order) => (
          <OrderCard order={order} key={order.date} />
        ))}
      </div>
    </>
  );
};

export default Order;
