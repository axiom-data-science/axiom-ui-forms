import type { StorybookConfig } from "@storybook/react-webpack5"
import path from "path"
const cracoConfig = require('../craco.config.js')

const config: StorybookConfig = {
  stories: ["../src/**/*.mdx", "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"],
  addons: [
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "@storybook/preset-create-react-app",
    "@storybook/addon-onboarding",
    "@storybook/addon-interactions",
  ],
  framework: {
    name: "@storybook/react-webpack5",
    options: {},
  },
  webpackFinal(config, {
    configType
  }) {
    return {
      ...config,
      resolve: {
        ...config.resolve,
        alias: {
          ...config?.resolve?.alias,
          ...{
            '@': path.resolve(__dirname, "../src")
          }
        },
        fallback: {
          ...config?.resolve?.fallback,
          ...cracoConfig?.webpack?.configure?.resolve?.fallback
        }
      }
    };
  },
  docs: {
    autodocs: "tag",
  },
  staticDirs: ["../public"],
};
export default config;
