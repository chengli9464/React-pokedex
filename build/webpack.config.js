const path = require('path');
const autoprefixer = require('autoprefixer');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin'); //引入Html模板模块
const { CleanWebpackPlugin } = require('clean-webpack-plugin'); //引入清除文件插件
const ESLintPlugin = require('eslint-webpack-plugin');

module.exports = {
  mode: 'development', // webpack开发环境
  entry: './src/index.jsx', // webpack打包入口文件
  output: {
    filename: 'bundle.js', // 打包后的文件名称
    path: path.resolve(__dirname, '../dist') // 打包后的目录，必须是绝对路径，针对的是当前webpack.config.js文件的路径
  },
  optimization: {
    //添加抽离公共代码插件的配置
    splitChunks: {
      cacheGroups: {
        //打包公共模块
        commons: {
          chunks: 'initial', //initial表示提取入口文件的公共部分
          minChunks: 2, //表示提取公共部分最少的文件数
          minSize: 0, //表示提取公共部分最小的大小
          name: 'commons' //提取出来的文件命名
        }
      }
    }
  },

  devServer: {
    hot: true,
    open: true,
    port: 3500,
    static: {
      directory: path.join(__dirname, '../dist')
    }
  },
  plugins: [
    new CleanWebpackPlugin(),
    // 然后新建一个plugins属性来实例化这个依赖插件
    new MiniCssExtractPlugin({
      filename: '[name].[contenthash].css',
      chunkFilename: '[id].[contenthash].css'
    }),
    new HtmlWebpackPlugin({
      //实例化Html模板模块
      template: path.resolve(__dirname, '../public/index.html')
    }),
    new ESLintPlugin({
      context: path.resolve(__dirname, '../src'),
      extensions: ['js', 'jsx'],
    })
  ],
  resolve: {
    //resolve核心配置
    extensions: ['.js', '.jsx', '.json'],
    alias: {
      pages: path.join(__dirname, '../src/pages'),
      components: path.join(__dirname, '../src/components'),
      actions: path.join(__dirname, '../src/redux/actions'),
      reducers: path.join(__dirname, '../src/redux/reducers'),
      images: path.join(__dirname, '../src/images')
    }
  },
  module: {
    rules: [
      {
        test: [/\.js$/, /\.jsx$/],
        use: ['babel-loader'],
        include: path.resolve(__dirname, '../src')
      },
      {
        test: /\.css$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              publicPath: '../'
            }
          },
          'css-loader'
        ]
      },
      {
        //此处再添加一条rules，用于配置css预处理器信息
        test: /\.less$/,
        use: [
          {
            loader: 'style-loader'
          },
          {
            loader: 'css-loader'
          },
          {
            //添加这段配置信息即可
            loader: 'postcss-loader',
            options: {
              postcssOptions: {
                plugins: [autoprefixer]
              }
            }
          },
          {
            loader: 'less-loader'
          }
        ]
      },
      {
        //配置图片静态资源的打包信息
        test: /\.(jpg|png|jpeg|gif)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 1024,
              fallback: {
                loader: 'file-loader',
                options: {
                  name: 'img/[name].[hash:8].[ext]'
                }
              }
            }
          }
        ]
      },
      {
        test: /\.(mp4|webm|ogg|mp3|wav)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 1024,
              fallback: {
                loader: 'file-loader',
                options: {
                  name: 'media/[name].[hash:8].[ext]'
                }
              }
            }
          }
        ]
      }
    ]
  }
};
