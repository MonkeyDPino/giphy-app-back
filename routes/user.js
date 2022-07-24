const router = require("express").Router();
const {
    verifyToken
} = require("../middlewares/verifyToken");
const User = require("../models/user")

router.post("/fav", verifyToken, function (req, res) {
    const { id } = req.body

    if (!id) {
        return res.status(406).send({
            ok: false,
            error: "there is no id of fav"
        })
    }
    try {
        const userUpdated = await User.updateOne(
            { _id: req.user.id },
            {
                $addToSet: {
                    favs: { id: id },
                },
            },
            {
                new: true 
            }
        );
        return res.status(200).send(userUpdated)
    } catch (e) {
        return res.status(500).send({
            ok: false,
            error: e
        })
    }
})