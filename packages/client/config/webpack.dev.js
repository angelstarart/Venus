import webpack from "webpack";
import path from "node:path";
import {merge} from "webpack-merge";
import ReactRefreshPlugin from "@pmmmwh/react-refresh-webpack-plugin";
import {common} from "./webpack.common.js";

const __dirname = import.meta.dirname;
const source = path.join(__dirname, '../source');

export const devConfig = merge(common, {
  mode: 'development',
  devtool: 'inline-source-map',
  entry: {
    main: ['webpack-hot-middleware/client', source + '/scripts/index'],
  },

  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new ReactRefreshPlugin({
      esModule: true,
      overlay: {
        sockIntegration: 'whm',
      },
    }),
  ],
})
