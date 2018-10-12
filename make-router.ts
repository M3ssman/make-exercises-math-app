import * as express from 'express';
import * as PDFDocument from 'pdfkit';
import * as moment from 'moment';

import * as extype 
    from 'make-exercises-math';
//from '../make-exercises-math';
import { 
    makeSet, 
    Exercise,
    ExerciseSet,
    Options,
    Rendered
} from 'make-exercises-math';
//} from '../make-exercises-math';

// some fallback
const defaultAdd : Options = {
    set: "N",
    operations: ["add"]
};

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
        const label = req.query.label || 'Mathematik :: Sienna Metzner, 4c';
        const metaData = prepareMetaData(label);
        const parameters = req.query;
        const configs = getExerciseTypes(parameters.types);
        processExercisesPromise( configs, metaData, res);
    }

    /**
     * 
     * Handle POST Request
     * 
     * @param req 
     * @param res 
     */
    post(req: express.Request, res: express.Response): void {
        const label = req.body.label || 'Mathematik :: Sienna Metzner, 4c';
        const metaData = prepareMetaData(label);
        const exercises = getExerciseTypes(req.body.exercises);
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

function getExerciseTypes(types: string): Options[] {
    if (types ) {
        const typesArray = types.split(',');
        return typesArray
            .filter( type => extype[type] !== undefined)
            .map( t =>  extype[t]);
    } else {
        return [defaultAdd];
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
    makeSet(exerciseTypes)
        .then(promisedSets => renderExercisesPDF(promisedSets,metaData,res), 
              err => console.log('exercises not resolved: ' + err))
        .catch(err => {
            if (console) {
                console.log(err);
            }
        });
}

function renderExercisesPDF(sets: ExerciseSet[],metaData: MetaData, res: express.Response) {
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

    sets.forEach((set: ExerciseSet) => {
        let row = a + ' ) ';
        doc.text(row, x, y);
        x += 40;
        set.exercises.forEach((exc: Exercise) => {    
            const rendered: Rendered[] = exc.rendered;
            if (typeof rendered === 'object') {
                if(rendered.length === 1) {
                    doc.text(rendered[0].rendered, x, y);
                    y += 40;
                // having at least an additional carry row ...
                } else if(rendered.length > 1) {
                    y = handleRendered(rendered, x, doc, y);
                    // guess some space between each exercise
                    y += 15;
                }
            }
        });
        a++;
        // if the last entry from last row was division ...
        if(set.properties.extension === 'DIV_EVEN') {
            x += 200;
        } else {
            x += 120;
        }
        y = 150;
    });
    doc.pipe(res);
    doc.end();
}

/**
 * Util Type
 */
interface MetaData {
    label: string;
    datum: string;
}

function handleRendered(rendered: extype.Rendered[], x: number, doc: PDFKit.PDFDocument, y: number) {
    for (let k = 0; k < rendered.length; k++) {
        let row:Rendered = rendered[k];
        if(! row) {
            console.log('[ERROR] entry '+k+': encountered row of type "undefined" from rendered '+JSON.stringify(rendered)+'!')
            continue;
        }
        // check row for marks of former digits <> 0
        if (row.rendered.indexOf('?') > -1) {
            let _x = x;
            for (let l = 0; l < row.rendered.length; l++) {
                // replace underscore mark by rectangle
                if (row.rendered[l] === '?') {
                    doc.lineWidth(1);
                    doc.rect(_x, y, 8, 12).stroke();
                }
                else {
                    doc.text(row.rendered[l], _x, y);
                }
                _x += 10;
            }
            _x = 0;
        }
        else {
            // no marks, just render line as it is
            doc.text(row.rendered, x, y);
        }
        // strike line before result entry
        if (k === rendered.length - 2) {
            const w = rendered[k].rendered.length * 10;
            doc.lineWidth(2);
            doc.moveTo(x, y + 14).lineTo(x + w, y + 14).stroke();
            y += 5;
        }
        // srike twice below every result row
        if (k === rendered.length - 1) {
            const w = rendered[k].rendered.length * 10;
            doc.lineWidth(1);
            doc.moveTo(x, y + 14).lineTo(x + w, y + 14).stroke();
            doc.moveTo(x, y + 16).lineTo(x + w, y + 16).stroke();
            y += 5;
        }
        // next row
        y += 15;
    }
    return y;
}

