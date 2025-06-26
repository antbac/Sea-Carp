
import type { Product } from '../../models/Product'
import { Button } from 'react-bootstrap'
import './ProductCard.scss'

function ProductCard({...product} : Product) {
  return (
    <div className="product-card">

            <img src={`/files/images/products/${product.Name}.png`} alt={product.Name} />

            <h2>{product.Name}</h2>

            <p>{product.Description}</p>
            
            <p>{product.Stock}</p>

            <Button as={"a"} href={`/products/${product.id}`}>View Details</Button>
    </div>
  )
}

export default ProductCard
