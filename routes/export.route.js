const express = require("express")
const router = express.Router()
const fs = require("fs");
const cors = require("cors")({ origin: true });
const jsonFiles = require("../exports/jsons/firebaseReportCustomer.json")

const convertUnixTimeChart = (UNIX_TIMESTAMP) => {
    const a = new Date(UNIX_TIMESTAMP * 1000);
    const months = [
        "01",
        "02",
        "03",
        "04",
        "05",
        "06",
        "07",
        "08",
        "09",
        "10",
        "11",
        "12",
    ];
    const days = [
        "Chủ nhật",
        "Thứ 2",
        "Thứ 3",
        "Thứ 4",
        "Thứ 5",
        "Thứ 6",
        "Thứ 7",
    ];
    const year = a.getFullYear();
    const month = months[a.getMonth()];
    const date = a.getDate();
    const day = days[a.getDay()];
    const hour = a.getHours();
    const min = a.getMinutes();

    const time = `${zeroFill(date, 2)}/${month}/${year}`;
    return { year, month: a.getMonth(), date, day, time };
};

const zeroFill = (n, p, c) => {
    const PAD_CHAR = typeof c !== "undefined" ? c : "0";
    const pad = new Array(1 + p).join(PAD_CHAR);
    const str = `${(pad + n).slice(-pad.length)}`;
    return str;
};

router.get("/read_file", (req, res) => {
    const trackingLogs = jsonFiles.filter(file => new Date(file.time.seconds * 1000).getMonth() + 1 === 9);

    const listUserFirstOpen = Object.entries(
        trackingLogs.filter((trackingItem) => trackingItem.event === "first_open")
    )

    const listUserOpenApp = Object.entries(
        trackingLogs.filter((trackingItem) => trackingItem.event === "open_app")
    )

    const listUserLogin = Object.entries(
        trackingLogs.filter((trackingItem) =>
            trackingItem.event === "press_button"
            && trackingItem.screen.class === "LoginScreen"
        )
    )

    const listUserNameLogin = Object.entries(
        trackingLogs.filter((trackingItem) =>
            trackingItem.event === "press_button"
            && trackingItem.screen.class === "LoginScreen"
        ).reduce((r, a) => {
            r[a.user.EMP_NM] = [
                ...(r[a.screen.class] ||
                    []),
                a,
            ];
            return r;
        }, {})
    ).map((item, index) => ({
        name: `${item[0]} - ${item[1][0].user.EMP_NO.trim()}`,
    }))

    const listScreenView = Object.entries(
        trackingLogs.filter((trackingItem) =>
            trackingItem.event === "screen_view"
        ).reduce((r, a) => {
            r[a.screen.class] = [
                ...(r[a.screen.class] ||
                    []),
                a,
            ];
            return r;
        }, {})
    ).map((item, index) => ({
        name: `${item[0]} - ${item[1].length}`,
    }))

    res.send({
        message: "Done",
        first_open: listUserFirstOpen.length,
        total_open: listUserOpenApp.length,
        total_login: listUserLogin.length,
        listUserNameLogin,
        totalUserLogin: listUserNameLogin.length,
        listScreenView,
    })
});


router.post("/export_file", async (req, res) => {
    cors(req, res, async () => {
        const { listDataReport } = req.body;

        fs.writeFileSync(`./exports/jsons/firebaseReportCustomer.json`, JSON.stringify(listDataReport));
        res.set("Access-Control-Allow-Origin", "*");
        res.send({ message: "done export data", data: "upload/firebaseReportCustomer.json" })
    })
});

module.exports = router
