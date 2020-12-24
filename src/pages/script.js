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
  function reg(cod) {
    var numberPattern = /\d+/g;
    let cln = cod.match(numberPattern).join("");
    var lttr = cod.match(/[a-zA-Z]+/g).join("");
    return lttr + cln;
  }
  const updateData = async () => {
    for (let i = 0; i < data.length; i++) {
      await db
        .collection("products")
        .doc(data[i].id)
        .update({ product_cod: reg(data[i].product_cod) });
    }
    console.log("finished");
  };
  function reg(cod) {
    var numberPattern = /\d+/g;
    let cln = cod.match(numberPattern).join("");
    var lttr = cod.match(/[a-zA-Z]+/g).join("");
    return lttr + cln;
  }

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
