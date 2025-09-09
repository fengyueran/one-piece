// 测试文件：data层数据访问
export function fetchUserFromDB(id) {
  // 模拟数据库查询
  return {
    id: id,
    name: `User ${id}`,
    email: `user${id}@example.com`,
  }
}

export function saveUserToDB(userData) {
  // 模拟保存到数据库
  console.log('Saving user:', userData)
  return true
}
