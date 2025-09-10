import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

const config: Config = {
  title: 'CloudFlow Functions',
  tagline: 'Next-generation serverless framework for modern cloud applications',
  favicon: 'img/favicon.ico',

  // Future flags, see https://docusaurus.io/docs/api/docusaurus-config#future
  future: {
    v4: true, // Improve compatibility with the upcoming Docusaurus v4
  },

  // Set the production url of your site here
  url: 'https://cloudflow-functions.dev',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'cloudflow', // Usually your GitHub org/user name.
  projectName: 'cloudflow-functions', // Usually your repo name.

  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',

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
          sidebarPath: './sidebars.ts',
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl:
            'https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/',
        },
        blog: {
          showReadingTime: true,
          feedOptions: {
            type: ['rss', 'atom'],
            xslt: true,
          },
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl:
            'https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/',
          // Useful options to enforce blogging best practices
          onInlineTags: 'warn',
          onInlineAuthors: 'warn',
          onUntruncatedBlogPosts: 'warn',
        },
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    // Replace with your project's social card
    image: 'img/docusaurus-social-card.jpg',
    navbar: {
      title: 'CloudFlow',
      logo: {
        alt: 'CloudFlow Functions Logo',
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
          to: '/docs/tutorial-basics/tech-radar',
          label: 'Tech Radar',
          position: 'left',
        },
        {to: '/blog', label: 'Blog', position: 'left'},
        {
          href: 'https://github.com/cloudflow/cloudflow-functions',
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
              to: '/docs/tutorial-basics/create-a-document',
            },
            {
              label: 'Tech Radar',
              to: '/docs/tutorial-basics/tech-radar',
            },
            {
              label: 'Pricing',
              href: 'https://cloudflow.dev/pricing',
            },
          ],
        },
        {
          title: 'Developers',
          items: [
            {
              label: 'API Reference',
              href: 'https://docs.cloudflow.dev/api',
            },
            {
              label: 'CLI Documentation',
              href: 'https://docs.cloudflow.dev/cli',
            },
            {
              label: 'Examples',
              href: 'https://github.com/cloudflow/examples',
            },
            {
              label: 'Status Page',
              href: 'https://status.cloudflow.dev',
            },
          ],
        },
        {
          title: 'Community',
          items: [
            {
              label: 'GitHub',
              href: 'https://github.com/cloudflow/cloudflow-functions',
            },
            {
              label: 'Discord',
              href: 'https://discord.gg/cloudflow',
            },
            {
              label: 'Stack Overflow',
              href: 'https://stackoverflow.com/questions/tagged/cloudflow',
            },
            {
              label: 'Newsletter',
              href: 'https://cloudflow.dev/newsletter',
            },
          ],
        },
        {
          title: 'Company',
          items: [
            {
              label: 'Blog',
              to: '/blog',
            },
            {
              label: 'About Us',
              href: 'https://cloudflow.dev/about',
            },
            {
              label: 'Careers',
              href: 'https://cloudflow.dev/careers',
            },
            {
              label: 'Contact',
              href: 'https://cloudflow.dev/contact',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} CloudFlow Functions. Built for the cloud, designed for developers.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
