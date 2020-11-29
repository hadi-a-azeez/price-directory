import {BrowserRouter as Router, Switch, Route} from "react-router-dom";
import ProductDetailed from "./pages/ProductDetailed";
import Products from "./pages/Products.tsx";

function App() {
  return (
    <>
       <Router>
         <Switch>
           <Route path="/products" component={Products} />
           <Route path="/product_detailed" component={ProductDetailed} />
         </Switch>
       </Router>
    </>
  );
}

export default App;
