import React, { useEffect, useState } from "react";
import styles from "./productDetailed.module.scss";
import editIcon from "../assets/edit.png";
import backIcon from "../assets/backIcon.png";
import Loader from "react-loader-spinner";
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from "react-responsive-carousel";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import { useHistory } from "react-router-dom";
import { resellerCopy, instagramCopy } from "../components/CopyItems";
import Whatsapp from "../assets/whatsapp.png";
import Instagram from "../assets/instagram.png";
import TableSize from "../components/TableSize";
import { downloadProductImageAPI, getSingleProduct } from "../API/product";
import { apiRoot } from "../config";
import { saveAs } from "file-saver";
import { DownloadIcon } from "@chakra-ui/icons";
import {
  Tag,
  Text,
  Heading,
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableCaption,
  Button,
  Badge,
} from "@chakra-ui/react";

const ProductDetailed = (props) => {
  const [isLoading, setIsLoading] = useState(false);
  const [product, setProduct] = useState([]);
  const [pantVisible, setPantVisible] = useState("none");
  const [topVisible, setTopVisible] = useState("none");
  const history = useHistory();
  const productId = props.match.params.id;
  const [currentImage, setCurrentImage] = useState(0);
  const [copySuccess, setCopySuccess] = useState("");
  const [copySuccessInsta, setcopySuccessInsta] = useState("");
  let pantSizesArr = [
    { name: "XS", length: 26 },
    { name: "S", length: 28 },
    { name: "M", length: 30 },
    { name: "L", length: 32 },
    { name: "XL", length: 34 },
    { name: "XXL", length: 36 },
  ];
  let topSizesArr = [
    { name: "XS", length: 36 },
    { name: "S", length: 38 },
    { name: "M", length: 40 },
    { name: "L", length: 42 },
    { name: "XL", length: 44 },
    { name: "XXL", length: 46 },
  ];
  //function for copying text to clipboard
  function copyText(textToCopy) {
    let textArea;

    function isOS() {
      return navigator.userAgent.match(/ipad|iphone/i);
    }

    function createTextArea(text) {
      textArea = document.createElement("textArea");
      textArea.readOnly = true;
      textArea.contentEditable = true;
      textArea.value = text;
      document.body.appendChild(textArea);
    }

    function selectText() {
      var range, selection;

      if (isOS()) {
        range = document.createRange();
        range.selectNodeContents(textArea);
        selection = window.getSelection();
        selection.removeAllRanges();
        selection.addRange(range);
        textArea.setSelectionRange(0, 999999);
      } else {
        textArea.select();
      }
    }

    function copyTo() {
      document.execCommand("copy");
      document.body.removeChild(textArea);
    }

    createTextArea(textToCopy);
    selectText();
    copyTo();
  }

  useEffect(() => {
    setIsLoading(true);
    const fetchData = async () => {
      setIsLoading(true);
      const product = await getSingleProduct(productId);
      setProduct(product);
      setIsLoading(false);
    };
    fetchData();
  }, []);

  //download all images
  const downloadAll = async () => {
    const image = `${apiRoot}/product-images/${product.productimages[currentImage].name}`;
    var link = document.createElement("a");
    link.href = image;
    link.download = "Download.jpg";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleBackClick = () => {
    history.goBack();
  };

  const handlePantToggle = () => {
    if (pantVisible === "none") {
      setPantVisible("block");
    } else {
      setPantVisible("none");
    }
  };

  const handleTopToggle = () => {
    if (topVisible === "none") {
      setTopVisible("block");
    } else {
      setTopVisible("none");
    }
  };
  const { sizeXS, sizeS, sizeM, sizeL, sizeXL, sizeXXL } = product;
  let availableSizesArr = [
    { name: "XS", stock: sizeXS },
    { name: "S", stock: sizeS },
    { name: "M", stock: sizeM },
    { name: "L", stock: sizeL },
    { name: "XL", stock: sizeXL },
    { name: "XXL", stock: sizeXXL },
  ];
  //filter array to size avaialable >0
  let availableSizesFiltered = availableSizesArr.filter(
    (size) => size.stock > 0
  );

  let arr = [
    { XS: sizeXS },
    { S: sizeS },
    { M: sizeM },
    { L: sizeL },
    { XL: sizeXL },
    { XXL: sizeXXL },
  ];
  let sizeArr = availableSizesFiltered.map((size) => size.name);
  return (
    <>
      <div className={styles.header}>
        <button className={styles.backButton} onClick={handleBackClick}>
          <img src={backIcon} className={styles.backIcon} alt="back_icon" />
        </button>

        <h1 className={styles.label}>Product</h1>
        <button
          className={styles.editButton}
          onClick={() =>
            history.push(`/admin/product_edit_admin/${product.id}`)
          }
        >
          <img src={editIcon} className={styles.editIcon} alt="back_icon" />
        </button>
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
      {!isLoading && (
        <>
          <div className={styles.container}>
            <Carousel
              infiniteLoop
              dynamicHeight
              showThumbs={false}
              onChange={(i) => setCurrentImage(i)}
              showStatus={false}
              className={styles.carousel}
            >
              {product.productimages &&
                product.productimages.map((imageNew) => (
                  <div style={{ height: `500px`, backgroundColor: `white` }}>
                    <img
                      src={`${apiRoot}/product-images/min/${imageNew.name}`}
                      className={styles.image}
                      alt="image_preview"
                    />
                  </div>
                ))}
            </Carousel>
            <div className={styles.details}>
              <Button
                leftIcon={<DownloadIcon />}
                colorScheme="blue"
                mt="3"
                onClick={() => downloadAll()}
              >
                Download Image
              </Button>
              <Tag colorScheme="green" mt="8" size="lg">
                {product.type}
              </Tag>
              <Heading mb={1}>{product.code}</Heading>

              <Heading color="red.500" fontSize="3xl">
                {" "}
                {`₹${product.price}`}
              </Heading>
              <Text fontSize="2xl">
                Reseller :
                {` ₹${parseInt(product.price - (product.price / 100) * 10)}`}
              </Text>
              <Text fontSize="2xl" mb="5">
                Fabric: {product.fabric}
              </Text>
              <button
                className={styles.btnWtsp}
                onClick={() => {
                  copyText(resellerCopy(product, sizeArr));
                  setCopySuccess("copied!");
                }}
              >
                <img
                  src={Whatsapp}
                  alt="whatsapp"
                  width="20px"
                  height="20px"
                  style={{ marginRight: `3px` }}
                />
                Copy For Resellers
              </button>
              {/* show copied text status */}
              <p>{copySuccess}</p>
              <button
                className={styles.btnInstagram}
                onClick={() => {
                  copyText(instagramCopy(product));
                  setcopySuccessInsta("copied!");
                }}
              >
                <img
                  src={Instagram}
                  width="20px"
                  alt="instagram"
                  height="20px"
                  style={{ marginRight: `3px` }}
                />
                Copy For Instagram
              </button>
              {/* show copied text status */}
              <p>{copySuccessInsta}</p>
              <div>
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
                >
                  <Table variant="striped" colorScheme="teal">
                    <Thead>
                      <Tr>
                        <Th>Size</Th>
                        <Th>Stock</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {availableSizesFiltered &&
                        availableSizesFiltered.map((size, index) => (
                          <Tr key={index}>
                            <Td>{size.name}</Td>
                            <Td>{size.stock}</Td>
                          </Tr>
                        ))}
                    </Tbody>
                  </Table>
                </Box>
              </div>
              <h1 className={styles.fabric}>Size Chart </h1>
              <button className={styles.pantOrTop} onClick={handlePantToggle}>
                Pant
              </button>
              <TableSize
                display={pantVisible}
                column1="Size"
                column2="Length"
                list={pantSizesArr}
              />
              <button className={styles.pantOrTop} onClick={handleTopToggle}>
                Top
              </button>
              <TableSize
                display={topVisible}
                column1="Size"
                column2="Length"
                list={topSizesArr}
              />
            </div>
          </div>
          <div style={{ marginTop: `20px` }} />
        </>
      )}
    </>
  );
};

export default ProductDetailed;
