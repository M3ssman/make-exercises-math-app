import * as http from 'http';
import * as debug from 'debug';
import * as path from 'path';
import * as express from 'express';
import * as bodyParser from 'body-parser';
import { MakeRouter } from './make-router';

// Creates and configures an ExpressJS web server.
class MyApp {

    // ref to Express instance
    public express: express.Application;

    //Run configuration methods on the Express instance.
    constructor() {
        this.express = express();
        this.middleware();
        this.routes();
    }

    // Configure Express middleware.
    private middleware(): void {
        this.express.use(bodyParser.json());
        this.express.use(bodyParser.urlencoded({ extended: false }));
    }

    private routes(): void {
        let router: express.Router = express.Router();
        router.get('/', (req, res, next) => {
            res.json({
                message: 'Make Exercises Math using Path /make'
            });
        });
        router.post('/', (req, res, next) => {
            res.json({
                message: 'Make Exercises Math using Path /make'
            });
        });

        this.express.use('/', router);
        const mr = new MakeRouter();
        this.express.use('/make', mr.router);
    }
}

// export default new App().express;
const App: MyApp = new MyApp();
const expApp = App.express;
if (expApp === null) {
    console.log('NO - its null!');
}

console.log('Try starting app ... ');
console.log(process.env);

const port = normalizePort(process.env.OPENSHIFT_NODEJS_PORT || 8080);
expApp.set('port', port);
export const server = http.createServer(expApp);
server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

function normalizePort(val: number | string): number | string | boolean {
    let port: number = (typeof val === 'string') ? parseInt(val, 10) : val;
    if (isNaN(port)) return val;
    else if (port >= 0) return port;
    else return false;
}

function onError(error: NodeJS.ErrnoException): void {
    if (error.syscall !== 'listen') throw error;
    let bind = (typeof port === 'string') ? 'Pipe ' + port : 'Port ' + port;
    switch (error.code) {
        case 'EACCES':
            console.error(`${bind} requires elevated privileges`);
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.error(`${bind} is already in use`);
            process.exit(1);
            break;
        default:
            throw error;
    }
}

function onListening(): void {
    let addr = server.address();
    let bind = (typeof addr === 'string') ? `pipe ${addr}` : `port ${addr.port}`;
}
