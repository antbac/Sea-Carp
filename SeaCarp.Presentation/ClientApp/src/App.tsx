import Login from "./Components/Identity/Login";
import ProductDetail from "./Components/ProductDetail/ProductDetail";
import ProductList from "./Components/ProductList/ProductList";
import Register from "./Components/Identity/Register";
import type { Product } from "./models/Product";
import Header from "./Views/Header";
import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
  return (
    <>
      <BrowserRouter>
        <Header />
        <Routes>
          <Route index element={<ProductList />} />
          <Route
            path="/products/:id"
            element={<ProductDetail {...({} as Product)} />}
          />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </BrowserRouter>

      {/* <ProductList /> */}
    </>
  );
}

export default App;
