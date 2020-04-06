const { CleanWebpackPlugin } = require(`clean-webpack-plugin`)
const LoaderOptionsPlugin = require(`webpack`).LoaderOptionsPlugin
const path = require(`path`)
const exec = require(`child_process`).exec
const autoprefixer = require(`autoprefixer`)

const src = path.resolve(__dirname, `./src`)
const dist = path.resolve(__dirname, `./dist`)

const postPlugin = {
    apply: compiler => compiler.hooks.afterEmit.tap(
        `AfterEmitPlugin`,
        () => new Promise(resolve => exec(`osascript -e 'display notification "Complete" with title "WEBPACK"'`, resolve))
    )
}

module.exports = {
    mode: `production`,
    entry: {
        bundle: [`${src}/index.js`]
    },
    output: {
        path: dist,
        filename: `[name].js`,
        libraryTarget: `umd`,
        library: `gdocApp`,
        globalObject: `typeof self !== 'undefined' ? self : this`
    },
    optimization: {
        splitChunks: {
            maxAsyncRequests: 1
        }
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                loader: `babel-loader`,
                exclude: /node_modules/
            },
            {
                test: /\.html$/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: `html-loader`,
                        options: {
                            minimize: true
                        }
                    }
                ],
            },
            {
                test: /\.(scss|css)$/,
                exclude: /node_modules/,
                use: [
                    `css-loader`,
                    `sass-loader`,
                    `postcss-loader`,
                ],
            }
        ]
    },
    resolve: {
        extensions: [`.js`],
        modules: [`node_modules`, `src`],
        alias: {
            services: `${src}/app/services`,
            helpers: `${src}/app/helpers`
        }
    },
    plugins: [
        new CleanWebpackPlugin({
            root: process.cwd(),
            verbose: true,
            dry: false
        }),
        new LoaderOptionsPlugin({ options: { postcss: [autoprefixer()] } }),
        postPlugin
    ]
}