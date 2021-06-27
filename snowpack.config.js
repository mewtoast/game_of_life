// Snowpack Configuration File
// See all supported options: https://www.snowpack.dev/reference/configuration

/** @type {import("snowpack").SnowpackUserConfig } */
module.exports = {
    mount: {
        /* ... */
    },
    plugins: [
        '@snowpack/plugin-postcss',
    ],
    packageOptions: {
        /* ... */
    },
    devOptions: {
        open: 'chrome',
        port: 3000,
        tailwindConfig: './tailwind.config.js',
    },
    buildOptions: {
        /* ... */
    },
    exclude: [
        '**/node_modules/**/*',
        '**/LICENSE',
        '**/package.json',
        '**/package-lock.json',
        '**/README.md',
        '**/*.config.js',
        '**/tsconfig.json',
    ],
    optimize: {
        minify: true,
    },
    alias: {
        react: 'preact/compat',
        'react-dom': 'preact/compat',
    },
}
