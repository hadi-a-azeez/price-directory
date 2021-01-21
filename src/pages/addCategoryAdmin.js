import { useState } from "react";
import Loader from "react-loader-spinner";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import { useHistory } from "react-router-dom";
import backIcon from "../assets/backIcon.png";
import styles from "./productadd.module.scss";
import { addcategoriesAPI } from "../API/category";
import {
  Input,
  InputGroup,
  InputRightElement,
  IconButton,
  Box,
  Select,
  FormControl,
  FormLabel,
} from "@chakra-ui/react";

const AddCategory = () => {
  const [category, setCategory] = useState("");
  const [parentCategory, setParentCategory] = useState("Top");
  const history = useHistory();
  const [isLoading, setIsLoading] = useState(false);

  const handleAddCategory = async () => {
    setIsLoading(true);
    const responseCategory = await addcategoriesAPI({
      name: category,
      type: parentCategory,
    });
    console.log(responseCategory);
    setIsLoading(false);
    history.push("/admin/categories");
  };

  const handleParentCategoryClick = (val) => {
    setParentCategory(val);
  };

  const handleBackClick = () => {
    history.goBack();
  };
  return (
    <>
      <div className={styles.header}>
        <button className={styles.backButton} onClick={handleBackClick}>
          <img src={backIcon} className={styles.backIcon} alt="back_icon" />
        </button>
        <h1 className={styles.label}>Add Category</h1>
      </div>
      <div className={styles.container}>
        <FormControl w="90%" mt="2" isRequired>
          <FormLabel>Parent Category</FormLabel>
          <Select
            name="parent_categories"
            id="parent_categories"
            w="100%"
            size="lg"
            onChange={(e) => handleParentCategoryClick(e.target.value)}
          >
            <option value="Top">Top</option>
            <option value="Pant">Pant</option>
          </Select>
        </FormControl>
        <FormControl w="90%" mt="2" isRequired>
          <FormLabel>Category Name</FormLabel>
          <Input
            type="text"
            size="lg"
            onChange={(e) => setCategory(e.target.value)}
          />
        </FormControl>
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
            <div>Add Category</div>
          )}
        </button>
      </div>
    </>
  );
};

export default AddCategory;
