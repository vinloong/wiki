// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion
const math = require('remark-math');
const npm2yarn = require('@docusaurus/remark-plugin-npm2yarn');
const BookMarks = require('./bookmarks.json')
const lightCodeTheme = require('prism-react-renderer/themes/github');
const darkCodeTheme = require('prism-react-renderer/themes/dracula');


const BookMarksDropdownItems = Object.entries(BookMarks)

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: "Loong's Wiki",
  tagline: '',
  url: 'https://vinloong.github.io',
  baseUrl: '/',
  baseUrlIssueBanner: true,
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',
  favicon: 'img/favicon.ico',
  
  organizationName: 'vinloong', 
  projectName: 'vinloong.github.io', 
  trailingSlash: false,
  stylesheets: [
    {
      href: '/katex/katex.min.css',
      type: 'text/css',
    },
  ],
  // Even if you don't use internalization, you can use this field to set useful
  // metadata like html lang. For example, if your site is Chinese, you may want
  // to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'zh-CN',
    locales: ['zh-CN'],
  },
  webpack: {
    jsLoader: (isServer) => ({
      loader: require.resolve('swc-loader'),
      options: {
        jsc: {
          parser: {
            syntax: 'typescript',
            tsx: true,
          },
          target: 'es2017',
        },
        module: {
          type: isServer ? 'commonjs' : 'es6',
        },
      },
    }),
  },
  markdown: {
    mermaid: true,
  },
  themes: ['live-codeblock'],
  plugins: [
    [
      'ideal-image',
      /** @type {import('@docusaurus/plugin-ideal-image').PluginOptions} */
      ({
        quality: 70,
        max: 1030,
        min: 640,
        steps: 2,
        // Use false to debug, but it incurs huge perf costs
        disableInDev: true,
      }),
    ],
    // [
    //   'content-docs',
    //   /** @type {import('@docusaurus/plugin-content-docs').Options} */
    //   ({
    //     id: 'kubernetes',
    //     path: 'kubernetes',
    //     routeBasePath: 'kubernetes',
    //     sidebarPath: require.resolve('./sidebarsKubernetes.js'),
    //     remarkPlugins: [npm2yarn],        
    //     showLastUpdateTime: true,
    //   })
    // ],
    [
      'pwa',
      {
        debug: false,
        offlineModeActivationStrategies: [
          'appInstalled',
          'standalone',
          'queryString',
        ], 
        pwaHead: [
          {
            tagName: 'link',
            rel: 'icon',
            href: '/img/logo.png',
          },
          {
            tagName: 'link',
            rel: 'manifest',
            href: 'manifest.json', 
          },
          {
            tagName: 'meta',
            name: 'theme-color',
            content: 'rgb(37, 194, 160)',
          },
          {
            tagName: 'meta',
            name: 'apple-mobile-web-app-capable',
            content: 'yes',
          },
          {
            tagName: 'meta',
            name: 'apple-mobile-web-app-status-bar-style',
            content: '#000',
          },
          {
            tagName: 'link',
            rel: 'apple-touch-icon',
            href: 'img/logo.png',
          },
          {
            tagName: 'link',
            rel: 'mask-icon',
            href: 'img/logo.png',
            color: 'rgb(62, 204, 94)',
          },
          {
            tagName: 'meta',
            name: 'msapplication-TileImage',
            content: 'img/logo.png',
          },
          {
            tagName: 'meta',
            name: 'msapplication-TileColor',
            content: '#000',
          },
        ],               
      }
    ],
    '@docusaurus/theme-mermaid',    
  ],    
  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          path: 'docs',
          sidebarPath: 'sidebars.js',
          // sidebarPath: require.resolve('./sidebars.js'),          
          // Please change this to your repo. 
          showLastUpdateTime: true,
          remarkPlugins: [math, [npm2yarn, {sync: true}]],
          rehypePlugins: [],
        },        
        blog: {
          path: 'blog',
          showReadingTime: true,
          // Please change this to your repo.          
          postsPerPage: 5,
          feedOptions: {
            type: 'all',
            copyright: `Copyright © ${new Date().getFullYear()} Vinloong, Inc.`,
          },
          blogSidebarCount: 'ALL',
          blogSidebarTitle: 'All our posts',      
        },
        pages: {
          remarkPlugins: [npm2yarn],
        },        
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      liveCodeBlock: {
        playgroundPosition: 'bottom',
      },
      docs: {
        sidebar: {
          hideable: true,
          autoCollapseCategories: true,
        },
      },
      colorMode: {
        defaultMode: 'light',
        disableSwitch: false,
        respectPrefersColorScheme: true,
      },
      prism: {
        additionalLanguages: ['java', 'latex'],
        magicComments: [
          {
            className: 'theme-code-block-highlighted-line',
            line: 'highlight-next-line',
            block: {start: 'highlight-start', end: 'highlight-end'},
          },
          {
            className: 'code-block-error-line',
            line: 'This will error',
          },
        ],
      },
      image: 'img/docusaurus-social-card.jpg',
      algolia: {
        appId: 'M0SW1X5KLW',
        apiKey: '90d3f491aaef78b5f20eb4efa2709b86',
        indexName: 'lingwenlong',
        debug: false
      },      
      navbar: {
        hideOnScroll: true,
        title: "Loong's Wiki",
        logo: {
          alt: "Loong's Wiki Logo",
          src: 'img/logo.svg',
          width: 32,
          height: 32,
        },
        items: [
          {
            to: '/docs/category/docs',
            position: 'right',
            label: '文档',
          },
          {
            type: 'docSidebar',
            sidebarId: 'kubernetes',
            position: 'right',
            label: 'kubernetes',
          },
          // {
          //   to: '/kubernetes',
          //   label: 'kubernetes',
          //   position: 'right',
          //   sidebarId: 'kubernetes',
          //   activeBaseRegex: `/kubernetes/`,
          // },
          {
            type: 'docSidebar',
            label: 'linux',
            position: 'right',
            sidebarId: 'linux',
          },     
          {
            type: 'docSidebar',
            label: 'dev&ops',
            position: 'right',
            sidebarId: 'dev&ops',
          },    
          {
            type: 'docSidebar',
            label: 'others',
            position: 'right',
            sidebarId: 'others',
          },              
          {to: '/blog', label: '博客', position: 'right'},
          {
            position: 'right',
            label: "🔖 常用书签",
            items: [
              {
                type: 'html',
                className: 'dropdown-archived',
                value: '<b>开源镜像站</b>',
              },
              ...BookMarksDropdownItems.map(
                ([name, url]) => ({
                  label: name,
                  href: url,
                }),
              )
            ],
          },
          {
            href: 'https://github.com/vinloong/wiki',                   
            label: 'GitHub',
            position: 'right',
          },
        ],
      },
      footer: {
        style: 'dark',
        links: [
          {
            title: 'Docs',
            items: [
              {
                label: '文档',
                to: '/docs/category/docs',
              },
            ],
          },

          {
            title: 'More',
            items: [
              {
                label: 'Blog',
                to: '/blog',
              },
            ],
          },
        ],
        copyright: `Copyright © ${new Date().getFullYear()-2} - ${new Date().getFullYear()+1} loong's wiki, Inc. Built with <a href="https://docusaurus.io/zh-CN/" >Docusaurus</a> .`,
      },
      // prism: {
      //   theme: lightCodeTheme,
      //   darkTheme: darkCodeTheme,
      // },
    }),
};

async function createConfig() {
  const configTabs = (await import('./src/remark/configTabs.mjs')).default;
  const lightTheme = (await import('./src/utils/prismLight.mjs')).default;
  const darkTheme = (await import('./src/utils/prismDark.mjs')).default;
  const katex = (await import('rehype-katex')).default;
  // @ts-expect-error: we know it exists, right
  config.presets[0][1].docs.remarkPlugins.push(configTabs);
  // @ts-expect-error: we know it exists, right
  config.themeConfig.prism.theme = lightTheme;
  // @ts-expect-error: we know it exists, right
  config.themeConfig.prism.darkTheme = darkTheme;
  // @ts-expect-error: we know it exists, right
  config.presets[0][1].docs.rehypePlugins.push(katex);
  return config;
}

module.exports = createConfig;
