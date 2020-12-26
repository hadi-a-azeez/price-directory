import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import ProductDetailed from "./pages/ProductDetailed";
import Products from "./pages/Products.js";
import ProductAdd from "./pages/productAdd";
import ProductsAdmin from "./pages/ProductsAdmin";
import ProductsEditAdmin from "./pages/ProductEditAdmin";
import Home from "./pages/Home";
import CategoriesAdmin from "./pages/categoriesAdmin";
import AddCategory from "./pages/addCategoryAdmin";
import CategoryProducts from "./pages/categoryProducts";
import Order from "./pages/orders";
import AddOrder from "./pages/addOrder";
import OrderDetialed from "./pages/orderDetailed";

import script from "./pages/script";

function App() {
  return (
    <>
      <Router>
        <Switch>
          <Route exact path="/" component={Home} />
          <Route exact path="/orders" component={Order} />
          <Route exact path="/order_detailed/:id" component={OrderDetialed} />
          <Route exact path="/add_order" component={AddOrder} />
          <Route path="/products" component={Products} />

          <Route path="/product_detailed/:id" component={ProductDetailed} />
          <Route path="/admin/product_add" component={ProductAdd} />

          <Route path="/admin/products" component={ProductsAdmin} />
          <Route path="/admin/categories" component={CategoriesAdmin} />
          <Route path="/admin/add_category" component={AddCategory} />
          <Route
            path="/admin/category_products/:category"
            component={CategoryProducts}
          />
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
