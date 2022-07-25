const router = require("express").Router();
const User = require("../models/user");
const Cryptojs = require("crypto-js");
const jwt = require("jsonwebtoken");

//register
router.post("/register", async function (req, response) {
  const user = req.body;

  if (!user.email) {
    return response.status(400).send({
      ok: false,
      error: "there is no email",
    });
  }
  if (!user.password) {
    return response.status(400).send({
      ok: false,
      error: "there is no password",
    });
  }
  const { password, ...others } = user;

  const newUser = new User({
    ...others,
    password: Cryptojs.AES.encrypt(
      user.password,
      process.env.PASS_SEC
    ).toString(),
  });

  await newUser.save((error, result) => {
    if (error) {
      return response.status(500).send({
        ok: false,
        error: error,
      });
    }
    return response.status(201).send(result);
  });
});

router.post("/login", async (req, response) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return response.status(404).send({
        ok: false,
        error: "user not found",
      });
    }

    const Pass = Cryptojs.AES.decrypt(
      user.password,
      process.env.PASS_SEC
    ).toString(Cryptojs.enc.Utf8);

    if (Pass !== req.body.password.toString()) {
      return response.status(401).send({
        ok: false,
        error: "bad credentials",
      });
    }

    const accessToken = jwt.sign(
      {
        id: user._id,
        rol: user.rol,
      },
      process.env.JWT_SEC,
      { expiresIn: "1d" }
    );

    const { password, ...others } = user._doc;

    response.status(200).json({ ...others, accessToken });
  } catch (err) {
    return response.status(500).send({
      ok: false,
      error: err,
    });
  }
});

module.exports = router;
