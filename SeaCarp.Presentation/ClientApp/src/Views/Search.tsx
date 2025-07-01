import { useEffect, useState } from 'react';
import { Col } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import { ApiConfig } from '../utils/ApiConfig';
import type { Product } from '../models/Product';
import ProductCard from '../Components/ProductCard/ProductCard';

function Search() {
  
  const {query} = useParams();
  const [products, setProducts] = useState<Product[]>([]);
  
  useEffect(() => {
        const fetchProduct = async (): Promise<void> => {
              try {
                console.log("fetch")
                  const response = await fetch(`${ApiConfig.SEARCH}?query=${query}`);
                  if (!response.ok) {
                      throw new Error("Could not get product")
                  }
  
                  const result: Product[] = await response.json();
                  setProducts(result);
              }
  
              catch (err) {
                  console.error("could not connect", err)
              }
          }
          fetchProduct();
  }, [query]);

  
  return (


<Col>
  {products.map( (product) => (

              
              <Col as={"article"} sm={6} md={4} key={product.id} >
              <ProductCard {...product} />
          </Col>

          ))}
</Col>
  )
}

export default Search
