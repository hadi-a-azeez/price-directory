import styles from './tabHeader.module.scss';
import {useHistory} from 'react-router-dom';

const TabHeader = ({selected}) => {
    const history = useHistory();
    return ( <>
        <div className={styles.container}>
            <button className={selected === "products" ? styles.btnSelected : styles.btn}
            /* onClick={history.push('/admin/products_admin')} */>Products</button>
            <button className={selected === "categories" ? styles.btnSelected : styles.btn}
            /* onClick={history.push('/admin/categories')} */>Categoreis</button>
        </div>
    </> );
}
 
export default TabHeader;