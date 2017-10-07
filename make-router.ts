import * as express from 'express';
import * as  PDFDocument from 'pdfkit';
import * as moment from 'moment';

import { makeSet, defaultAdd } from 'make-exercises-math';
import * as extype from 'make-exercises-math';
import { ExerciseMathImpl, ExpressionImpl, ExpressionRender } from 'make-exercises-math';


export class MakeRouter {

    router: express.Router;

    get(req: express.Request, res: express.Response, next: express.NextFunction): void {
        console.log('get query: ' + JSON.stringify(req.query));
        const parameters = req.query;
        const types = determineExerciseTypes(parameters.types);
        const label = parameters.label || 'Mathematik :: Sienna Metzner, 3c';
        const exerciseTypes = types || [defaultAdd];


        let doc = new PDFDocument({ 'size': [600, 840] });
        doc.font('Courier-Bold', 'Courier', 14);
        moment.locale('de');
        const datum = moment(new Date()).format('LL');

        const metaData = {
            datum: datum, label: label
        };
        console.log('metadata: ' + JSON.stringify(metaData));

        let a = 1;
        doc.text(label);
        doc.text('(1) ' + datum);
        let y = 150;
        let x = 40;
        const ePromise = makeSet(exerciseTypes);
        ePromise.then(
            op => {
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
            },
            err => {
                console.log('rejected promise : ' + err);
            }
        );
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
    }
}

function determineExerciseTypes(types: string): any[] | undefined {
    if (types) {
        let t = [];
        const typesArray = types.split(',');
        for (let i = 0; i < typesArray.length; i++) {
            if (extype[typesArray[i]] !== undefined) {
                t.push(extype[typesArray[i]]);
            }
        }
        return t;
    }
}

const makeRoute = new MakeRouter();
export default makeRoute.router;
