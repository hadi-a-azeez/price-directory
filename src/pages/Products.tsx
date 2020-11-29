import React from 'react';
import styles from "./products.module.scss"

const Products: React.FC = () => {
    
    return ( <> 
        <div className={styles.header}>
            <input type="text" placeholder="Search cod here" className={styles.search}></input>
        </div>
        <div className={styles.container}>
            <div className={styles.card}>
                <img src='https://image.shutterstock.com/image-photo/white-transparent-leaf-on-mirror-600w-1029171697.jpg' 
                    alt="product" className={styles.thumbnailImage}/>
                <div className={styles.details}>
                    <h1 className={styles.heading}>COD</h1>
                </div>
            </div>
        </div>
    </> );
}
 
export default Products;