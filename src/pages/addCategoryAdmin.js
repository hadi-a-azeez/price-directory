import {useState} from 'react';
import firebase from "../firebase";

const AddCategory = () => {
    const [category,setCategory] = useState("");

    const handleAddCategory = ()=>{
        console.log(category);
        const db = firebase.firestore();
        db.collection("categories").add({
            category
        });
    }
    return ( <>
        <label>Category Name:</label>
        <input type="text" onChange={(e)=>setCategory(e.target.value)} />   
        <button onClick={handleAddCategory}>Add category</button> 
    </> );
}
 
export default AddCategory;