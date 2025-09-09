// 测试文件：features层的用户资料组件
import { getUserData } from '../../../shared/api/user.js' // 正确：使用shared层
import { ProductCard } from '../../product-list/ui/ProductCard.jsx' // 违规：跨feature访问
import { fetchUserFromDB } from '../../../app/database/user.js' // 违规：features不应该访问app层

export function UserProfile({ userId }) {
  const userData = getUserData(userId)

  return (
    <div>
      <h1>{userData.name}</h1>
      <ProductCard product={userData.favoriteProduct} />
    </div>
  )
}
