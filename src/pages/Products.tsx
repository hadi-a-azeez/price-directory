import React from 'react';
import styles from "./products.module.scss"

const Products: React.FC = () => {

    return (<>
        <div className={styles.header}>
            <input type="text" placeholder="Search cod here" className={styles.search}></input>
        </div>
        <div className={styles.container}>
            <div className={styles.card}>
                <img src='https://media.thieve.co/products%2Fp34mJdDonjjGQeITPtKo.jpg?fm=jpg&dpr=1&q=70&w=354&h=354'
                    alt="product" className={styles.thumbnailImage} />
                <div className={styles.details}>
                    <h1 className={styles.cod}>Dapputta</h1>
                    <h1 className={styles.price}>2999</h1>
                    <h1 className={styles.stock}>In Stock</h1>
                </div>
            </div>
            <div className={styles.card}>
                <img src='https://media.thieve.co/products%2Fp34mJdDonjjGQeITPtKo.jpg?fm=jpg&dpr=1&q=70&w=354&h=354'
                    alt="product" className={styles.thumbnailImage} />
                <div className={styles.details}>
                    <h1 className={styles.cod}>Dapputta</h1>
                    <h1 className={styles.price}>2999</h1>
                    <h1 className={styles.stock}>In Stock</h1>
                </div>
            </div>
            <div className={styles.card}>
                <img src='https://media.thieve.co/products%2Fp34mJdDonjjGQeITPtKo.jpg?fm=jpg&dpr=1&q=70&w=354&h=354'
                    alt="product" className={styles.thumbnailImage} />
                <div className={styles.details}>
                    <h1 className={styles.cod}>Dapputta</h1>
                    <h1 className={styles.price}>2999</h1>
                    <h1 className={styles.stock}>In Stock</h1>
                </div>
            </div>
        </div>
    </>);
}

export default Products;