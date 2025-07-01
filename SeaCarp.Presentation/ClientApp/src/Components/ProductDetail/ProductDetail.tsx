import type { Product } from '../../models/Product'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import { useEffect, useState } from 'react'
import { ApiConfig } from '../../utils/ApiConfig'
import { useParams } from 'react-router-dom'
import { Button, Container, Form, InputGroup } from 'react-bootstrap'
import './ProductDetail.scss'
// import { useParams } from 'react-router-dom'

const ProductDetail = ({...productDetail}: Product) => {

  const [product, setProduct] = useState<Product | null>(productDetail || null);
  
  const {id} = useParams();

  useEffect(() => {
    if (!productDetail?.id) {
      const fetchProduct = async (): Promise<void> => {
            try {
              console.log("fetch")
                const response = await fetch(`${ApiConfig.PRODUCTS}/${id}`);
                if (!response.ok) {
                    throw new Error("Could not get product")
                }

                const result: Product = await response.json();
                setProduct(result);
            }

            catch (err) {
                console.error("could not connect", err)
            }
        }
        fetchProduct();
    }

  }, [productDetail?.id, id]);



  return (
    <>    
    {product && product.id && (
      <Row as={"article"} className="product-detail">
        <Col md={4}>
        <img src={`${ApiConfig.BASE_IMAGE_URL}/products/${product.productName}.png`} alt={product.productName} />
        </Col>
  
        <Col>
          <h1>{product.productName}</h1>
  
          <p>{product.category}</p>
  
          <p><strong>Description:</strong> {product.description}</p>
  
          <p className='--bs-primary'><strong>Stock:</strong> {product.stock} in stock</p>
  
          <p className="price"><strong>${product.price}</strong></p>
          
          <Col sm={3}>
          <InputGroup size={"lg"}>
            <InputGroup.Text>Quantity</InputGroup.Text>
          <Form.Control value={1}
          />
          </InputGroup>
          </Col>

          <Button as={"a"} href={`/Login/${product.id}?returnurl=/products/${product.id}`}>Please log in to add to cart</Button>

        </Col>
          </Row>
    )}
  </>
  )
}

export default ProductDetail
