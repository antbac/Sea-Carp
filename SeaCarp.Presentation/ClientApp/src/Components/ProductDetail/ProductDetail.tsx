import type { Product } from '../../models/Product'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import { useEffect, useState } from 'react'
import { ApiConfig } from '../../utils/ApiConfig'
import { useParams } from 'react-router-dom'
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
        <Col>
        <img src={`${ApiConfig.BASE_IMAGE_URL}/products/${product.productName}.png`} alt={product.productName} />
        </Col>
  
        <Col>
  
  
          <h1>{product.productName}</h1>
  
          <p>{product.category}</p>
  
          <p>Description: {product.description}</p>
  
          <p><strong>Stock:</strong></p>{product.stock}
  
          ...
  
        </Col>
  
      </Row>
    )}
  </>
  )
}

export default ProductDetail
