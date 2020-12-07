import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import ProductDetailed from "./pages/ProductDetailed";
import Products from "./pages/Products.js";
import ProductAdd from "./pages/productAdd";
import ProductsAdmin from "./pages/ProductsAdmin";
import ProductsEditAdmin from "./pages/ProductEditAdmin";
import Home from "./pages/Home";

function App() {
  return (
    <>
      <Router>
        <Switch>
          <Route exact path="/" component={Home} />
          <Route path="/products" component={Products} />
          <Route path="/product_detailed/:id" component={ProductDetailed} />
          <Route path="/admin/product_add" component={ProductAdd} />
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
