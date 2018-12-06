import * as express from 'express';

import {
    makeExercisePDF,
    PageOptions,
} from '../make-exercises-math';

export class MakeRouter {

    router: express.Router;

    /**
     * 
     * Handle GET Request
     * 
     * @param req 
     * @param res 
     */
    get(req: express.Request, res: express.Response): void {
        const parameters = req.query;
        const configs = parameters.types
        processExercisesPromise(configs, { pageLabel: req.query.label }, res)
    }

    /**
     * 
     * Handle POST Request
     * 
     * @param req 
     * @param res 
     */
    post(req: express.Request, res: express.Response): void {
        const exercises = req.body.exercises
        processExercisesPromise(exercises, { pageLabel: req.query.label }, res);
    }

    /**
     * Initialize the Router
     */
    constructor() {
        this.router = express.Router();
        this.init();
    }

    init() {
        this.router.get('/', this.get);
        this.router.post('/', this.post)
    }
}

/**
 * 
 * Rendering Demo Application with Exercises
 * 
 * @param exerciseTypes 
 * @param pageOpts 
 * @param res 
 */
function processExercisesPromise(exerciseTypes: string, pageOpts: PageOptions, res: express.Response) {
    console.debug('[DEBUG] - request exercises from "' + JSON.stringify(exerciseTypes) + '" and pageOptions: ' + JSON.stringify(pageOpts))
    makeExercisePDF(res, exerciseTypes, pageOpts)
        .then(() => console.log('[INFO] received Exercises: done'), 
              reason => console.error('[ERROR] rejected Exercises ' + reason))
        .catch(err => {
            if(console)
                console.error('[ERROR] catched ' + err)
        })
}
