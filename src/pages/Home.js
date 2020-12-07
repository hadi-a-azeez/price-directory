import React from 'react';
import styles from './home.module.scss';
import { useHistory } from "react-router-dom";

const Home = () => {
    const history = useHistory();

    const handleUserClick=()=>{
        history.push('/products');
    }
    const handleAdminClick=()=>{
        history.push('/admin/products_admin');
    }
    return ( <>
        <div className={styles.header}>
                <h1 className={styles.label}>Abony Clothing</h1>
        </div>
        <div className={styles.container}>
            <button className={styles.card} onClick={handleUserClick}>
                <h1 className={styles.cardHeading}>User</h1>
            </button>
            <button className={styles.card} onClick={handleAdminClick}>
                <h1 className={styles.cardHeading}>Admin</h1>
            </button>
            
        </div>
    </> );
}
 
export default Home;