const parse = require('pg-connection-string').parse;

module.exports = ({ env }) => {
    // If DATABASE_URL is provided (Railway deployment), parse it
    if (env('DATABASE_URL')) {
        const config = parse(env('DATABASE_URL'));
        return {
            connection: {
                client: 'postgres',
                connection: {
                    host: config.host,
                    port: config.port,
                    database: config.database,
                    user: config.user,
                    password: config.password,
                    ssl: {
                        rejectUnauthorized: false,
                    },
                },
                debug: false,
            },
        };
    }

    // Otherwise use individual environment variables (local development)
    return {
        connection: {
            client: env('DATABASE_CLIENT', 'postgres'),
            connection: {
                host: env('DATABASE_HOST', 'localhost'),
                port: env.int('DATABASE_PORT', 5432),
                database: env('DATABASE_NAME', 'strapi'),
                user: env('DATABASE_USERNAME', 'strapi'),
                password: env('DATABASE_PASSWORD', 'strapi'),
                ssl: env.bool('DATABASE_SSL', false) ? {
                    rejectUnauthorized: false,
                } : false,
            },
            debug: false,
        },
    };
};
