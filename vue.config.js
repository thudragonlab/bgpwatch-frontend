const CompressionPlugin = require('compression-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
module.exports = {
  // 部署应用包时的基本 URL
  publicPath: './',

  // 运行 vue-cli-service build 时生成的生产环境构建文件的目录
  // 默认构建前清除文件夹(构建时传入 --no-clean 可关闭该行为
  outputDir: 'dist',

  // 放置生成的静态资源 (js、css、img、fonts) 的 (相对于 outputDir 的) 目录
  assetsDir: 'public',

  // 指定生成的 index.html 的输出路径 (相对于 outputDir),也可以是一个绝对路径
  indexPath: 'index.html',

  // 生成的静态资源在它们的文件名中包含了 hash 以便更好的控制缓存
  filenameHashing: true,

  // 当在 multi-page 模式下构建时，webpack 配置会包含不一样的插件
  // (这时会存在多个 html-webpack-plugin 和 preload-webpack-plugin 的实例)。
  // 如果你试图修改这些插件的选项，请确认运行 vue inspect
  pages: {
    index: {
      // page 的入口
      entry: 'src/main.js',
      // 模板来源
      // template: 'public/index.html',
      // 在 dist 的输出为 index.html
      // filename: 'AS_Rank.html',
      // 当使用 title 选项时，
      // template 中的 title 标签需要是 <title><%= htmlWebpackPlugin.options.title %></title>
      // title: 'AS_Rank',
      // 在这个页面中包含的块，默认情况下会包含
      // 提取出来的通用 chunk 和 vendor chunk。
      //chunks: ['chunk-vendors', 'chunk-common', 'index']
    },
    // 当使用只有入口的字符串格式时，
    // 模板会被推导为 `public/subpage.html`
    // 并且如果找不到的话，就回退到 `public/index.html`。
    // 输出文件名会被推导为 `subpage.html`。

    // 多入口时，接着写子页面
    //subpage: 'src/subpage/main.js'
  },

  // eslint-loader 是否在保存的时候检查
  // lintOnSave: true,

  // // 是否使用包含运行时编译器的Vue核心的构建
  // runtimeCompiler: false,

  // // 默认情况下 babel-loader 忽略其中的所有文件 node_modules，
  // // 想要通过 Babel 显式转译一个依赖，可以在这个选项中列出来
  // transpileDependencies: [],

  // 生产环境 sourceMap
  productionSourceMap: false,

  // // 跨域设置
  // // 可取值参考： https://developer.mozilla.org/zh-CN/docs/Web/HTML/CORS_settings_attributes
  // crossorigin: undefined,

  // // 构建后的文件是部署在 CDN 上的，启用该选项可以提供额外的安全性, 默认false
  // integrity: false,

  // webpack 配置，键值对象时会合并配置，为方法时会改写配置
  // https://cli.vuejs.org/guide/webpack.html#simple-configuration
  configureWebpack: (config) => {
    // config.plugins= [
    //   // 打包体积分析

    // ],
    config.optimization = {
        splitChunks: {
          // chunks: 'all',
          minSize: 0,
          // minRemainingSize: 0,
          minChunks: 1,
          maxAsyncRequests: 30,
          maxInitialRequests: 30,
          enforceSizeThreshold: 50000,
          cacheGroups: {
            defaultVendors: {
              test: /[\\/]node_modules[\\/]/,
              name: 'vendor',
              priority: -10,
              reuseExistingChunk: true,
            },
            default: {
              minChunks: 2,
              priority: -20,
              reuseExistingChunk: true,
            },
          },
        },
      },

      config.optimization.minimizer = [
        //new MyAwesomeWebpackPlugin()
        new BundleAnalyzerPlugin({
          analyzerMode: "static"
        }),
        new CompressionPlugin({
          filename: '[path].gz[query]',
          algorithm: 'gzip',
          test: new RegExp('.(' + ['js', 'css', 'json'].join('|') + ')$'),
          threshold: 10240, // 对超过10k的数据压缩
          minRatio: 0.8,
          deleteOriginalAssets: false
        }),
        new UglifyJsPlugin({
          uglifyOptions: {
            //生产环境自动删除console
            compress: {
              drop_debugger: true,
              drop_console: true,
              pure_funcs: ['console.log']
            }
          },
          sourceMap: false,
          parallel: true
        })
      ]
  },

  // // 所有 webpack-dev-server 的选项都支持
  // // https://webpack.js.org/configuration/dev-server/
  devServer: {
    open: true,

    host: '0.0.0.0',
    // useLocalIp:true,
    // //port: 3000,
    proxy: {
      '/myapi': {
        target: `http://xxxxxxx:5001`,
        changeOrigin: true,
        pathRewrite: {
          '^/myapi': ''
        }
      },
    },
    // https: false,
    //hotOnly: false,

    // 将任何未知请求 (没有匹配到静态文件的请求) 代理到该字段指向的地方 
    //proxy: null,

    before: app => {}
  },
  // // 构建时开启多进程处理 babel 编译
  // // 是否为 Babel 或 TypeScript 使用 thread-loader
  // parallel: require('os').cpus().length > 1,

  // // https://github.com/vuejs/vue-cli/tree/dev/packages/%40vue/cli-plugin-pwa
  // pwa: {},

  // 第三方插件配置
  pluginOptions: {

  }
};