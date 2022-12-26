// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const BookMarks = require('./bookmarks.json')
const lightCodeTheme = require('prism-react-renderer/themes/github');
const darkCodeTheme = require('prism-react-renderer/themes/dracula');


const BookMarksDropdownItems = Object.entries(BookMarks)

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: "Loong's Wiki",
  tagline: '',
  url: 'https://github.com',
  baseUrl: '/',
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',
  favicon: 'img/favicon.ico',
  
  organizationName: 'vinloong', 
  projectName: 'wiki', 

  // Even if you don't use internalization, you can use this field to set useful
  // metadata like html lang. For example, if your site is Chinese, you may want
  // to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'zh-CN',
    locales: ['zh-CN'],
  },

  markdown: {
    mermaid: true,
  },

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          // Please change this to your repo.          
          
        },
        blog: {
          showReadingTime: true,
          // Please change this to your repo.          
      
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
      navbar: {
        title: "Loong's Wiki",
        logo: {
          alt: "Loong's Wiki Logo",
          src: 'img/logo.svg',
        },
        items: [
          {
            type: 'doc',
            docId: 'intro',
            position: 'right',
            label: 'Tutorial',
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
                label: 'Tutorial',
                to: '/docs/intro',
              },
            ],
          },
          {
            title: 'Community',
            items: [ 
              {
                label: 'GitHub',
                href: 'https://github.com/vinloong/wiki',
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
      prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme,
      },
    }),
};

module.exports = config;
