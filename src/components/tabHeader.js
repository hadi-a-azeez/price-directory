import styles from './tabHeader.module.scss';
import {useHistory} from 'react-router-dom';

const TabHeader = ({selected}) => {
    const history = useHistory();

    const handleCategoriesClick = ()=>{
        history.push('/admin/categories');
    }
    const handleProductsClick = ()=>{
        history.push('/admin/products');
    }

    return ( <>
        <div className={styles.container}>
            <button className={selected === "products" ? styles.btnSelected : styles.btn}
            onClick={handleProductsClick}>Products</button>
            <button className={selected === "categories" ? styles.btnSelected : styles.btn}
            onClick={handleCategoriesClick}>Categoreis</button>
        </div>
    </> );
}
 
export default TabHeader;