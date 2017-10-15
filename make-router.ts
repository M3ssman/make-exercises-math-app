import * as express from 'express';
import * as  PDFDocument from 'pdfkit';
import * as moment from 'moment';

import { makeSet, defaultAdd } from 'make-exercises-math';
import * as extype from 'make-exercises-math';
import { ExerciseMathImpl, ExpressionImpl, ExpressionRender } from 'make-exercises-math';


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
        console.log('GET with '+ req);
        // prepare metadata from query
        const label = req.query.label || 'Mathematik :: Sienna Metzner, 3c';
        const metaData = prepareMetaData(label);

        // inspespect exercises query parameter
        const parameters = req.query;
        const types = determineExerciseTypes(parameters.types);
        const exerciseTypes = types || [defaultAdd];

        // process exercises
        processExercisesPromise(exerciseTypes, metaData, res);
    }

    /**
     * 
     * Handle POST Request
     * 
     * @param req 
     * @param res 
     */
    post(req: express.Request, res: express.Response): void {
        console.log('POST with '+ req);
        const label = req.body.label || 'Mathematik :: Sienna Metzner, 3c';
        const metaData = prepareMetaData(label);
        let exercises = [];
        if(req.body.exercises === undefined) {
            exercises = [defaultAdd];
        } else {
            exercises = mapTypes(req.body.exercises);
        }
        if(exercises.length === 0) {
            exercises = req.body.exercises;
        }

        console.log('exercises : '+ JSON.stringify(exercises));

        // process exercises
        processExercisesPromise(exercises, metaData, res);
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
        this.router.post('/',this.post)
    }
}

function prepareMetaData(label: string): MetaData {
    moment.locale('de');
    const datum = moment(new Date()).format('LL');
    return { datum: datum, label: label };
}

function determineExerciseTypes(types: string): any[] | undefined {
    if (types) {
        const typesArray = types.split(',');
        return mapTypes(typesArray);
    }
}

function mapTypes(types: string[]): any | undefined {
    let t = [];
    for (let i = 0; i < types.length; i++) {
        if (extype[types[i]] !== undefined) {
            t.push(extype[types[i]]);
        }
    }
    return t;
}

function processExercisesPromise(exerciseTypes: any[], metaData: MetaData, res: express.Response) {
    // request exercises
    makeSet(exerciseTypes).then(op => {
        // prepare pdf doc
        let doc = new PDFDocument({ 'size': [600, 840] });
        doc.font('Courier-Bold', 'Courier', 14);
        if (metaData) {
            if (metaData.label) {
                doc.text(metaData.label);
            }
            if (metaData.datum) {
                doc.text('(1) ' + metaData.datum);
            }
        }
        // prepare width, indents, nr of exercises
        let y = 150;
        let x = 40;
        let a = 1;
        console.log('resolved exercises: ' + JSON.stringify(op));
        const exc: ExerciseMathImpl[][] = op;
        for (let i = 0; i < exc.length; i++) {
            let row = a + ' ) ';
            doc.text(row, x, y);
            x += 40;
            for (let j = 0; j < exc[i].length; j++) {
                const excR: string = exc[i][j].get()[0];
                doc.text(excR, x, y);
                y += 40;
            }
            a++;
            x += 120;
            y = 150;
        }
        doc.pipe(res);
        doc.end();
    }, err => {
        console.log('promise rejected: ' + err);
    });
}

/**
 * Util Type
 */
interface MetaData {
    label: string;
    datum: string;
}


const makeRoute = new MakeRouter();
export default makeRoute.router;
