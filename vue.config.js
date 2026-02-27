const path = require('path')

function resolve(dir) {
  return path.join(__dirname, dir)
}

module.exports = {
  // 文档站点基础路径
  publicPath: process.env.NODE_ENV === 'production' 
    ? '/lab-project/' 
    : '/',
  
  // 输出目录
  outputDir: 'lab-project',
  
  // 组件库打包配置
  configureWebpack: {
    resolve: {
      alias: {
        '@': resolve('src')
      }
    },
    externals: process.env.NODE_ENV === 'production' ? {
      // 如果是为了部署文档，这里不应该 external vue 和 element-ui，除非引入 CDN
      // 为了演示方便，暂时不 external，确保 build 后直接能用
      // 'vue': 'Vue',
      // 'element-ui': 'ELEMENT'
    } : {}
  },
  
  // 样式配置
  css: {
    extract: true,
    sourceMap: false,
    loaderOptions: {
      sass: {
        // 注意：sass-loader v8+ 使用 prependData，v10+ 使用 additionalData
        // 这里假设是较新版本，先用 additionalData，如果报错再改
        additionalData: `@import "@/styles/mixins.scss";`
      }
    }
  },
  
  // Mock Server 配置
  devServer: {
    setupMiddlewares: (middlewares, devServer) => {
      if (!devServer) {
        throw new Error('webpack-dev-server is not defined');
      }

      devServer.app.get('/api/table/list', (req, res) => {
        const { mockTableData } = require('./public/mock/index.js')
        const { page = 1, size = 10 } = req.query
        const result = mockTableData(parseInt(page), parseInt(size))
        res.json({
          code: 200,
          data: {
            list: result.list,
            total: result.total,
            page: parseInt(page),
            size: parseInt(size)
          }
        })
      })

      return middlewares;
    }
  }
}
