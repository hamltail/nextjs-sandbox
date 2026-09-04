import "../app/globals.css";

import type { Preview } from "@storybook/nextjs-vite";
import { NextIntlClientProvider } from "next-intl";

const messages = {
  ConfirmModal: {
    cancel: "キャンセル",
    delete: "削除",
  },
};

const preview: Preview = {
  decorators: [
    (Story) => (
      <NextIntlClientProvider locale="ja" messages={messages}>
        <Story />
      </NextIntlClientProvider>
    ),
  ],

  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },

    a11y: {
      test: "todo",
    },
  },
};

export default preview;
