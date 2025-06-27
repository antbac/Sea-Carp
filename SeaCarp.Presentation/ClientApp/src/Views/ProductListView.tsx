import { useEffect, useState } from "react"
import { Form } from "react-bootstrap"
import { ApiConfig } from "../utils/ApiConfig";
import type { Product } from "../models/Product";
import ProductCard from "../Components/ProductCard/ProductCard";

function ProductListView() {

  const [priceFilter, setPriceFilter] = useState<string>("");
  const [categoryFilter, setCategoryFilter] = useState<string>("");
  const [products, setProducts] = useState<Product[] | null>(null);

  useEffect(() => {

    const fetchProducts = async (): Promise<void> => {
      try {
        const response = await fetch(`${ApiConfig.PRODUCTS}?category=${categoryFilter}&pricerange=${priceFilter}`);
        
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

    
  }, [priceFilter, categoryFilter]);

  return (
    <>
        <h1>All Products</h1>

        {/* Filter */}

        <div className="filter">
          <Form.Select onChange={(e) => setCategoryFilter(e.target.value)}>
            <option>Choose a category</option>
          </Form.Select>


          <Form.Select onChange={(e) => setPriceFilter(e.target.value)}>
            <option>Choose a price range</option>
            <option value="budget">Under $50</option>
            <option value="mid">$50 - $100</option>
            <option value="premium">$100+</option>
          </Form.Select>

          {products?.map(product => (
            <ProductCard {...product} />
          ))}

        </div>



    </>
  )
}

export default ProductListView
