import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import ProductDetailed from "./pages/ProductDetailed";
import Products from "./pages/Products.js";
import ProductAdd from "./pages/productAdd";

function App() {
  return (
    <>
      <Router>
        <Switch>
          <Route path="/products" component={Products} />
          <Route path="/product_add" component={ProductAdd} />
          <Route path="/product_detailed/:id" component={ProductDetailed} />
        </Switch>
      </Router>
    </>
  );
}

export default App;
