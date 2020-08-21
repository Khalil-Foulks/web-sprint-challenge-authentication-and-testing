const router = require('express').Router();
const bcryptjs = require('bcryptjs');

const Users = require('../users/users-model');
const { isValid, signToken } = require("../users/users-service");

router.post('/register', (req, res) => {
  // implement registration
  const credentials = req.body;

  if(isValid(credentials)){
    const rounds = process.env.BCRYPT_ROUNDS || 8;

    const hash = bcryptjs.hashSync(credentials.password, rounds);

    credentials.password = hash;

    Users.add(credentials)
      .then(user => {
        res.status(201).json({ data: user })
      })
      .catch(error => {
        res.status(500).json({ message: error.message });
      });
  } else {
    res.status(400).json({
      message: "please provide username and password and the password should be alphanumeric",
    });
  }
});

router.post('/login', (req, res) => {
  // implement login
  const { username, password } = req.body;
  if(isValid(req.body)){
      Users.findBy({ username: username })
          .then(([user]) => {
              if(user && bcryptjs.compareSync(password, user.password)) {
                  const token = signToken(user)

                  res.status(200).json({ message: "welcome to the API", token });
              } else {
                  res.status(401).json({ message: "Invalid credentials"})
              }
          })
          .catch(error => {
              res.status(500).json({ message: error.message });
          });
  } else {
      res.status(400).json({
          message: "please provide username and password and the password shoud be alphanumeric",
      });
  }
});

module.exports = router;
