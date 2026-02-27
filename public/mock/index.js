// 模拟数据生成工具
const mockTableData = (page = 1, size = 10) => {
  const data = []
  for (let i = 0; i < size; i++) {
    data.push({
      id: (page - 1) * size + i + 1,
      name: `User ${(page - 1) * size + i + 1}`,
      age: Math.floor(Math.random() * 50 + 20),
      address: `Mock Address District ${Math.floor(Math.random() * 100)}`,
      date: new Date().toLocaleDateString(),
      status: Math.random() > 0.5 ? 'Active' : 'Inactive'
    })
  }
  return {
    list: data,
    total: 100
  }
}

module.exports = {
  mockTableData
}
