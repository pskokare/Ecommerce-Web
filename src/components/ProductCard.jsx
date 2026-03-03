import { Star, Plus } from 'lucide-react'

function ProductCard({ product, onAddToCart }) {
  const renderStars = (rating) => {
    const stars = []
    const fullStars = Math.floor(rating)
    const hasHalfStar = rating % 1 !== 0
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={i} size={16} className="star filled" />)
    }
    
    if (hasHalfStar) {
      stars.push(<Star key="half" size={16} className="star half" />)
    }
    
    const emptyStars = 5 - Math.ceil(rating)
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<Star key={`empty-${i}`} size={16} className="star empty" />)
    }
    
    return stars
  }

  return (
    <div className="product-card">
      <div className="product-image-container">
        <img 
          src={product.image} 
          alt={product.name}
          className="product-image"
        />
        <span className="product-category">{product.category}</span>
      </div>
      
      <div className="product-info">
        <h3 className="product-name">{product.name}</h3>
        
        <div className="product-rating">
          <div className="stars">
            {renderStars(product.rating)}
          </div>
          <span className="rating-text">({product.rating})</span>
        </div>
        
        <div className="product-price">
          <span className="price">₹{product.price.toFixed(2)}</span>
        </div>
        
        <button 
          className="add-to-cart-btn"
          onClick={(e) => onAddToCart(product, e)}
        >
          <Plus size={18} />
          Add to Cart
        </button>
      </div>
    </div>
  )
}

export default ProductCard
