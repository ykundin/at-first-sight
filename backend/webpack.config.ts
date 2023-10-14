import path from "path";

import type { Configuration } from "webpack";

const configuration: Configuration = {
  target: "node",
  entry: path.resolve(__dirname, "./run-prod-mode.ts"),
  resolve: {
    extensions: [".ts", ".js"],
    alias: {
      "~": path.resolve(__dirname, "./"),
    },
  },

  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
    ],
  },

  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "index.js",
  },
};

export default configuration;
