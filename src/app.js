'use strict';

const DEFAULT_PREFIX = 'app';
const DEFAULT_FILE_ENV = '.env';
const DEFAULT_FILE_CONF = '.config';

const yaml = require('node-yaml');
const debug = require('debug')('mod:config');
const nodeEnv = require('node-env-configuration');

class Configuration {
    constructor() {
        this.instance = null;
        let conf = this.readYaml(DEFAULT_FILE_CONF);

        debug(`NODE_ENV set on '${process.env.NODE_ENV}'`);

        if (conf && conf[process.env.NODE_ENV]) {
            debug(`env match section in configuration file`);
            conf = conf[process.env.NODE_ENV];
        }

        if (conf) {
            debug(`prefix set on '${(conf.env_prefix ? conf.env_prefix : DEFAULT_PREFIX )}'`);
            this._env = Object.assign(
                nodeEnv({
                    defaults: this.readYaml(DEFAULT_FILE_ENV),
                    prefix: conf.env_prefix || DEFAULT_PREFIX
                })
            ,conf);
        }
        else {
            debug(`no ${DEFAULT_FILE_CONF} file set`);
            this._env = Object.assign(
                nodeEnv({
                    defaults: this.readYaml(DEFAULT_FILE_ENV),
                    prefix: DEFAULT_PREFIX
                })
            ,conf);
        }
        // this._env = Object.freeze(this._env);
        this._env = this.deepFreeze(this._env);
    }

    readYaml(file) {
        try {
            return yaml.readSync(process.cwd() + '/' + file);
        }
        catch (error) {
            if (error.errno == -2) {
                return {};
            }
            else {
                throw error;
            }
        }
    }

    static getInstance() {
        if (this._instance) {
            return this._instance;
        }
        else {
            this._instance = new Configuration();
            return this._instance;
        }
    }

    deepFreeze(object) {
        let propNames = Object.getOwnPropertyNames(object);
        for (let name of propNames) {
           let value = object[name];
           object[name] = value && typeof value === "object" ?  
                                this.deepFreeze(value) : value;
        }
        return Object.freeze(object);
     }
}

module.exports = Configuration.getInstance()._env;