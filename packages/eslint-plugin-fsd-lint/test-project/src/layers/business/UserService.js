// 测试文件：business层服务
import { fetchUserFromDB } from '../data/UserRepository.js'

export function getUserData(id) {
  return fetchUserFromDB(id)
}

export function validateUser(userData) {
  return userData && userData.id && userData.name
}
