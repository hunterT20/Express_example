const express = require("express")
const router = express.Router()
const axios = require("axios")


router.post("/invite_user", async (req, res) => {
    const { groupName, fullName, email, username } = req.body;

    try {
        const userAdmin = await axios.post("http://125.212.249.189:3000/api/v1/login", {
            user: "admin",
            password: "12345",
            code: "224610",
        })

        const userCreate = await axios.post("http://125.212.249.189:3000/api/v1/users.create", {
            "name": fullName,
            "email": email,
            "password": "imnotgonnatellyou",
            "username": username,
            sendWelcomeEmail: true,
            verified: true
        }, {
            headers: {
                "X-Auth-Token": userAdmin.data.data.authToken,
                "X-User-Id": userAdmin.data.data.userId,
            }
        })

        const allListGroup = await axios.get("http://125.212.249.189:3000/api/v1/groups.listAll", {
            headers: {
                "X-Auth-Token": userAdmin.data.data.authToken,
                "X-User-Id": userAdmin.data.data.userId,
            }
        });

        const findGroup = allListGroup.data.groups.find(item => item.name === groupName);

        const data = await axios.post("http://125.212.249.189:3000/api/v1/groups.invite", {
            "roomId": findGroup._id,
            "userId": userCreate.data.user._id
        }, {
            headers: {
                "X-Auth-Token": userAdmin.data.data.authToken,
                "X-User-Id": userAdmin.data.data.userId,
            }
        })
        res.send({ message: "Create an invite success!" })
    } catch (e) {
        console.log({ e: e.response })
        res.send({ message: e.response.data.message || e.response.data.error })
    }
});

module.exports = router
