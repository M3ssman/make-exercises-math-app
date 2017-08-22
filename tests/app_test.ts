import { server } from '../app';
import * as mocha from 'mocha';
import * as chai from 'chai';
import chaiHTTP = require('chai-http');

const should = chai.should();
const expect = chai.expect;
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
            .end( (err, res) => {
                res.should.have.status(200);
                done();
            });
    });
});