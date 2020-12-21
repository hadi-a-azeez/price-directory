import React from "react";
import styles from "./home.module.scss";
import { useHistory } from "react-router-dom";
import User from "../assets/user.png";
import Admin from "../assets/admin.png";
import Orders from "../assets/orders.png";

const Home = () => {
  const history = useHistory();

  return (
    <>
      <div className={styles.header}>
        <h1 className={styles.label}>Abony Clothing</h1>
      </div>
      <div className={styles.container}>
        <button
          className={styles.card}
          onClick={() => history.push("/products")}
        >
          <img src={User} className={styles.icon} alt="icon" />
          <h1 className={styles.cardHeading}>User</h1>
        </button>
        <button
          className={styles.card}
          onClick={() => history.push("/admin/products")}
        >
          <img src={Admin} className={styles.icon} alt="icon" />
          <h1 className={styles.cardHeading}>Admin</h1>
        </button>
        <button className={styles.card} onClick={() => history.push("/orders")}>
          <img src={Orders} className={styles.icon} alt="icon" />
          <h1 className={styles.cardHeading}>Orders</h1>
        </button>
      </div>
    </>
  );
};

export default Home;
