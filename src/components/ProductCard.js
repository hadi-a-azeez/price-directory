const ProductCard = ({ product, from }) => {
  return (
    <Link
      to={
        from === "user"
          ? `/product_detailed/${product.id}`
          : `/admin/product_edit_admin/${product.id}`
      }
      key={product.id}
      className={styles.link}
    >
      <div className={styles.card} key={product.id}>
        {
          <img
            src={`https://firebasestorage.googleapis.com/v0/b/abony-price-directory.appspot.com/o/images%2F${product.product_image[0]}?alt=media`}
            alt="product_image`"
            className={styles.thumbnailImage}
          />
        }
        <div className={styles.details}>
          <h1 className={styles.cod}>{product.product_cod}</h1>
          <h1 className={styles.price}>{`₹${product.product_price}`}</h1>
          <StockStatus data={product} />
        </div>
      </div>{" "}
    </Link>
  );
};

export default ProductCard;
