require("dotenv").config();
const db = require("../Models/index");
const bcrypt = require("bcrypt");
const cookie = require("cookie");
const jwt = require("jsonwebtoken");
const saltRounds = parseInt(process.env.SALT_ROUNDS);
const Users = db.User;
const ExerciseInfo = db.ExerciseInfo;
const FeedbackRequest = db.FeedbackRequest;
const Feedbacks = db.Feedbacks;
const admins = require('../admin.json');
const { mentors } = admins;
const loginValidator = require("../utility/inputValidator/loginValidator");
const registerValidator = require("../utility/inputValidator/registerValidator");


//Allows users to register to the app
const registerUser = async (req, res) => {
  const { fName, userName, password } = req.body;
  const { errors, validationCheck } = registerValidator(req.body);
  const isUserExist = await Users.findOne({ where: { username: userName } });
  const isUserMentor = mentors.includes(userName);

  // This checks that the inputs entered meet some criteria
  if (!validationCheck) {
    res.status(400).json(errors);
    return;
  }

  try {
    ////////Checking if the entered username already exists in our DB
    if (isUserExist) {
      return res
        .status(400)
        .json({ error: "The email entered already exists" });
    }

    // Hash the password
    // Ideally adding a callback in the hash is best practice
    //Might add callback as code
    const hashedPassword =  await bcrypt.hash(password, saltRounds);
    const userData = {
      fName: fName,
      username: userName,
      password: hashedPassword,
      mentor: isUserMentor,
    };

    await Users.create(userData);

    //// So we can login immediately after registering,////////
    /////////////////////////////////////////////////
    const user = await Users.findOne({ where: { username: userName } });
    if (user) {
      const payload = {
        id: user.id,
        username: user.username,
        fName: user.fName,
      };
      const token = jwt.sign(payload, process.env.JWT_SECRET);
      res.set(
        "Set-Cookie",
        cookie.serialize("authToken", token, {
          httpOnly: true,
          secure: true,
          sameSite: "None",
          maxAge: 3600,
          path: "/",
        })
      );
      return res
        .status(201)
        .json({ message: "User Added Successfully", user: user });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

//This allows a user to login, into our application
const loginUser = async (req, res) => { 
  try {
    const { userName, password } = req.body;
    const { errors, validationCheck } = loginValidator(req.body);
    const user = await Users.findOne({ where: { username: userName } });

    if (!validationCheck) {
      res.status(400).json(errors);
    }

    if (!user) {
      return res
        .status(400)
        .json({ msg: "User Does Not Exist please create account" });
    }

    const hashPassword = await user.password;

    bcrypt.compare(password, hashPassword, (err, passwordIsCorrect) => {
      if (passwordIsCorrect) {
        const payload = { id: user.id, username: user.username };

        const token = jwt.sign(payload, process.env.JWT_SECRET);
        res.set(
          "Set-Cookie",
          cookie.serialize("authToken", token, {
            httpOnly: true,
            secure: true,
            sameSite: "None",
            maxAge: 3600,
            path: "/",
          })
        );
        res.cookie;
        res.status(200).json({ message: "User is Logged In", user: user });
      } else {
        console.error(err);
        res.status(400).json({ password: "Password is incorrect" });
      }
    });
  } catch (err) {
    console.error(err);
  }
};

//This logs the user out the app by removing the
//Users token
const logout = (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: true,
    sameSite: "None",
    path: "/",
  });
  res.status(200).json({ msg: "User was Logged Out Successfully" });
  return;
};

// This feeds the auth wrapper on the fron-end letting
// the app know whether or not a user is logged in.
const authorized = (req, res) => {
  return res.json({ user: res.locals.user });
};

// This lets us update a users account information everywhere
const updateAccount = async (req, res) => {
  const { authToken } = req.cookies;
  const { fName, username, oldPassword, newPassword } = req.body; 
  const { id } = jwt.verify(authToken, process.env.JWT_SECRET);
  const isUserExist = await Users.findOne({ where: { id: id } });

  try {
    if (!isUserExist) {
      return res.json({msg: 'User does not exist'});
    }

    const updates = {}; 
    if (fName && fName !== isUserExist.fName) {
      updates.fName = fName;
    }

    if (username && username !== isUserExist.username) {
      updates.username = username;
    }
  

    if (oldPassword && newPassword) {
      const passwordIsCorrect = await bcrypt.compare(oldPassword, isUserExist.password);
      if (!passwordIsCorrect) {
        return res.status(400).json({ msg: 'Old password is incorrect' });
      }
      if (oldPassword === newPassword) {
        return res.status(400).json({ msg: 'Old password cannot be same as new password' });
      }
      updates.password = bcrypt.hash(newPassword, saltRounds);
    }

    await isUserExist.update(updates);

    // Since the full name is used in different tables and is called different names across tables, we are simply updating them below.
    if (fName) {
      await FeedbackRequest.update({ studentName: fName }, { where: { userId: id } });
      await FeedbackRequest.update({ mentorId: id }, { where: { whoisAssigned: fName } });

      await ExerciseInfo.update({ internName: fName }, { where: { userId: id } });
      await Feedbacks.update({ mentorName: fName }, { where: { userId: id } });
    }

    return res.json({ msg: "Account details have successfully been updated" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Internal server error" });
  }
};


const getAllExerciseInfo = async (req, res) => {
  try {
    const exerciseInfos = await db.ExerciseInfo.findAll();

    res.status(200).json({ data: exerciseInfos });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
};


module.exports = {
  authorized,
  registerUser,
  loginUser,
  logout,
  updateAccount,
  getAllExerciseInfo,
};
