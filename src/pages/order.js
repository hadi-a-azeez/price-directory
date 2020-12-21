import styles from "./products.module.scss";
import { useHistory } from "react-router-dom";
import { Link } from "react-router-dom";

const Order = () => {
  const history = useHistory();

  const OrderCard = () => {
    return (
      <Link to="" className={styles.link}>
        <div className={styles.card}>
          {
            <img
              src=""
              alt="product_image`"
              className={styles.thumbnailImage}
            />
          }
          <div className={styles.details}>
            <h1 className={styles.cod}>PNR6788</h1>
            <h1 className={styles.cod}>Customer Name</h1>
            <h1 className={styles.price}>₹299</h1>
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
      <div className={styles.container}>
        <button
          className={styles.btnFloat}
          onClick={() => history.push("/add_order")}
        >
          +
        </button>
        <OrderCard />
      </div>
    </>
  );
};

export default Order;
