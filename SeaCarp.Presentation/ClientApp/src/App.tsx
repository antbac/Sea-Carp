import Login from "./Components/Identity/Login";
import ProductDetail from "./Components/ProductDetail/ProductDetail";
import ProductList from "./Components/ProductList/ProductList";
import Register from "./Components/Identity/Register";
import type { Product } from "./models/Product";
import Header from "./Views/Header";
import ProductListView from "./Views/ProductListView";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Container } from "react-bootstrap";
import Searchview from "./Views/SearchView";
import isLoggedIn from "./utils/Helpers";

function App() {
  return (
    <>
      <BrowserRouter>
        <Header />
        {<p>IsLogged in: {isLoggedIn() ? "true" : "false"}</p>}
        <Container>
          <Routes>
            <Route index element={<ProductList />} />
            <Route
              path="/products/:id"
              element={<ProductDetail {...({} as Product)} />}
            />
            <Route path="/products" element={<ProductListView />} />
            <Route path="/login" element={<Login />} />
            <Route path="/login/:returnurl" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/search" element={<Searchview />} />
          </Routes>
        </Container>
      </BrowserRouter>

      {/* <ProductList /> */}
    </>
  );
}

export default App;
