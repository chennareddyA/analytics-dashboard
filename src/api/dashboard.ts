import { api } from './client'
import type { Cart, Customer, ListResponse, Product } from '../types/api'

// limit=0 asks DummyJSON for every record. `select` keeps the response small.
export async function fetchAllProducts(signal?: AbortSignal) {
  const { data } = await api.get<ListResponse<'products', Product>>('/products', {
    params: { limit: 0, select: 'title,category,price,stock,rating,brand,thumbnail' },
    signal,
  })
  return data.products
}

export async function fetchAllCarts(signal?: AbortSignal) {
  const { data } = await api.get<ListResponse<'carts', Cart>>('/carts', {
    params: { limit: 0 },
    signal,
  })
  return data.carts
}

// We only need the count of users, so ask for one record with just its id
export async function fetchUserCount(signal?: AbortSignal) {
  const { data } = await api.get<ListResponse<'users', { id: number }>>('/users', {
    params: { limit: 1, select: 'id' },
    signal,
  })
  return data.total
}

export async function fetchAllCustomers(signal?: AbortSignal) {
  const { data } = await api.get<ListResponse<'users', Customer>>('/users', {
    params: {
      limit: 0,
      select: 'firstName,lastName,email,phone,age,gender,image,role,address,company',
    },
    signal,
  })
  return data.users
}
