import { useEffect, useState } from "react";
import styles from "./products.module.scss";
import { Link } from "react-router-dom";
import Loader from "react-loader-spinner";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import { useHistory } from "react-router-dom";
import TabHeader from "../components/tabHeader";
import { getProductAPI, searchProductAPI } from "../API/product";
import { apiRoot } from "../config";
import {
  Input,
  InputGroup,
  InputRightElement,
  IconButton,
  Box,
} from "@chakra-ui/react";
import { SearchIcon, ArrowBackIcon } from "@chakra-ui/icons";
import Placeholder from "../assets/placeholder.png";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [filteredProducts, setFilteredProducts] = useState([]);

  const [searchValue, setSearchValue] = useState("");
  const history = useHistory();

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      const productsResponse = await getProductAPI();
      setProducts(productsResponse);

      setIsLoading(false);
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (searchValue == "") {
      setFilteredProducts([]);
    } else {
      doSearch();
    }
  }, [searchValue]);
  const doSearch = async () => {
    const searchResponse = await searchProductAPI(searchValue);
    setFilteredProducts(searchResponse);
  };

  const StockStatus = (data) => {
    const { sizeXS, sizeS, sizeM, sizeL, sizeXL, sizeXXL } = data.data;
    const totalStock = [sizeXS, sizeS, sizeM, sizeL, sizeXL, sizeXXL];
    if (totalStock.some((s) => s > 0)) {
      return <h1 className={styles.InStock}>In Stock</h1>;
    } else return <h1 className={styles.OutOfStock}>Out Of Stock </h1>;
  };

  const ProductCard = ({ product }) => {
    return (
      <Link
        to={`/product_detailed/${product.id}`}
        key={product.id}
        className={styles.link}
      >
        <Box
          rounded="md"
          bg="white"
          boxShadow="xs"
          key={product.id}
          d="flex"
          direction="row"
          justifyContent="center"
          w="95%"
          flexShrink="0"
          mt="3"
          height="115px"
        >
          {product.productimages.length > 0 ? (
            <img
              src={`${apiRoot}/product-images/min/${product.productimages[0].name}`}
              alt="product_image`"
              className={styles.thumbnailImage}
            />
          ) : (
            <img src={Placeholder} className={styles.thumbnailImage} />
          )}
          <div className={styles.details}>
            <h1 className={styles.cod}>{product.code}</h1>
            <h1 className={styles.price}>{`₹${product.price}`}</h1>
            <StockStatus data={product} />
          </div>
        </Box>{" "}
      </Link>
    );
  };

  return (
    <>
      <div className={styles.header}>
        <IconButton
          borderRadius="full"
          colorScheme="blue"
          ml="4"
          mt="2"
          alignSelf="flex-start"
          icon={<ArrowBackIcon color="white" />}
          onClick={() => history.push("/")}
        />
        {/* <input
          type="number"
          placeholder="Search cod here"
          className={styles.search}
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
        />
        <button className={styles.btnHome} onClick={doSearch}>
          Search
        </button> */}

        <TabHeader selected="products" />
        <InputGroup
          w="90%"
          mb="3"
          mt="2"
          size="lg"
          backgroundColor="white"
          borderRadius="6px"
        >
          <InputRightElement
            children={
              <IconButton
                backgroundColor="white"
                borderRadius="30px"
                onClick={doSearch}
                icon={<SearchIcon />}
              />
            }
          />
          <Input
            type="number"
            placeholder="search in this store"
            borderRadius="6px"
            borderColor="white"
            onChange={(e) => setSearchValue(e.target.value)}
          />
        </InputGroup>
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
        {searchValue.length < 1 ? (
          <>
            {products.map((product) => (
              <ProductCard product={product} key={product.id} />
            ))}
          </>
        ) : (
          <>
            {filteredProducts.map((product) => (
              <ProductCard product={product} key={product.id} />
            ))}
          </>
        )}
      </div>
      <div style={{ marginTop: `20px` }} />
      <button
        onClick={() => history.push("/admin/product_add")}
        className={styles.btnFloat}
      >
        +
      </button>
    </>
  );
};

export default Products;
