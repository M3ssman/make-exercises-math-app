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
        console.log('GET with req.query: '+JSON.stringify(req.query));
        // prepare metadata from query
        const label = req.query.label || 'Mathematik :: Sienna Metzner, 3c';
        const metaData = prepareMetaData(label);

        // inspespect exercises query parameter
        const parameters = req.query;
        const types = getExerciseTypes(parameters.types);
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
        const label = req.body.label || 'Mathematik :: Sienna Metzner, 3c';
        const metaData = prepareMetaData(label);
        let exercises = [];
        if(req.body.exercises === undefined) {
            exercises = [defaultAdd];
        } else {
            exercises = getExerciseTypes(req.body.exercises);
        }
        if(exercises.length === 0) {
            exercises = req.body.exercises;
        }

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

function getExerciseTypes(types: string): any[] | undefined {
    if (types) {
        const typesArray = types.split(',');
        return typesArray.filter( type => extype[type] !== undefined).map( t => extype[t]);
    }
}

/**
 * 
 * Rendering Demo Application with Exercises
 * 
 * @param exerciseTypes 
 * @param metaData 
 * @param res 
 */
function processExercisesPromise(exerciseTypes: any[], metaData: MetaData, res: express.Response) {
    // request exercises
    makeSet(exerciseTypes).then(op => {
        // prepare pdf doc
        let doc = new PDFDocument({ 'size': [600, 840] });
        doc.font('Courier-Bold', 'Courier', 16);
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
        const exc: ExerciseMathImpl[][] = op;
        for (let i = 0; i < exc.length; i++) {
            let row = a + ' ) ';
            doc.text(row, x, y);
            x += 40;
            for (let j = 0; j < exc[i].length; j++) {
                const excR: string[] = exc[i][j].get();
                if (typeof excR === 'object') {
                    if(excR.length === 1) {
                        doc.text(excR[0], x, y);
                        y += 40;
                    // having at least an additional carry row ...
                    } else if(excR.length > 1) {
                        for(let k=0; k < excR.length; k++) {
                            let row = excR[k];
                            // check row for marks of former digits <> 0
                            if(row.indexOf('_') > -1) {
                                let _x = x;
                                for(let l=0; l< row.length; l++) {
                                    // replace underscore mark by rectangle
                                    if(row[l] === '_') {
                                        doc.lineWidth(1);
                                        doc.rect(_x, y, 8, 12).stroke();
                                    } else {
                                        doc.text(row[l], _x, y);
                                    }
                                    _x += 10;
                                }
                                _x = 0;
                            } else  {
                                // no marks, just render line as it is
                                doc.text(row, x, y);
                            }
                                
                            // strike line before result entry
                            if(k === excR.length-2) {
                                const w = excR[k].length * 10;
                                doc.lineWidth(2);
                                doc.moveTo(x,y+14).lineTo(x+w, y+14).stroke();
                                y += 5;
                            }

                            // srike twice below every result row
                            if(k === excR.length-1) {
                                const w = excR[k].length * 10;
                                doc.lineWidth(1);
                                doc.moveTo(x,y+14).lineTo(x+w, y+14).stroke();
                                doc.moveTo(x,y+16).lineTo(x+w, y+16).stroke();
                                y += 5;
                            }

                            // next row
                            y += 15;
                        }
                        // between each exercise
                        y += 15;
                    }
                }
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
