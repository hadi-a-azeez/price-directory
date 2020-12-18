import React, { useState, useEffect } from "react";
import firebase from "../firebase";

const Script = () => {
  const [data, setData] = useState([]);
  useEffect(() => {
    data.length > 0 && console.log(data);
  });

  const db = firebase.firestore();

  const getData = async () => {
    const dataFetched = await db.collection("products").get();
    await setData(
      dataFetched.docs.map((product) => {
        return { ...product.data(), id: product.id };
      })
    );
    console.log(data);
  };
  const updateData = async () => {
    for (let i = 0; i < data.length; i++) {
      await db
        .collection("products")
        .doc(data[i].id)
        .update({ product_image: [data[i].product_image] });
      console.log();
    }
  };

  return (
    <>
      <h1 onClick={getData}>GET DATA</h1>
      <br />
      <br />
      <br />
      <br />
      <br />
      <h1 onClick={updateData} style={{ color: "red" }}>
        UPDATE DATA
      </h1>
    </>
  );
};

export default Script;
