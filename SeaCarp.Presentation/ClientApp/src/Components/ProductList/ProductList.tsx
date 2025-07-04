import { useEffect, useState } from "react";
import { Col, Row } from "react-bootstrap";
import "./ProductList.scss";
import type { Product } from "../../models/Product.ts";
import ProductCard from "../ProductCard/ProductCard.tsx";
import { ApiConfig } from "../../utils/ApiConfig.ts";
import IntroBlock from "../IntroBlock/IntroBlock.tsx";

function ProductList() {
  const [products, setProducts] = useState<Product[]>([]);
  useEffect(() => {
    const fetchProducts = async (): Promise<void> => {
      try {
        const response = await fetch(`${ApiConfig.OVERVIEW}`);
        if (!response.ok) {
          throw new Error("Could not get products");
        }

        const productResult: Product[] = await response.json();
        setProducts(productResult);
      } catch (err) {
        console.error("could not connect", err);
      }
    };
    fetchProducts();
  }, []);
  return (
    <>
      <IntroBlock />

      <Row as={"section"} className="product-list gx-5 gy-5">
        {products.map((product) => (
          <Col as={"article"} sm={6} md={4} key={product.id}>
            <ProductCard {...product} />
          </Col>
        ))}
      </Row>
    </>
  );
}

export default ProductList;
