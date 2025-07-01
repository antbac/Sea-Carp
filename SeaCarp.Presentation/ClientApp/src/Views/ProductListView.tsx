import { useEffect, useState } from "react"
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { Form } from "react-bootstrap"
import { ApiConfig } from "../utils/ApiConfig";
import type { Product } from "../models/Product";
import ProductCard from "../Components/ProductCard/ProductCard";

function ProductListView() {

  const [priceFilter, setPriceFilter] = useState<string>("");
  // const [categoryFilter, setCategoryFilter] = useState<string>("");
  const [products, setProducts] = useState<Product[] | null>(null);

  useEffect(() => {

    const fetchProducts = async (): Promise<void> => {
      try {
        const response = await fetch(`${ApiConfig.PRODUCTS}?pricerange=${priceFilter}`);
        
        if (!response.ok) {
          throw new Error("Could not get products");
        }

        const filterResult = await response.json();
        setProducts(filterResult);

      } catch (error) {
        console.error("Could not connect", error);
      }
    }
    fetchProducts();

    
  }, [priceFilter]);

  return (
    <>
          <Row>
        <h1>All Products</h1>
            {/* <Col>
              <h2>Filter Products</h2>
              <Form.Select onChange={(e) => setCategoryFilter(e.target.value)}>
            <option>Choose a category</option>
          </Form.Select>
            </Col> */}
            <Col>
            <Form.Select onChange={(e) => setPriceFilter(e.target.value)}>
            <option>Choose a price range</option>
            <option value="budget">Under $50</option>
            <option value="mid">$50 - $100</option>
            <option value="premium">$100+</option>
          </Form.Select>
            </Col>
          </Row>
        
        <Row as={"section"} className="product-list gx-5 gy-5">

          {products?.map(product => (
          <Col as={"article"} sm={6} md={4} key={product.id}>
            <ProductCard {...product} />
          </Col>
          ))}
        </Row>
    </>
  )
}

export default ProductListView
