// 测试文件：user模块
import { getProductData } from '../product/ProductService.js' // 这应该违反同层隔离规则
import { getUserData } from '../../layers/business/UserService.js'

export class UserController {
  async getUser(id) {
    const user = await getUserData(id)
    // 违规：直接访问其他模块
    const relatedProducts = await getProductData()
    return { user, relatedProducts }
  }
}
