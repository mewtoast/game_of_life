// Snowpack Configuration File
// See all supported options: https://www.snowpack.dev/reference/configuration

/** @type {import("snowpack").SnowpackUserConfig } */
module.exports = {
    mount: {
        /* ... */
    },
    plugins: [
        /* ... */
    ],
    packageOptions: {
        /* ... */
    },
    devOptions: {
        open: 'chrome',
        port: 3000,
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
    ]
}
