'use strict';

const yaml = require('node-yaml');
const nodeEnv = require('node-env-configuration');

class Configuration {
    constructor() {
        this.instance = null;
        let conf = this.readYaml('.config.yml');

        if (conf && conf[process.env.NODE_ENV]) {
            conf = conf[process.env.NODE_ENV];
        }

        if (conf) {
            this._env = Object.assign(
                nodeEnv({
                    defaults: this.readYaml('.env.yml'),
                    prefix: conf.env_prefix || 'app'
                })
            ,conf);
        }
        else {
            this._env = Object.assign(
                nodeEnv({
                    defaults: this.readYaml('.env.yml'),
                    prefix: 'app'
                })
            ,conf);
        }
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
}

module.exports = Configuration.getInstance()._env;