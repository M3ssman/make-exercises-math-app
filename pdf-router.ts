import * as express from 'express';
import * as  PDFDocument from 'pdfkit';
import * as moment from 'moment';

import * as make from 'make-exercises-math';
import { ExerciseMathImpl, BinaryExpressionImpl, BinaryExpressionRender } from 'make-exercises-math';


export class PDFRouter {

    router: express.Router;

    get(req: express.Request, res: express.Response, next: express.NextFunction): void {
        const parameters = req.query;

        let doc = new PDFDocument({ 'size': [600, 840] });
        doc.font('Courier-Bold', 'Courier', 14);
        moment.locale('de');
        const datum = moment(new Date()).format('LL');

        let a = 1;
        doc.text('math exercises for Sienna Metzner, 3c');
        doc.text('(1) ' + datum);
        let y = 150;
        let x = 40;
        const ePromise = make.makeSet();
        ePromise.then(
            op => {
                const exc: ExerciseMathImpl = op;
                let row = a + ' ) ';
                doc.text(row, x, y);
                x += 40;
                for (let i = 0; i < 12; i++) {
                    const excR: string = exc[i].get()[0];
                    console.log("rendered exercise: " + excR);
                    doc.text(excR, x, y);
                    y += 40;
                }
                a++;
                x += 120;
                y = 150;
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


const pdfRoutes = new PDFRouter();
export default pdfRoutes.router;
