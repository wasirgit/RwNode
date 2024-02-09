// configuration

const envSettings = {};

// staging environment
envSettings.staging = {
    port: 3000,
    envName: 'staging',
    secretkey: 'staging_sec_key',
};

// production environment
envSettings.production = {
    port: 4000,
    envName: 'production',
    secretkey: 'prod_secret_key',
};

// determine which environment was passed
const currentEnvironment =
    typeof process.env.NODE_ENV === 'string' ? process.env.NODE_ENV : 'staging';

// export corresponding environment object
const environmentToExport =
    typeof envSettings[currentEnvironment] === 'object'
        ? envSettings[currentEnvironment]
        : envSettings.staging;

// export module
module.exports = environmentToExport;
