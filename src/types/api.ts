// Types for the DummyJSON data we use on the dashboard

export type Product = {
  id: number
  title: string
  category: string
  price: number
  stock: number
  rating: number
  brand?: string
  thumbnail: string
}

export type CartItem = {
  id: number
  title: string
  price: number
  quantity: number
  total: number
  discountedTotal?: number
  thumbnail?: string
}

// DummyJSON calls them carts; on the dashboard we treat each cart as an order
export type Cart = {
  id: number
  userId: number
  products: CartItem[]
  total: number
  discountedTotal: number
  totalProducts: number
  totalQuantity: number
}

export type ListResponse<K extends string, T> = {
  total: number
  skip: number
  limit: number
} & Record<K, T[]>

export type Customer = {
  id: number
  firstName: string
  lastName: string
  email: string
  phone: string
  age: number
  gender: string
  image: string
  role: string
  address: { city: string; state: string; country: string }
  company: { name: string; title: string }
}
