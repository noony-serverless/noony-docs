import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

const config: Config = {
  title: 'Noony Framework',
  tagline: 'Type-safe serverless framework for modern cloud applications',
  favicon: 'img/favicon.ico',

  // Future flags, see https://docusaurus.io/docs/api/docusaurus-config#future
  future: {
    v4: true, // Improve compatibility with the upcoming Docusaurus v4
  },

  // Set the production url of your site here
  url: 'https://noony-serverless.github.io',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/noony-docs/',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'noony-serverless', // Usually your GitHub org/user name.
  projectName: 'noony-docs', // Usually your repo name.

  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',

  // GitHub Pages deployment configuration
  trailingSlash: false,
  deploymentBranch: 'gh-pages',

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      {
        docs: {
          path: 'noony-doc',
          sidebarPath: './sidebars.ts',
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl:
            'https://github.com/noony-serverless/noony-docs/tree/main/noony-doc/',
        },
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themes: [
    '@docusaurus/theme-mermaid',
    [
      require.resolve("@easyops-cn/docusaurus-search-local"),
      ({
        hashed: true,
      }),
    ],
  ],

  // Enable Mermaid in Markdown
  markdown: {
    mermaid: true,
  },

  themeConfig: {
    // Replace with your project's social card
    image: 'img/docusaurus-social-card.jpg',
    navbar: {
      title: 'Noony',
      logo: {
        alt: 'Noony Framework Logo',
        src: 'img/logo.svg',
      },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'tutorialSidebar',
          position: 'left',
          label: 'Documentation',
        },
        {
          href: 'https://github.com/noony-serverless/noony-docs',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Product',
          items: [
            {
              label: 'Getting Started',
              to: '/docs/intro',
            },
            {
              label: 'Documentation',
              to: '/docs/getting-started',
            },
            {
              label: 'Examples',
              to: '/docs/examples',
            },
          ],
        },
        {
          title: 'Developers',
          items: [
            {
              label: 'Core Concepts',
              to: '/docs/core-concepts',
            },
            {
              label: 'Middlewares',
              to: '/docs/middlewares',
            },
            {
              label: 'Authentication',
              to: '/docs/authentication',
            },
            {
              label: 'Advanced Topics',
              to: '/docs/advanced',
            },
          ],
        },
        {
          title: 'Community',
          items: [
            {
              label: 'GitHub',
              href: 'https://github.com/noony-serverless/noony-docs',
            },
            {
              label: 'Discord',
              href: 'https://discord.gg/noony',
            },
            {
              label: 'Documentation',
              href: 'https://noony-serverless.github.io/noony-docs',
            },
            {
              label: 'Examples Repository',
              href: 'https://github.com/noony-serverless/examples',
            },
          ],
        },
        {
          title: 'More',
          items: [
            {
              label: 'Changelog',
              href: 'https://github.com/noony-serverless/noony-docs/releases',
            },
            {
              label: 'Contributing',
              href: 'https://github.com/noony-serverless/noony-docs/blob/main/CONTRIBUTING.md',
            },
            {
              label: 'npm Package',
              href: 'https://www.npmjs.com/package/@noony/core',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Noony Framework. Type-safe serverless for modern developers.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
    mermaid: {
      theme: {light: 'neutral', dark: 'dark'},
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
