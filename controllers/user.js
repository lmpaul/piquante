const User = require('../models/User')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}


exports.signup = async (req, res, next) => {
  // creating a crypted password
  let hash

  try {
    hash = await bcrypt.hash(req.body.password, 10)
  } catch (error) {
    console.log(error)
    res.status(500).json({error})
  }

  // creating a user
  try {
    const user = new User({
      email: req.body.email,
      password: hash
    })
    await user.save()
    res.status(201).json({message: 'Utilisateur créé !'})
  } catch (error) {
    console.log(error)
    res.status(400).json({error})
  }
}

exports.login = async (req, res, next) => {
  let user
  let validPassword

  // checking if the user exists
  try {
    user = await User.findOne({email: req.body.email})
  } catch (error) {
    console.log(error)
    res.status(500).json({error})
  }

  // checking if the password is valid
  if (user) {
    try {
      validPassword = await bcrypt.compare(req.body.password, user.password)
    } catch (error) {
      console.log(error)
      res.status(500).json({error})
    }
  }


  // returning data to the client
  if (user === null || !validPassword) {
    res.status(401).json({message: 'Identifiant ou mot de passe incorrect.'})
  } else if (user && validPassword) {
    res.status(200).json({
          userId: user._id,
          token: jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET,
            { expiresIn: '24h'}
          )
        })
  }
}
