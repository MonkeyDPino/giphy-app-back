const router = require("express").Router();
const { verifyToken } = require("../middlewares/verifyToken");
const User = require("../models/user");

router.post("/fav", verifyToken, async function (req, res) {
  const { id } = req.body;

  if (!id) {
    return res.status(406).send({
      ok: false,
      error: "there is no id of fav",
    });
  }
  try {
    const userUpdated = await User.findOneAndUpdate(
      { _id: req.user.id },
      {
        $addToSet: {
          favs: { id: id },
        },
      },
      {
        new: true,
      }
    );
    return res.status(200).send(userUpdated);
  } catch (e) {
    return res.status(500).send({
      ok: false,
      error: e,
    });
  }
});

router.delete("/fav", verifyToken, async function (req, res) {
  const { id } = req.body;

  if (!id) {
    return res.status(406).send({
      ok: false,
      error: "there is no id of fav",
    });
  }

  try {
    const userUpdated = await User.findByIdAndUpdate(
      req.user.id,
      {
        $pull: {
          favs: { id: id },
        },
      },
      { new: true }
    );
    return res.status(200).send(userUpdated);
  } catch (e) {
    return res.status(500).send({
      ok: false,
      error: e,
    });
  }
});

router.get("/fav", verifyToken, async function (req, res) {
  try {
    const user = await User.findById(req.user.id);
    return res.status(200).send(user.favs);
  } catch (e) {
    return res.status(500).send({
      ok: false,
      error: e,
    });
  }
});

module.exports = router;
