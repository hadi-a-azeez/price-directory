import { useState,useEffect } from "react";
import { useHistory } from "react-router-dom";
import {Link} from 'react-router-dom';
import firebase from "../firebase";
import styles from "./products.module.scss";
import Loader from "react-loader-spinner";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import TabHeader from '../components/tabHeader';

const CategoriesAdmin = () => {
    const [isLoading,setIsLoading] = useState();
    const [categories, setCategories] = useState([]);
    const history = useHistory();

    useEffect(() => {
        const fetchCategories = async () => {
            setIsLoading(true);
            const db = firebase.firestore();
            const data = await db.collection("categories").get();
            setCategories(
              data.docs.map((category) => {
                return { ...category.data(), id: category.id };
              })
            );
            setIsLoading(false);
        }
        fetchCategories();
    }, []);

    const handleAddCategory = () =>{
        history.push('/admin/add_category');
    }

    return ( <>
        <div className={styles.header}>
            <button className={styles.btnHome} onClick={()=> history.push('/')}>Home</button>
            <input
            type="text"
            placeholder="Search cod here"
            className={styles.search}
            /* onChange={(e) => doSearch(e)} */
            ></input>
            <TabHeader selected="categories" />
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
        {!isLoading &&
        categories.map((category)=>(
            <Link to={`/admin/category_products/${category.category}`} 
                key={category.id} 
                className={styles.link}>
                <div className={styles.card}>
                    <h1 style={{fontSize: `22px`,padding: `13px`}}>{category.category}</h1>
                </div>
            </Link>
        ))}
        <button onClick={handleAddCategory} className={styles.btnFloat}>+</button>
        </div>
    </> );
}
 
export default CategoriesAdmin;