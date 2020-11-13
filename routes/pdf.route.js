const express = require("express")
const router = express.Router()
const fetch = require("node-fetch")
const path = require("path");
const fs = require("fs");
const { PDFDocument } = require('pdf-lib')

router.post("/create", async (req, res) => {
    const { link_pdf, image_binary } = req.body;

    const existingPdfBytes = await fetch(link_pdf).then(res => res.arrayBuffer())

    try {
        fs.unlinkSync('./test_result.pdf');
    } catch (e) {

    }

    // Create a new PDFDocument
    const pdfDoc = await PDFDocument.load(existingPdfBytes);

    // Embed the JPG image bytes and PNG image bytes
    const image = await pdfDoc.embedPng(image_binary)

    // Get the width/height of the JPG image scaled down to 25% of its original size
    const jpgDims = image.scale(0.2)

    // Add a blank page to the document
    const page = pdfDoc.getPage(2)

    // Draw the JPG image in the center of the page
    page.drawImage(image, {
        x: 50,
        y: 100,
        width: jpgDims.width,
        height: jpgDims.height,
    })

    // Serialize the PDFDocument to bytes (a Uint8Array)
    const pdfBytes = await pdfDoc.save()
    const newFilePath = `${path.basename("./test.pdf", '.pdf')}-result.pdf`;
    fs.writeFileSync(newFilePath, pdfBytes);
    res.send({ message: 'hello world', data: newFilePath })
});

module.exports = router
