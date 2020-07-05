const pkg = require('./package.json');
// const version = `${pkg.version.split('.')[0]}.x`;

const serverRootDirect = process.env.NODE_ENV === 'production' ? 'https://caijf.github.io/mobx-async-state/' : '/';
const logo = 'https://www.caijinfeng.com/assets/images/logo-doly@3x.png';
const favicon = 'https://www.caijinfeng.com/assets/images/doly-touch-icon_48x48.png';

// const outputPath = 'site/' + version;
const outputPath = 'site';
const publicPath = serverRootDirect + outputPath + '/';
const manifestLink = `${publicPath}asset-manifest.json`;

const links = process.env.NODE_ENV === 'production' ? [{ rel: 'manifest', href: manifestLink }] : [];

const umiConfig = {
  extraBabelPlugins: [[
    'babel-plugin-import',
    {
      libraryName: 'antd',
      libraryDirectory: 'es',
      style: true,
    },
  ]],
  mode: 'doc',
  history: {
    type: 'hash'
  },
  title: pkg.name,
  logo,
  favicon,
  publicPath,
  outputPath,
  manifest: {
    publicPath
  },
  links,
  hash: true,
  locales: [['zh-CN', '中文'], ['en-US', 'English']]
};

if (process.env.NODE_ENV === 'production') {
  umiConfig.chainWebpack = function (config, { webpack }) {
    config.merge({
      optimization: {
        minimize: true,
        splitChunks: {
          cacheGroups: {
            vendor: {
              test: /node_modules/,
              chunks: "all",
              name: "vendor",
              priority: -10,
              enforce: true
            }
          }
        },
      }
    });
  }
}

export default umiConfig;