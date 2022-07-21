// import { addParameters } from '@storybook/vue';
//
// addParameters({
//   docs: {
//     inlineStories: true,
//   },
// });

export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
}
