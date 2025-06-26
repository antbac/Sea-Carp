import { useEffect, useState } from "react"
import { Col, Row } from "react-bootstrap";
import "./ProductList.scss"
import type { Product } from "../../models/Product.ts";
import ProductCard from "../ProductCard/ProductCard.tsx";


function ProductList() {
const [products, setProducts] = useState<Product[]>([]);
    useEffect(() => {
        // const fetchProducts = async (): Promise<void> => {
        //     try {
        //         const response = await fetch('/api/products/get');

        //         if (!response.ok) {
        //             throw new Error("Could not get products")
        //         }

        //         const productResult: Product[] = await response.json();
        //         setProducts(productResult);
        //     }

        //     catch (err) {
        //         console.error("could not connect", err)
        //     }
        // }
        // fetchProducts();

        const p : Product[] = [
            {
                id: 1,
                Name: "test",
                Description: "test2",
                Stock: 2,
                Price: 2,
                Category: "x",
                Reviews: [],
                RelatedProducts: []
            },
            {
                id: 2,
                Name: "test",
                Description: "test2",
                Stock: 2,
                Price: 2,
                Category: "x",
                Reviews: [],
                RelatedProducts: []
            },
            {
                id: 3,
                Name: "test",
                Description: "test2",
                Stock: 2,
                Price: 2,
                Category: "x",
                Reviews: [],
                RelatedProducts: []
            },
            {
                id: 4,
                Name: "test",
                Description: "test2",
                Stock: 2,
                Price: 2,
                Category: "x",
                Reviews: [],
                RelatedProducts: []
            }
        ]
        setProducts(p);
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
