const development = {
    PORT: 5000,
    INTERNAL_URL: 'https://api-dev.getup.metropolitan.co.za',
    GRAPH_URL: 'https://graph.facebook.com/v11.0',
    FACEBOOK_ACCESS_TOKEN: 'EAAIjpheZAu1sBAJPUE1daHMrgKeSsaKKJSCt8sU2U7BlMV8EwhNGg52mSgP2NIsQ6sxvg84TMXORFRGeQoEKJmYr1TmODNHekS6ydUxyZAptMOllOdYmDRVZA2gzf3rSaFazDQlVIDNZCuZCTtGJVuV070BthZBKtzqndKlqOtTHVUA3SYFXvwTOTmsLhuedYg2brTPbeAPgZDZD',
    FACEBOOK_VERIFY_TOKEN: '9t^vLko@#o#LX8E1',
    FACEBOOK_APP_SECRET: 'd0eb8f38522033e9e993b8737cd687a4',
    WIT_ACCESS_TOKEN: '7PIM3IFZKUNGZJ4NSPEFEA73FUKKGLQ3'
}

const production = {
    PORT: 9080,
    INTERNAL_URL: 'https://api.getup.metropolitan.co.za',
    GRAPH_URL: 'https://graph.facebook.com/v11.0',
    FACEBOOK_ACCESS_TOKEN: '',
    FACEBOOK_VERIFY_TOKEN: '',
    FACEBOOK_APP_SECRET: '',
    WIT_ACCESS_TOKEN: '',
}

const CONFIG = process.env.NODE_ENV === 'production' ? production : development;

module.exports = CONFIG;
