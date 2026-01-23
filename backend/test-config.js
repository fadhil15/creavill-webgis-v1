// Test the full Strapi config loading process - manual approach
require('dotenv').config();

const path = require('path');
const fs = require('fs');
const { env, importDefault } = require('@strapi/utils');

// Emulate Strapi's config loading
const configDir = path.resolve(process.cwd(), 'config');
const VALID_EXTENSIONS = ['.js', '.json'];

const loadConfigFile = (file) => {
    const ext = path.extname(file);
    if (ext === '.js') {
        const jsModule = require(file);
        if (typeof jsModule === 'function') {
            return jsModule({ env });
        }
        return jsModule;
    }
    return {};
};

const loadConfigDir = (dir) => {
    if (!fs.existsSync(dir)) return {};
    return fs.readdirSync(dir, { withFileTypes: true })
        .filter(file => file.isFile() && VALID_EXTENSIONS.includes(path.extname(file.name)))
        .reduce((acc, file) => {
            const key = path.basename(file.name, path.extname(file.name));
            acc[key] = loadConfigFile(path.resolve(dir, file.name));
            return acc;
        }, {});
};

console.log('Loading config from:', configDir);
const baseConfig = loadConfigDir(configDir);

console.log('\n=== Base Config Keys ===');
console.log(Object.keys(baseConfig));

console.log('\n=== Database Config from baseConfig ===');
console.log(JSON.stringify(baseConfig.database, null, 2));

// This is what matters - Strapi expects database.connection
console.log('\n=== Is database.connection defined? ===');
console.log('database:', typeof baseConfig.database);
console.log('database.connection:', baseConfig.database?.connection ? 'YES' : 'NO');
console.log('database.connection.client:', baseConfig.database?.connection?.client);
