import * as express from 'express';
import * as  PDFDocument from 'pdfkit';
import * as moment from 'moment';

import { makeSet, defaultAdd } from 'make-exercises-math';
import * as makeSetType from 'make-exercises-math';
import { ExerciseMathImpl, BinaryExpressionImpl, BinaryExpressionRender } from 'make-exercises-math';


export class PDFRouter {

    router: express.Router;

    get(req: express.Request, res: express.Response, next: express.NextFunction): void {
        console.log('call make request exercises ... ' + req.query);
        const parameters = req.query;
        const types = determineExerciseTypes(parameters.types);
        const label = parameters.label || 'Mathematik :: Sienna Metzner, 3c';
        const exerciseTypes = types || [defaultAdd];
        

        let doc = new PDFDocument({ 'size': [600, 840] });
        doc.font('Courier-Bold', 'Courier', 14);
        moment.locale('de');
        const datum = moment(new Date()).format('LL');
        console.log('set datum: ' + datum.toString());

        let a = 1;
        doc.text(label);
        doc.text('(1) ' + datum);
        let y = 150;
        let x = 40;
        const ePromise = makeSet(exerciseTypes);
        console.log('requested promise of exercises[][] : ' + ePromise);
        ePromise.then(
            op => {
                console.log('resolve promise of exercises[][]: ' + op.length);
                const exc: ExerciseMathImpl[][] = op;
                for (let i = 0; i < exc.length; i++) {
                    let row = a + ' ) ';
                    doc.text(row, x, y);
                    x += 40;
                    for (let j = 0; j < exc[i].length; j++) {
                        const excR: string = exc[i][j].get()[0];
                        console.log('exercise : ' + excR);
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
            reject => {
                console.log("reject: " + reject);
            }
        );
    }

    /**
     * Initialize the PDFRouter
     */
    constructor() {
        this.router = express.Router();
        this.init();
    }

    init() {
        this.router.get('/', this.get);
    }
}

function determineExerciseTypes(types:string): any[] | undefined {
    if(types) {
        let t = [];
        const typesArray = types.split(',');
        for(let i=0; i<typesArray.length; i++) {
            if(makeSetType[typesArray[i]]) {
                t.push(makeSetType[typesArray[i]]);
            }
        }
        return t;
    }
}

const pdfRoutes = new PDFRouter();
export default pdfRoutes.router;
