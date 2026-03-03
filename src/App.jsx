import { useState, useEffect } from 'react'
import Header from './components/Header'
import ProductList from './components/ProductList'
import Cart from './components/Cart'
import { products } from './data/products'
import './App.css'

function App() {
  const [cart, setCart] = useState([])
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [sortBy, setSortBy] = useState('name')

  useEffect(() => {
    const savedCart = localStorage.getItem('cart')
    if (savedCart) {
      setCart(JSON.parse(savedCart))
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart))
  }, [cart])

  const addToCart = (product, event) => {
    const cartButton = event.currentTarget
    const productCard = cartButton.closest('.product-card')
    const productImage = productCard.querySelector('.product-image')
    const cartIcon = document.querySelector('.cart-button')
    
    createFlyingImage(productImage, cartIcon, product)
    
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === product.id)
      if (existingItem) {
        return prevCart.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      }
      return [...prevCart, { ...product, quantity: 1 }]
    })
  }

  const createFlyingImage = (startImage, targetElement, product) => {
    const flyingImage = document.createElement('img')
    flyingImage.src = product.image
    flyingImage.className = 'flying-image'
    
    const startRect = startImage.getBoundingClientRect()
    const targetRect = targetElement.getBoundingClientRect()
    
    flyingImage.style.left = startRect.left + 'px'
    flyingImage.style.top = startRect.top + 'px'
    flyingImage.style.width = startRect.width + 'px'
    flyingImage.style.height = startRect.height + 'px'
    
    document.body.appendChild(flyingImage)
    
    setTimeout(() => {
      flyingImage.style.left = targetRect.left + targetRect.width/2 - 25 + 'px'
      flyingImage.style.top = targetRect.top + targetRect.height/2 - 25 + 'px'
      flyingImage.style.width = '50px'
      flyingImage.style.height = '50px'
      flyingImage.style.opacity = '0.8'
    }, 50)
    
    setTimeout(() => {
      targetElement.classList.add('bounce')
      setTimeout(() => {
        targetElement.classList.remove('bounce')
      }, 600)
    }, 700)
    
    setTimeout(() => {
      flyingImage.remove()
    }, 800)
  }

  const removeFromCart = (productId) => {
    setCart(prevCart => prevCart.filter(item => item.id !== productId))
  }

  const updateQuantity = (productId, quantity) => {
    if (quantity === 0) {
      removeFromCart(productId)
    } else {
      setCart(prevCart =>
        prevCart.map(item =>
          item.id === productId ? { ...item, quantity } : item
        )
      )
    }
  }

  const getCartItemCount = () => {
    return cart.reduce((total, item) => total + item.quantity, 0)
  }

  const getCartTotal = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0)
  }

  return (
    <div className="app">
      <Header
        cartItemCount={getCartItemCount()}
        onCartClick={() => setIsCartOpen(true)}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        sortBy={sortBy}
        onSortChange={setSortBy}
      />
      
      <main className="main-content">
        <ProductList
          products={products}
          searchTerm={searchTerm}
          selectedCategory={selectedCategory}
          sortBy={sortBy}
          onAddToCart={addToCart}
        />
      </main>

      {isCartOpen && (
        <Cart
          cart={cart}
          onClose={() => setIsCartOpen(false)}
          onUpdateQuantity={updateQuantity}
          onRemoveFromCart={removeFromCart}
          total={getCartTotal()}
        />
      )}
    </div>
  )
}

export default App
