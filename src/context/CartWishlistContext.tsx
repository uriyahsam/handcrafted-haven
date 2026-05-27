'use client'
import { createContext, useContext, useEffect, useState, useCallback } from 'react'

export interface CartItem {
  id: string
  title: string
  price: number
  image: string
  quantity: number
}

export interface WishlistItem {
  id: string
  title: string
  price: number
  image: string
}

interface CartWishlistContextType {
  cart: CartItem[]
  wishlist: WishlistItem[]
  cartCount: number
  wishlistCount: number
  addToCart: (item: Omit<CartItem, 'quantity'>) => void
  removeFromCart: (id: string) => void
  updateCartQty: (id: string, qty: number) => void
  clearCart: () => void
  toggleWishlist: (item: WishlistItem) => void
  isInCart: (id: string) => boolean
  isInWishlist: (id: string) => boolean
}

const CartWishlistContext = createContext<CartWishlistContextType | null>(null)

export function CartWishlistProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([])
  const [wishlist, setWishlist] = useState<WishlistItem[]>([])
  const [hydrated, setHydrated] = useState(false)

  // Load from localStorage after mount
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem('hh_cart')
      const savedWishlist = localStorage.getItem('hh_wishlist')
      if (savedCart) setCart(JSON.parse(savedCart))
      if (savedWishlist) setWishlist(JSON.parse(savedWishlist))
    } catch {}
    setHydrated(true)
  }, [])

  // Persist cart
  useEffect(() => {
    if (!hydrated) return
    localStorage.setItem('hh_cart', JSON.stringify(cart))
  }, [cart, hydrated])

  // Persist wishlist
  useEffect(() => {
    if (!hydrated) return
    localStorage.setItem('hh_wishlist', JSON.stringify(wishlist))
  }, [wishlist, hydrated])

  const addToCart = useCallback((item: Omit<CartItem, 'quantity'>) => {
    setCart((prev) => {
      const existing = prev.find((c) => c.id === item.id)
      if (existing) {
        return prev.map((c) => c.id === item.id ? { ...c, quantity: c.quantity + 1 } : c)
      }
      return [...prev, { ...item, quantity: 1 }]
    })
  }, [])

  const removeFromCart = useCallback((id: string) => {
    setCart((prev) => prev.filter((c) => c.id !== id))
  }, [])

  const updateCartQty = useCallback((id: string, qty: number) => {
    if (qty < 1) {
      setCart((prev) => prev.filter((c) => c.id !== id))
      return
    }
    setCart((prev) => prev.map((c) => c.id === id ? { ...c, quantity: qty } : c))
  }, [])

  const clearCart = useCallback(() => setCart([]), [])

  const toggleWishlist = useCallback((item: WishlistItem) => {
    setWishlist((prev) => {
      const exists = prev.find((w) => w.id === item.id)
      if (exists) return prev.filter((w) => w.id !== item.id)
      return [...prev, item]
    })
  }, [])

  const isInCart = useCallback((id: string) => cart.some((c) => c.id === id), [cart])
  const isInWishlist = useCallback((id: string) => wishlist.some((w) => w.id === id), [wishlist])

  const cartCount = cart.reduce((sum, c) => sum + c.quantity, 0)
  const wishlistCount = wishlist.length

  return (
    <CartWishlistContext.Provider value={{
      cart, wishlist, cartCount, wishlistCount,
      addToCart, removeFromCart, updateCartQty, clearCart,
      toggleWishlist, isInCart, isInWishlist,
    }}>
      {children}
    </CartWishlistContext.Provider>
  )
}

export function useCartWishlist() {
  const ctx = useContext(CartWishlistContext)
  if (!ctx) throw new Error('useCartWishlist must be used within CartWishlistProvider')
  return ctx
}
