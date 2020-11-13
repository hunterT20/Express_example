const express = require("express")
const router = express.Router()
const axios = require("axios")


router.post("/create", async (req, res) => {

});

router.post("/detect-face", async (req, res) => {
    let data = "";
    req.on('data', function (chunk) {
        data += chunk;
    });
    req.on('end', function () {
        var axios = require('axios');

        var config = {
            method: 'post',
            url: 'https://chaileaseattendance.cognitiveservices.azure.com/face/v1.0/detect?returnFaceId=true&returnFaceLandmarks=false&recognitionModel=recognition_01&returnRecognitionModel=false&detectionModel=detection_01',
            headers: {
                'Ocp-Apim-Subscription-Key': 'da295688c31b43da9a1ed1b08614350a',
                'Content-Type': 'application/octet-stream'
            },
            data : data
        };

        axios(config)
            .then(function (response) {
                console.log(JSON.stringify(response.data));
            })
            .catch(function (error) {
                console.log(error.message);
            });
    });

});

module.exports = router
