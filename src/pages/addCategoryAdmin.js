import {useState} from 'react';
import firebase from "../firebase";
import Loader from "react-loader-spinner";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import { useHistory } from "react-router-dom";
import backIcon from "../assets/backIcon.png";
import styles from "./productadd.module.scss";

const AddCategory = () => {
    const [category,setCategory] = useState("");
    const history = useHistory();
    const [isLoading, setIsLoading] = useState(false);

    const handleAddCategory = async()=>{
        setIsLoading(true);
        console.log(category);
        const db = firebase.firestore();
        await db.collection("categories").add({
            category
        });
        setIsLoading(false);
        history.push('/admin/categories');
    }

    const handleBackClick = ()=>{
        history.goBack();
    }
    return ( 
            <>
                <div className={styles.header}>
                    <button className={styles.backButton} onClick={handleBackClick}>
                    <img src={backIcon} className={styles.backIcon} alt="back_icon" />
                    </button>
                    <h1 className={styles.label}>Add Category</h1>
                </div>
                <div className={styles.container}>
                    <label>Category Name:</label>
                    <input type="text" onChange={(e)=>setCategory(e.target.value)} />   
                    <button onClick={handleAddCategory} className={styles.btnPrimary}>
                    {isLoading ? (
                        <div className={styles.loader}>
                        <Loader
                            type="Oval"
                            color="white"
                            height={18}
                            width={18}
                            visible={isLoading}
                        />
                        </div>
                    ) : (
                        <div>Add Product</div>
                    )}
                    </button> 
                </div>
            </>
            );
    }
 
export default AddCategory;