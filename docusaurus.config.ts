/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import npm2yarn from '@docusaurus/remark-plugin-npm2yarn';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import configTabs from './src/remark/configTabs';
import PrismLight from './src/utils/prismLight';
import PrismDark from './src/utils/prismDark';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';
import type {Options as DocsOptions} from '@docusaurus/plugin-content-docs';
import type {Options as BlogOptions} from '@docusaurus/plugin-content-blog';
import type {Options as PageOptions} from '@docusaurus/plugin-content-pages';
import type {Options as IdealImageOptions} from '@docusaurus/plugin-ideal-image';


const baseUrl = '/';

const defaultLocale = 'zh-CN';

const beian = '冀ICP备2024078621号-1'

export default async function createConfigAsync() {
  return {
    title: "loong's site",
    tagline: 'Always For Freedom.',
    organizationName: 'vinloong',
    projectName: 'wiki',
    baseUrl,
    baseUrlIssueBanner: true,
    url: 'https://wenlong.xyz',
    stylesheets: [
      {
        href: '/katex/katex.min.css',
        type: 'text/css',
      },
    ],
    // i18n: {
    //   defaultLocale,
    //   locales: [defaultLocale, 'zh-CN'],
    // },
    webpack: {
      jsLoader: () => ({
        loader: require.resolve('swc-loader'),
        options: {
          jsc: {
            parser: {
              syntax: 'typescript',
              tsx: true,
            },
            transform: {
              react: {
                runtime: 'automatic',
              },
            },
            target: 'es2017',
          },
          module: {
            type: 'commonjs' //: 'es6',
          },
        },
      }),
    },
    markdown: {
      format: 'detect',
      mermaid: true,
      mdx1Compat: {
        // comments: false,
      }
    },
    onBrokenLinks: 'throw',
    onBrokenMarkdownLinks: 'warn',
    favicon: 'img/logo.svg',
    staticDirectories: [
      'static',
    ],
    themes: ['live-codeblock'],
    plugins: [
      'docusaurus-plugin-sass',
      [
        'ideal-image',
        {
          quality: 70,
          max: 1030,
          min: 640,
          steps: 2,
          // Use false to debug, but it incurs huge perf costs
          disableInDev: true,
        } satisfies IdealImageOptions,
      ],
      [
        'pwa',
        {
          offlineModeActivationStrategies: [
            'appInstalled',
            'standalone',
            'queryString',
          ],
          // swRegister: false,
          // swCustom: require.resolve('./src/sw.js'), // TODO make it possible to use relative path
          pwaHead: [
            {
              tagName: 'link',
              rel: 'icon',
              href: 'img/docusaurus.png',
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
              href: 'img/docusaurus.png',
            },
            {
              tagName: 'link',
              rel: 'mask-icon',
              href: 'img/docusaurus.png',
              color: 'rgb(62, 204, 94)',
            },
            {
              tagName: 'meta',
              name: 'msapplication-TileImage',
              content: 'img/docusaurus.png',
            },
            {
              tagName: 'meta',
              name: 'msapplication-TileColor',
              content: '#000',
            },
          ],
        },
      ],
      '@docusaurus/theme-mermaid',
      './src/plugins/featureRequests/FeatureRequestsPlugin.js',      
    ],
    presets: [
      [
        'classic',
        {
          docs: {
            routeBasePath: '/',
            path: 'docs',
            sidebarPath: 'sidebars.ts',
            // sidebarCollapsible: false,
            sidebarCollapsed: true,
            admonitions: {
               keywords: ['my-custom-admonition'],
            },            
            showLastUpdateTime: true,
            remarkPlugins: [[npm2yarn, {sync: true}], remarkMath, configTabs],
            rehypePlugins: [[rehypeKatex, { strict: false }]],
          },
          blog: {
            // routeBasePath: '/',
            path: 'blog',
            remarkPlugins: [npm2yarn],
            postsPerPage: 5,
            feedOptions: {
              type: 'all',
              copyright: `Copyright © ${new Date().getFullYear()} Facebook, Inc.`,
            },
            blogSidebarCount: 'ALL',
            blogSidebarTitle: 'All our posts',
          } satisfies BlogOptions,
          pages: {
            remarkPlugins: [npm2yarn],
          } satisfies PageOptions,
          theme: {
            customCss: [
              './src/css/custom.css',
              // relative paths are relative to site dir              
            ],
          },
        } satisfies Preset.Options,
      ],
    ],

    themeConfig: {
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
        additionalLanguages: [
          'java',
          'latex',
          'PHp',
          'bash',
          'diff',
          'json',
          'scss',
        ],
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
        theme: PrismLight,
        darkTheme: PrismDark,
      },
      image: 'img/docusaurus-social-card.jpg',
      // metadata: [{name: 'twitter:card', content: 'summary'}],
      algolia: {
        appId: 'M0SW1X5KLW',
        apiKey: 'ce6d0ea73c8ad1406aaf6da247a2c6de',
        indexName: 'lingwenlong',
        replaceSearchResultPathname: undefined,
      },
      navbar: {
        hideOnScroll: true,
        title: '',
        logo: {
          alt: '',
          src: 'img/logo.svg',
          srcDark: 'img/logo.svg',
          width: 32,
          height: 32,
        },
        items: [
          {
            type: 'docSidebar',            
            position: 'left',            
            sidebarId: 'k8s',
            label: 'Kubernetes',
          },
          {
            type: 'docSidebar',
            label: 'Linux',
            position: 'left',           
            sidebarId: 'linux'
          },      
          {
            type: 'docSidebar',
            label: '开发',
            position: 'left',           
            sidebarId: 'dev&ops'
          },               
          {
            type: 'docSidebar',
            label: '百科',
            position: 'left',           
            sidebarId: 'wikipedia'
          },  
          {
            type: 'docSidebar',
            label: '其他',
            position: 'left',           
            sidebarId: 'others'
          },          
          {to: 'blog', label: '博客', position: 'left'},

          // Right
          {
            href: 'https://github.com/vinloong/wiki',
            position: 'right',
            className: 'header-github-link',
            'aria-label': 'GitHub repository',
          },
        ]
          // TODO fix type
          .filter(Boolean) as NonNullable<
          Preset.ThemeConfig['navbar']
        >['items'],
      },
      footer: {
        style: 'dark',
        links: [
          {
            title: '学习',
            items: [
              {
                label: 'Kubernetes',
                to: 'k8s',
              },
              {
                label: 'Linux',
                to: 'linux',
              },
            ],
          },
          {
            title: '更多',
            items: [
              {
                label: 'Blog',
                to: 'blog',
              },       
              {
                label: 'GitHub',
                href: 'https://github.com/vinloong/wiki',
              },
            ],
          },

        ],
        copyright: `©${new Date().getFullYear()-1}-${new Date().getFullYear()+1} Loong. Built with <a href="https://docusaurus.io/zh-CN/" >Docusaurus</a>.<br><a href="http://beian.miit.gov.cn/">${beian}</a>`,
        
      },
      socials: {
        github: 'https://github.com/vinloong',      
        email: 'mailto:literaryloong@gmail.com',
      },       
    } satisfies Preset.ThemeConfig,
  } satisfies Config;
}
