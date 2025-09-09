// 测试文件：presentation层组件
import { getUserData } from '../business/UserService.js'
import { fetchUserFromDB } from '../data/UserRepository.js' // 这应该违反层级依赖规则

export class UserComponent {
  constructor() {
    this.userService = getUserData
  }

  async loadUser(id) {
    // 直接调用data层 - 违反规则
    return await fetchUserFromDB(id)
  }
}
