import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import ProductDetailed from "./pages/ProductDetailed";
import Products from "./pages/Products.js";
import ProductAdd from "./pages/productAdd";
import ProductsAdmin from "./pages/ProductsAdmin";
import ProductsEditAdmin from "./pages/ProductEditAdmin";

function App() {
  return (
    <>
      <Router>
        <Switch>
          <Route path="/products" component={Products} />
          <Route path="/product_add" component={ProductAdd} />
          <Route path="/product_detailed/:id" component={ProductDetailed} />

          <Route path="/admin/products_admin" component={ProductsAdmin} />
          <Route
            path="/admin/product_edit_admin/:id"
            component={ProductsEditAdmin}
          />
        </Switch>
      </Router>
    </>
  );
}

export default App;
