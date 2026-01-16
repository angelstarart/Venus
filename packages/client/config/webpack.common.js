import webpack from "webpack";
import path from "node:path";
import ESLintWebpackPlugin from "eslint-webpack-plugin";
import MiniCssExtractPlugin from "mini-css-extract-plugin";
import HtmlWebpackPlugin from "html-webpack-plugin";

const __dirname = import.meta.dirname;
const source = path.join(__dirname, '../source');

console.log(process.cwd(), 13)
console.log(process.env.NODE_ENV)

export const common = {
  context: source,
  output: {
    path: path.join(__dirname, '../destination'),
    publicPath: '/',
    filename: 'scripts/[name].js',
    // hotUpdateChunkFilename: 'hot/hot-update.js',
    // hotUpdateMainFilename: 'hot/[hash].hot-update.json',
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': JSON.stringify(process.env)
    }),
    new MiniCssExtractPlugin({
      filename: 'styles/[name].css',
      chunkFilename: 'styles/[id].css',
    }),
    new HtmlWebpackPlugin({
      favicon: source + '/images/favicon.ico',
      template: source + '/html/index.html',
      filename: 'index.html',
      meta: {
        'description': {name: 'description', content: 'The future is yet in your power'},
        // 'keyword': { name: 'keywords', content: '...' },
        'og:site_name': {property: 'og:site_name', content: 'PeacefulStar'},
        'og:title': {property: 'og:title', content: 'PeacefulStar'},
        'og:description': {property: 'og:description', content: 'The future is yet in your power'},
        'og:type': {property: 'og:type', content: 'website'},
        'og:url': {property: 'og:url', content: 'https://peacefulstar.art'},
        'og:image': {property: 'og:image', content: 'https://peacefulstar.art/images/og.png'},
        'twitter:card': {name: 'twitter:card', content: 'summary_large_image'},
        'twitter:title': {name: 'twitter:title', content: 'PeacefulStar'},
        'twitter:description': {name: 'twitter:description', content: 'The future is yet in your power'},
        'twitter:image': {name: 'twitter:image', content: 'https://peacefulstar.art/images/og.png'}
      }
    }),
    new ESLintWebpackPlugin()
  ],
  resolve: {
    extensions: [
      '.js',
      '.json',
      '.jsx',
      '.ts',
      '.tsx',
    ],
    modules: ['node_modules'],
  },

  module: {
    rules: [
      {
        test: /\.([tj])sx?$/,
        exclude: /node_modules/,
        use: {
          loader: 'swc-loader',
          options: {
            jsc: {
              parser: {
                syntax: 'typescript',
                tsx: true,
                dynamicImport: true,
                decorators: true
              },
              loose: true,
              transform: {
                react: {
                  runtime: 'automatic',
                  refresh: process.env.NODE_ENV !== 'production'
                }
              }
            }
          }
        },
      },
      {
        test: /\.html$/,
        loader: 'html-loader',

      },
      {
        test: /\.(png|jpe?g|gif|ico|svg)$/,
        type: 'asset/resource',
        generator: {
          filename: './images/[name].[ext]'
        },
      },
      {
        test: /\.(ttf|eot|woff2?)$/,
        type: 'asset/resource',
        generator: {
          filename: './fonts/[name].[ext]'
        }
      },
      // {
      //   test: /\.(mp4|ogv|webm)$/,
      //   type: 'asset/resource',
      //   generator: {
      //     filename: './movie/[name].[ext]'
      //   }
      // },
      // {
      //   test: /\.pdf$/,
      //   type: 'asset/resource',
      //   generator: {
      //     filename: './pdf/[name].[ext]'
      //   }
      // },
    ],
  },
}
