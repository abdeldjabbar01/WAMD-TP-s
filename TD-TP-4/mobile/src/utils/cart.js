export const toCartItem = (p) => ({
  id: p._id, name: p.name, price: p.price, imageUrl: p.imageUrl, stock: p.stock,
})
