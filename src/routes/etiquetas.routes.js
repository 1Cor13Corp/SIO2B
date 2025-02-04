const express = require('express');

const {DocumentDefinition, Table, Cell, Txt, Img, Stack, QR} = require('pdfmake-wrapper/server');
const Pdfmake = require('pdfmake');
const fs = require('fs')
const path = require('path');
const printer = require('@thiagoelg/node-printer');


const {getDefaultPrinter, print } = require('pdf-to-printer')



const app = express();


app.post('/api/etiqueta-preparacion', (req,res)=>{
    
    let body = req.body;
    
    let formulas = []
    let a = [...body.formula]
    let b = [...a]
    
    
    async function ImprimirPDF(n){
        
        
        const printer = new Pdfmake({
            Roboto: {
                normal: __dirname + '/fonts/Roboto/Roboto-Regular.ttf',
                bold: __dirname + '/fonts/Roboto/Roboto-Medium.ttf',
                italics: __dirname + '/fonts/Roboto/Roboto-Italic.ttf',
                bolditalics: __dirname + '/fonts/Roboto/Roboto-MediumItalic.ttf'
            }
        });
        
        // PdfMakeWrapper.useFont('BarlowCondensed');
        
        const doc = new DocumentDefinition();
        doc.pageOrientation('landscape');
        doc.pageMargins([ 10, 10 ]);
        
        const imagePath = path.join(__dirname, '..', 'assets', 'Logo-etiquetas.png');
        
        
        for(let i=0;i<n;i++){
            doc.add(
                new Table([
                    [
                        new Cell(
                            await new Img(imagePath, true).width(250).margin([0,-13,0,0]).build()
                        ).end,
                        new Cell(
                            new Txt(`TINTA PREPARADA`).alignment('center').margin([0,20,0,0]).bold().fontSize(55).end,
                        ).end,
                    ]
                ]).widths(['30%','70%']).layout('noBorders').end
            )
    
            doc.add(
                new Table([
                    [
                        new Cell(
                            new Txt(`Nombre de la tinta`).alignment('center').bold().fontSize(18).end,
                        ).fillColor('#000000').color('#FFFFFF').border([true,true,true,false]).end,
                        new Cell(
                            new Txt(`Lote Nº`).alignment('center').bold().fontSize(18).end,
                        ).fillColor('#000000').color('#FFFFFF').border([true,true,true,false]).end,
                        new Cell(
                            new Txt(`Fecha de preparación`).alignment('center').bold().fontSize(18).end,
                        ).fillColor('#000000').color('#FFFFFF').border([true,true,true,false]).end,  
                    ]
                ]).widths(['33%','33%','33%']).end
            )
            doc.add(
                new Table([
                    [
                        new Cell(
                            new Txt(`${body.nombre}`).margin([0, 15,0,0]).alignment('center').fontSize(30).end,
                        ).border([true,false,true,true]).end,
                        new Cell(
                            new Txt(`${body.lote}`).alignment('center').bold().fontSize(55).end,
                        ).border([true,false,true,true]).end,
                        new Cell(
                            new Txt(`${body.preparacion}`).margin([0, 15,0,0]).alignment('center').fontSize(30).end,
                        ).border([true,false,true,true]).end,  
                    ]
                ]).widths(['33%','33%','33%']).end
            )
    
    
            doc.add(
                new Table([
                    [
                        new Cell(
                            new Txt(`Preparado por:`).alignment('center').bold().fontSize(18).end,
                        ).fillColor('#000000').color('#FFFFFF').border([true,true,true,false]).end,
                        new Cell(
                            new Txt(`Nº de asignación`).alignment('center').bold().fontSize(18).end,
                        ).fillColor('#000000').color('#FFFFFF').border([true,true,true,false]).end,
                        new Cell(
                            new Txt(`Envase`).alignment('center').bold().fontSize(18).end,
                        ).fillColor('#000000').color('#FFFFFF').border([true,true,true,false]).end,  
                    ]
                ]).widths(['33%','33%','33%']).end
            )
            doc.add(
                new Table([
                    [
                        new Cell(
                            new Txt(`${body.empleado}`).margin([0, 15,0,0]).alignment('center').fontSize(30).end,
                        ).border([true,false,true,true]).end,
                        new Cell(
                            new Txt(`AL-ASG-003047`).margin([0, 15,0,0]).alignment('center').fontSize(30).end,
                        ).border([true,false,true,true]).end,
                        new Cell(
                            new Txt(`Nº ${i+1}`).alignment('center').bold().fontSize(55).end,
                        ).border([true,false,true,true]).end,  
                    ]
                ]).widths(['33%','33%','33%']).end
            )

            doc.add(
                new Table([
                    [
                        new Cell(
                            new Txt(`Formulación`).alignment('center').bold().fontSize(18).end,
                        ).fillColor('#000000').color('#FFFFFF').border([true,true,true,false]).end,
                        new Cell(
                            new Txt(`Peso`).alignment('center').bold().fontSize(18).end,
                        ).fillColor('#000000').color('#FFFFFF').border([true,true,true,false]).end,
                    ]
                ]).widths(['66.5%','33%']).end
            )
            if(i === 0){
                doc.add(
                    new Table([
                        [
                            new Cell(
                                new Stack(a).fontSize(18).end,
                            ).border([true,false,true,true]).end,
                            new Cell(
                                new Txt(`${body.pesos[i]} Kg`).margin([0, 20,0,0]).alignment('center').bold().fontSize(55).end,
                            ).border([true,false,true,true]).end,
                        ]
                    ]).widths(['66.5%','33%']).end
                )

            }else{
                doc.add(
                    new Table([
                        [
                            new Cell(
                                new Stack(b).fontSize(18).end,
                            ).border([true,false,true,true]).end,
                            new Cell(
                                new Txt(`${body.pesos[i]} Kg`).margin([0, 20,0,0]).alignment('center').bold().fontSize(55).end,
                            ).border([true,false,true,true]).end,
                        ]
                    ]).widths(['66.5%','33%']).end
                )
            }

                if(i < (n-1)){
                    b = [...body.formula]
                    doc.add(
                        new Txt('').pageBreak('after').end
                    )
                }
        }

        const pdf = printer.createPdfKitDocument(doc.getDefinition());
        
        pdf.pipe(fs.createWriteStream('documento_test.pdf'));
        pdf.end();
    }
    ImprimirPDF(body.pesos.length);

    // const options = {
    //     printer: `${printer.getDefaultPrinterName()}`,
    //     scale: "fit",
    //     paperSize:'Tag',
    //     orientation : 'portrait',
    //     copies:1
    //     // copies:84
    // };

    
    // // //console.log(printer.getDefaultPrinterName())
    // // getDefaultPrinter().then(//console.log)
    // setTimeout(() => {
    //     print("C:/Users/Administrador.POLINDUSTRIAL/Desktop/SIO_2.0_Node/documento_test.pdf", options)
    //     .then(console.log('SE REALIZÓ LA IMPRESION DE LA ETIQUETA...'))
    //     .catch(console.log);
    //     //
    //     // res.json('ok')
    // },2000);
    
    res.json({message:'Se imprimió la etiqueta'})

});




module.exports = app;