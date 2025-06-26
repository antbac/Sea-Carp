import type { Product } from '../../models/Product'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

const ProductDetail = ({...productDetail}: Product) => {

  const [product, setProduct] = useState<Product>(productDetail);
  
  const {id} = useParams<Product>();

  useEffect(() => {
    // if (!product) {
    //   const fetchProduct = async (): Promise<void> => {
    //         try {
    //             const response = await fetch('/api/product/1');

    //             if (!response.ok) {
    //                 throw new Error("Could not get product")
    //             }

    //             const result: Product = await response.json();
    //             setProduct(result);
    //         }

    //         catch (err) {
    //             console.error("could not connect", err)
    //         }
    //     }
    //     fetchProduct();
    // }

    const p : Product = {
      id: 1,
      Name: "test",
      Description: "test2",
      Stock: 2,
      Price: 2,
      Category: "x",
      Reviews: [],
      RelatedProducts: []
    }

    setProduct(p);

  })



  return (
    <Row as={"article"} className="product-detail">
      <Col>
      <img src={`/files/images/products/${product.Name}.png`} alt={product.Name} />
      </Col>

      <Col>
      test
      </Col>

    </Row>

    // <Row>
    //   <Col>
      
    //   <h2>{product.Name}</h2>

    //   <p>{product.Category}</p>

     

    //   <p>{product.Price}</p>

    //   Quantity: <input type="number" />

    //   <h3>Product Details</h3>
    //   <p>{product.Description}</p>

    //   {/* <Review> */}
    //   </Col>


    // </Row>




  )
}

export default ProductDetail
