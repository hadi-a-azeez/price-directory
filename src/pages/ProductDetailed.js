import React from 'react';
import styles from './productDetailed.module.scss';

const ProductDetailed = () => {

    return (<>
        <div className={styles.container}>
            <img src="https://media.thieve.co/products%2Fp34mJdDonjjGQeITPtKo.jpg?fm=jpg&dpr=1&q=70&w=354&h=354" alt="" className={styles.productImage} />
            <div className={styles.details}>
                <h1 className={styles.cod}>Dapputta</h1>
                <h1 className={styles.price}>₹2999</h1>
                <h1 className={styles.stock}>Stock</h1>
                <h1 className={styles.size}>Small : 5</h1>
            </div>
        </div>
    </>);

}

export default ProductDetailed;