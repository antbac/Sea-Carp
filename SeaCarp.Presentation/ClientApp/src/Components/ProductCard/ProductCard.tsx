
import type { Product } from '../../models/Product'
import { Button } from 'react-bootstrap'
import './ProductCard.scss'
import { ApiConfig } from '../../utils/ApiConfig'

function ProductCard({...product} : Product) {
  return (
    <div className="product-card">

            <img src={`${ApiConfig.BASE_IMAGE_URL}/products/${product.productName}.png`} alt={product.productName} />

            <div className="disposition">
              <h2>{product.productName}</h2>

              <p className='description'>{product.description}</p>
              
              <p>{product.stock} items in stock</p>
            <Button as={"a"} href={`/products/${product.id}`}>View Details</Button>
            </div>

    </div>
  )
}

export default ProductCard
