const User = require('../model/userModel')
const bcrypt = require('bcrypt')


module.exports.register = async(req, res, next) => {
    try {
        const { username, email, password } = req.body;
        const usernameCheck = await User.findOne({ username })

        if (usernameCheck)
            return res.json({ msg: "Username already used", status: false })

        const emailCheck = await User.findOne({ email })
        if (emailCheck)
            return res.json({ msg: "Email already used", status: false })

        const hassedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({
            email,
            username,
            password: hassedPassword,
        })
        delete user.password;
        return res.json({ msg: "User successfully created", status: true, user })
    } catch (error) {
        next(error)
    }
}

module.exports.login = async(req, res, next) => {
    try {
        const { username, password } = req.body;
        const usernameCheck = await User.findOne({ username })

        if (!usernameCheck)
            return res.json({ msg: "Username not found", status: false })
            
        const isPasswordValid = await bcrypt.compare(password, usernameCheck.password);
        if (!isPasswordValid)
            return res.json({ msg: "Incorect username or password", status: false })

        delete usernameCheck.password;
        return res.json({ msg: "Login success", status: true, user: usernameCheck })
    } catch (error) {
        next(error)
    }
}

module.exports.setAvatar = async(req, res, next) => {
    try {
        const userId = req.params.id;
        const avatarImage = req.body.image;

        const userData = await User.findByIdAndUpdate(userId, {
            isAvatarImageSet: true,
            avatarImage
        })
        return res.json({ msg:"set image successfully",
            isSet: userData.isAvatarImageSet,
            image: userData.avatarImage,
            status:true
        })
    } catch (error) {
        next(error)
    }
}

module.exports.getAllUsers = async(req, res, next) => {
    try {
        console.log(req.params.id)
        const users = await User.find({_id:{$ne:req.params.id}}).select([
            "email",
            "username",
            "avatarImage",
            "_id",
        ])
        res.json({ msg:"get all users",users: users })
    } catch (error) {
        next(error)
    }
}

module.exports.logOut = (req, res, next) => {
    try {
      if (!req.params.id) return res.json({ msg: "User id is required " });
    //   onlineUsers.delete(req.params.id);
      return res.status(200).send();
    } catch (ex) {
      next(ex);
    }
  };