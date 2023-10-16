const jwt = require("jsonwebtoken");
const User = require("../model/UserSchema");

const Authenticate = async (req, res, next) => {
  try {
    console.log("*******************");
    // console.log(req.cookies.jwttoken)
    const token = req.cookies.jwttoken;
    const verifyToken = jwt.verify(token, process.env.SECRET_KEY);
    // verifyToken me vo token h jo user ka aaya h verified wla

    const rootUser = await User.findOne({
      _id: verifyToken._id,
      "tokens.token": token,
    });
    // rootUser me user ka sara data aa gya..token authorize hone ke baad

    if (!rootUser) {
      throw new Error("User not found");
    }

    // storing these data in req...to be later used somewhere
    req.token = token;
    req.rootUser = rootUser;
    req.userID = rootUser._id;

    next();
  } catch (err) {
    res.status(401).send("Unauthorized:No token found");
    console.log(err);
  }
};

module.exports = Authenticate;
