const express = require("express")
const router = express.Router()
const fs = require("fs");

router.post("/upload_file", async (req, res) => {
    const { imageBase64,functionName, fileName } = req.body;

    const fs = require("fs");
    const bitmap = Buffer.from(imageBase64, 'base64');
    fs.writeFileSync(`\\\\192.168.1.138\\cilc_app\\${functionName}\\${fileName}.jpg`, bitmap);

    res.send({ message: "done load image", data: "upload/example.jpg" })
});

module.exports = router
