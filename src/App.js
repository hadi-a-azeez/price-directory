import {BrowserRouter as Router, Switch, Route} from "react-router-dom";
import Products from "./pages/Products.tsx";

function App() {
  return (
    <>
       <Router>
         <Switch>
           <Route path="/products" component={Products} />
         </Switch>
       </Router>
    </>
  );
}

export default App;
