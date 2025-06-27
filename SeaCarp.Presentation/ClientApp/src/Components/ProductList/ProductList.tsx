import { useEffect, useState } from "react"
import { Col, Row } from "react-bootstrap";
import "./ProductList.scss"
import type { Product } from "../../models/Product.ts";
import ProductCard from "../ProductCard/ProductCard.tsx";
import { ApiConfig } from "../../utils/ApiConfig.ts";


function ProductList() {
const [products, setProducts] = useState<Product[]>([]);
    useEffect(() => {
        const fetchProducts = async (): Promise<void> => {
            try {
                const response = await fetch(`${ApiConfig.OVERVIEW}`);
                if (!response.ok) {
                    throw new Error("Could not get products")
                }

                const productResult: Product[] = await response.json();
                setProducts(productResult);
            }

            catch (err) {
                console.error("could not connect", err)
            }
        }
        fetchProducts();
    }, [])
  return (
    <Row as={"section"} className="product-list gx-5 gy-5">
        {products.map( (p) => (

            
            <Col as={"article"} lg={6} key={p.id} >
            <ProductCard {...p} />
        </Col>

        ))}
    </Row>
  )
}

export default ProductList
