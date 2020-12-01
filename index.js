const express = require("express");
const bodyParser = require("body-parser");
const cors = require('cors')

const userRoute = require("./routes/pug.route");
const pdfRoute = require("./routes/pdf.route");
const metadataRoute = require("./routes/metadata.route");
const uploadRoute = require("./routes/upload.route");
const exportRoute = require("./routes/export.route");
const inviteUserRoute = require("./routes/inviteUser.route");

const app = express();

app.set("view engine", "pug");
app.set("views", "./views");
app.use(cors());
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true, parameterLimit: 50000 }));

app.get("/", (req, res) => {
    res.render("index");
});

app.use("/pugs", userRoute);
app.use("/pdf", pdfRoute);
app.use("/metadata", metadataRoute);
app.use("/upload", uploadRoute);
app.use("/export", exportRoute);
app.use("/invite", inviteUserRoute);


app.listen(3000);
