import { server } from '../app';
import * as mocha from 'mocha';
import * as chai from 'chai';
import chaiHTTP = require('chai-http');

const should = chai.should();
chai.use(chaiHTTP);
const reqServer = process.env.HTTP_TEST_SERVER || server;

describe('Basic routes tests', () => {
    it('GET to / should return 200', (done) => {
        chai.request(reqServer).get('/').then(res => {
            res.should.have.status(200);
            done();
        }, err => { });
    });

    it('GET to /make should return 200', (done) => {
        chai.request(reqServer).get('/make')
            .then(res => {
                res.should.have.status(200);
                done();
            }, err => console.log(err));
    });

    it('GET second call to /make should also return 200', (done) => {
        chai.request(reqServer).get('/make')
            .then(res => {
                res.should.have.status(200);
                done();
            }, err => console.log(err));
    });

    it('GET second call to /make should also return 200', (done) => {
        chai.request(reqServer).get('/make?types=addN50N25Nof10')
            .then(res => {
                res.should.have.status(200);
                done();
            }, err => console.log(err));
    });
});