// 测试文件：product模块
export function getProductData() {
  return [
    { id: 1, name: 'Product 1', price: 100 },
    { id: 2, name: 'Product 2', price: 200 },
  ]
}

export function createProduct(productData) {
  console.log('Creating product:', productData)
  return { ...productData, id: Date.now() }
}
