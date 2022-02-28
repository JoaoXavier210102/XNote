const express = require('express');
const bcrypt = require("bcrypt");
const User = require('../models/user');
const router = express.Router();
const jwt = require("jsonwebtoken");
require("dotenv").config();

router.post("/register", async (req, res) => {

  const { name, email, password } = req.body;

  try {

    if(await User.findOne({email})){
      return res.status(400).json({ message: "User already created"});
    }

    bcrypt.hash(password, 10, async (error, hash) => {

      if(error){
        return res.status(400).json({message: "Failed a create the hash of user"})
      }

      let userCreate = {
        name,
        email,
        password: hash
      };

      const user = await User.create(userCreate);

      user.password = undefined

      res.status(201).json(user);

    })

  } catch (error){
    return res.status(400).json({
      message: "Failed a create the new user",
      error
    })
  }

});

router.post("/login", async (req, res) => {

  const {email, password} = req.body;

  const secret = process.env.SECRET;

  try {

    const user = await User.findOne({ email })
    
    if(!user){
      return res.status(401).json({ message: "User doesn't exist"});
    }

    if(!await bcrypt.compare(password, user.password)){
      return res.status(401).json({ message: "Invalid password"});
    }

    user.password = undefined;
    
    const token = jwt.sign({email}, secret, {expiresIn: 86400});

    res.status(200).json({user, token});

  } catch (error) {
    return res.status(400).json({
      message: "Failed a login of user",
      error
    })
  }
})


module.exports = router;
