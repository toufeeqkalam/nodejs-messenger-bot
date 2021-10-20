const development = {
    PORT: 5000,
    INTERNAL_URL: '',
    GRAPH_URL: 'https://graph.facebook.com/v11.0',
    FACEBOOK_ACCESS_TOKEN: '',
    FACEBOOK_VERIFY_TOKEN: '',
    FACEBOOK_APP_SECRET: ''
}

const production = {
    PORT: 9080,
    INTERNAL_URL: '',
    GRAPH_URL: 'https://graph.facebook.com/v11.0',
    FACEBOOK_ACCESS_TOKEN: '',
    FACEBOOK_VERIFY_TOKEN: '',
    FACEBOOK_APP_SECRET: ''
}

const CONFIG = process.env.NODE_ENV === 'production' ? production : development;

module.exports = CONFIG;
