import styles from "../pages/productDetailed.module.scss";
//component for table in product detailed
//pass display(for hiding) columns names and list for displaying
const TableSize = ({ display, column1, column2, list }) => {
  return (
    <>
      <div style={{ display: `${display}` }}>
        <div className={styles.table}>
          <div className={styles.tableHeader}>
            <div className={styles.headerItem}>
              <h1 className={styles.headerText}>{column1}</h1>
            </div>
            <div className={styles.headerItem}>
              <h1 className={styles.headerText}>{column2}</h1>
            </div>
          </div>
          {list.map((size) => (
            <div className={styles.tableRow}>
              <div className={styles.tabelData}>
                <h1 className={styles.tableText}>{size.name}</h1>
              </div>
              <div className={styles.tabelData}>
                <h1 className={styles.tableText}>
                  {size[column2.toLowerCase()]}
                </h1>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default TableSize;
