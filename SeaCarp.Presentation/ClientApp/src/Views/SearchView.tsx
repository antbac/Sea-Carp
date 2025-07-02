
import { useEffect, useState } from "react";
import { Col, Row } from "react-bootstrap";
import { useLocation } from "react-router-dom";
import { ApiConfig } from "../utils/ApiConfig";
import ProductCard from "../Components/ProductCard/ProductCard";
import type { Search } from "../models/Search";
import type { Product } from "../models/Product";

function Searchview() {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const query = queryParams.get("q");

    const [searchQuery, setSearchQuery] = useState<string>(query || "");
    const [products, setProducts] = useState<Product[]>();

useEffect(() => {
    if (!query) {
        return;
    }
    const fetchProduct = async (): Promise<void> => {
    try {
        console.log("fetch");
        const response = await fetch(`${ApiConfig.SEARCH}?q=${query}`);
        if (!response.ok) {
            throw new Error("Could not get product");
        }

        const result: Search = await response.json();
        setSearchQuery(result.searchQuery)
        if (result?.matchingProducts) {
            setProducts(result.matchingProducts);
            }
    } catch (err) {
        console.error("could not connect", err);
    }
 };
 fetchProduct();
 }, [query]);

 return (
    <>
    <Row>
        <Col>
            <p>Showing matches for: "{searchQuery}"</p>
        </Col>
    </Row>
    <Row>
        {products?.length === 0 && (
            <Col>
                <p>No products found</p>
            </Col>
        )}

         {products && products?.map((product) => (
            <Col as="article" sm={6} md={4} key={product.id}>
                <ProductCard {...product} />
            </Col>
         ))}

        
    </Row>
    </>
 );
}

export default Searchview;
