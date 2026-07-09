import path from "node:path";
import {merge} from "webpack-merge";
import {CleanWebpackPlugin} from "clean-webpack-plugin";
import OptimizeCssAssetsPlugin from "optimize-css-assets-webpack-plugin";
import TerserPlugin from "terser-webpack-plugin";
import {common} from "./webpack.common.js";

const __dirname = import.meta.dirname;
const source = path.join(__dirname, '../source');

export default merge(common,{
    mode: 'production',
    devtool: false,
    entry: {
        main: [source + '/scripts/index'],
    },
    plugins: [
        new CleanWebpackPlugin(),
    ],
    optimization: {
        minimize: true,
        minimizer: [new OptimizeCssAssetsPlugin(), new TerserPlugin()],
        runtimeChunk: {
            name: 'runtime',
        },
    },
    performance: {
        hints: false,
        maxEntrypointSize: 512000,
        maxAssetSize: 512000,
    },
});
