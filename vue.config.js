// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require('path')
// const defaultSettings = require('./src/settings') // eslint-disable-line @typescript-eslint/no-var-requires

// If your port is set to 80,
// use administrator privileges to execute the command line.
// For example, on Mac: sudo npm run / sudo yarn
// const devServerPort = defaultSettings.devServerPort // 9527 // TODO: get this variable from setting.ts
// const mockServerPort = defaultSettings.mockServerPort// 9528 // TODO: get this variable from setting.ts
// const name = defaultSettings.title // 'HelloEdu Admin' // TODO: get this variable from setting.ts
const devServerPort = 9527 // TODO: get this variable from setting.ts
const mockServerPort = 9528 // TODO: get this variable from setting.ts
const name = 'HelloEdu Admin' // TODO: get this variable from setting.ts

module.exports = {
  // publicPath: process.env.NODE_ENV === 'production' ? '/vue-typescript-admin-template/' : '/',
  publicPath: '/',
  lintOnSave: process.env.NODE_ENV === 'development',
  productionSourceMap: false,
  devServer: {
    port: devServerPort,
    open: true,
    overlay: {
      warnings: false,
      errors: true
    },
    progress: false,
    proxy: {
      // change xxx-api/login => /mock-api/v1/login
      // detail: https://cli.vuejs.org/config/#devserver-proxy
      // change xxx-api/v?/yyy => /api/v?/yyy
      // request({urls: 'v1/yyy'}) => /api/v1/yyy
      [process.env.VUE_APP_BASE_API]: {
        target: `http://localhost:${mockServerPort}/api`,
        changeOrigin: true, // needed for virtual hosted sites
        ws: true, // proxy websockets
        pathRewrite: {
          ['^' + process.env.VUE_APP_BASE_API]: ''
        }
      },
      // in order to make cookie non-http cookie to work for refresh_token
      '/api/fev1': {
        target: `http://localhost:${mockServerPort}`,
        changeOrigin: true, // needed for virtual hosted sites
        ws: true // proxy websockets
      }
    }
  },
  pwa: {
    name: name,
    workboxPluginMode: 'InjectManifest',
    workboxOptions: {
      swSrc: path.resolve(__dirname, 'src/pwa/service-worker.js')
    }
  },
  pluginOptions: {
    'style-resources-loader': {
      preProcessor: 'scss',
      patterns: [
        path.resolve(__dirname, 'src/styles/_variables.scss'),
        path.resolve(__dirname, 'src/styles/_mixins.scss')
      ]
    }
  },
  chainWebpack(config) {
    // provide the app's title in webpack's name field, so that
    // it can be accessed in index.html to inject the correct title.
    config.set('name', name)

    // https://webpack.js.org/configuration/devtool/#development
    // Change development env source map if you want.
    // The default in vue-cli is 'eval-cheap-module-source-map'.
    config
      .when(process.env.NODE_ENV === 'development',
        config => config.devtool('eval-source-map')
      )

    config
      .when(process.env.NODE_ENV !== 'development',
        config => {
          config
            .optimization.splitChunks({
              chunks: 'all',
              cacheGroups: {
                libs: {
                  name: 'chunk-libs',
                  test: /[\\/]node_modules[\\/]/,
                  priority: 10,
                  chunks: 'initial' // only package third parties that are initially dependent
                },
                elementUI: {
                  name: 'chunk-elementUI', // split elementUI into a single package
                  priority: 20, // the weight needs to be larger than libs and app or it will be packaged into libs or app
                  test: /[\\/]node_modules[\\/]_?element-ui(.*)/ // in order to adapt to cnpm
                },
                commons: {
                  name: 'chunk-commons',
                  test: path.resolve(__dirname, 'src/components'),
                  minChunks: 3, //  minimum common number
                  priority: 5,
                  reuseExistingChunk: true
                }
              }
            })
          config.optimization.runtimeChunk('single')
        }
      )
  }
}
