import React from 'react';
import styles from './home.module.scss';
import { useHistory } from "react-router-dom";
import User from '../assets/user.png';
import Admin from '../assets/admin.png';

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
                <img src={User} className={styles.icon} />
                <h1 className={styles.cardHeading}>User</h1>
            </button>
            <button className={styles.card} onClick={handleAdminClick}>
                <img src={Admin} className={styles.icon} />
                <h1 className={styles.cardHeading}>Admin</h1>
            </button>
            
        </div>
    </> );
}
 
export default Home;