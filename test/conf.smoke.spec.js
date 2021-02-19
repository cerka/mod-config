
'use strict';

var fs = require('fs');

describe('[SMOKE]', () => {
    beforeAll(done => {
        fs.writeFileSync('.config.yml', fs.readFileSync('.config.example.yml'));
        return done();
    });

    afterAll(done => {
        fs.unlinkSync('.config.yml');
        return done();
    });

    it ('load conf', () => {
        const conf = require('../src/app');
        expect(conf).toEqual({"tata": {"toto": "tutu"}, "tutu": "flop"});
    });

    it ('must be frozen', () => {
        const conf = require('../src/app');
        expect(() => {
            conf.tata = "shouldnot";
        }).toThrow();
        expect(conf).toEqual({"tata": {"toto": "tutu"}, "tutu": "flop"});
        expect(() => {
            conf.tata.toto = "shouldnoteither";
        }).toThrow();
        expect(conf).toEqual({"tata": {"toto": "tutu"}, "tutu": "flop"});
    });
});