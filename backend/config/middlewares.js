module.exports = [
    'strapi::logger',
    'strapi::errors',
    {
        name: 'strapi::cors',
        config: {
            enabled: true,
            headers: '*',
            origin: [
                'http://localhost:3000',
                'https://creavill-bandung.vercel.app', // Update with your Vercel URL
                process.env.FRONTEND_URL,
            ].filter(Boolean),
            methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'HEAD', 'OPTIONS'],
            keepHeaderOnError: true,
        },
    },
    'strapi::security',
    'strapi::poweredBy',
    'strapi::query',
    'strapi::body',
    'strapi::session',
    'strapi::favicon',
    'strapi::public',
];
