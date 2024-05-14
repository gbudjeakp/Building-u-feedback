require("dotenv").config();
const db = require("../Models/index");
const bcrypt = require("bcrypt");
const saltRounds = parseInt(process.env.SALT_ROUNDS);
const Users = db.User;
const Token = db.Otptoken;
const { tokenValidator } = require("./helpers/tokenValidator");
const { sendOTP } = require("../utility/email/email");
const updatepasswordValidator = require("../utility/inputValidator/updatepasswordValidator")

const sendToken = async (req, res) => {
  const { username } = req.body;

  const userInDB = await Users.findOne({ where: { username: username } });
  const userInTokenDB = await Token.findOne({ where: { username: username } });

  const otpGenerator = () => {
    const characters = "0123456789".split("");

    // Decided to use the Fisher-Yates shuffle algorithm
    // To get a better set of randomized values for OTP
    //Frankly speaking this might not have any impact on
    // an app like this but oh well --\(0-0)/-- might change in refactor
    for (let i = characters.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [characters[i], characters[j]] = [characters[j], characters[i]];
    }

    const shuffledOtpArray = characters.slice(0, 4);

    const generatedOtp = shuffledOtpArray.join("");

    return generatedOtp;
  };

  const otp = otpGenerator();

  const hashedOtp =  await bcrypt.hash(otp, saltRounds);
  const expiresAt = new Date();

  if (!userInDB) {
    return res.status(400).json({ msg: "User Does Not Exist" });
  }
  try {
    if (!userInTokenDB) {
      const saveData = {
        username: username,
        token: hashedOtp,
      };
      Token.create(saveData);
    } else {
      await userInTokenDB.update(
        {
          token: hashedOtp,
          expiresAt: new Date().setHours(expiresAt.getHours() + 1),
        },
        {
          where: {
            username: username,
          },
        }
      );
    }
    sendOTP(username, otp);
    res.status(200).json({ msg: `OTP was sent successfully to ${username}` });
  } catch (err) {
    res.status(500).json({
      error: "Internal Server Error, something happened while sending OTP",
    });
  }
};

const checkToken = async (req, res) => {
  try {
    const { username, resetToken } = req.body;
    const result = await tokenValidator(username, resetToken);
    res.status(result.success ? 200 : 400).json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "An error occurred" });
  }
};

const updatePassword = async (req, res) => {
  try {
    const { username, resetToken, newPassword } = req.body;
    const { errors, validationCheck } = updatepasswordValidator(req.body);
    
    const userInDB = await Users.findOne({ where: { username: username } });
    const userInTokenDB = await Token.findOne({ where: { username: username } });

    const isTokenAndUserValid = await tokenValidator(username, resetToken);

    const hashednewPassword = await bcrypt.hash(newPassword, saltRounds);


    if (!validationCheck) {
      res.status(400).json(errors);
      return;
    }
  

    if (isTokenAndUserValid.success) {
      await userInDB.update(
        { password: hashednewPassword },
        { where: { username: username } }
      ).then( async()=>{
        await userInTokenDB.destroy();
      });
      res.status(200).json({ msg: "Password has been successfully Changed" });
    } else {
      res.status(400).json({
        msg: "Cannot update your password due to invalid Token Please Request A new Token",
      });
    }
  } catch (err) {
    res.status(500).json({ msg: "Internal Server Error" });
  }
};

module.exports = {
  sendToken,
  updatePassword,
  checkToken,
};
