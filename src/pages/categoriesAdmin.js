import { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { Link } from "react-router-dom";
import styles from "./products.module.scss";
import Loader from "react-loader-spinner";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import TabHeader from "../components/tabHeader";
import { getcategoriesAPI } from "../API/category";

const CategoriesAdmin = () => {
  const [isLoading, setIsLoading] = useState();
  const [categories, setCategories] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [filter, setFilter] = useState("");
  const history = useHistory();

  useEffect(() => {
    const fetchCategories = async () => {
      setIsLoading(true);
      const categoriesResponse = await getcategoriesAPI();
      setCategories(categoriesResponse.data);
      setIsLoading(false);
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    handleFilter("Top");
  }, [categories]);
  const handleFilter = (cat) => {
    setFiltered(categories.filter((category) => category.type === cat));
    console.log(cat);
    console.log("nice", filtered);
  };

  const handleAddCategory = () => {
    history.push("/admin/add_category");
  };

  return (
    <>
      <div className={styles.header}>
        <button className={styles.btnHome} onClick={() => history.push("/")}>
          Home
        </button>
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
        <select
          name="parent_categories"
          id="parent_categories"
          className={styles.dropdown}
          onChange={(e) => handleFilter(e.target.value)}
        >
          <option value="Top">Top</option>
          <option value="Pant">Pant</option>
        </select>
        {!isLoading &&
          filtered.map((category) => (
            <Link
              to={`/admin/category_products/${category.id}`}
              key={category.id}
              className={styles.link}
            >
              <div className={styles.card}>
                <h1 style={{ fontSize: `22px`, padding: `13px` }}>
                  {category.name}
                </h1>
              </div>
            </Link>
          ))}
        <button onClick={handleAddCategory} className={styles.btnFloat}>
          +
        </button>
      </div>
    </>
  );
};

export default CategoriesAdmin;
