const express = require("express");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");

const app = express();
app.use(express.json());

app.post("/users/register", (req, res, next) => {
  const { name, email, password } = req.body;
  if (/*Sucssued*/true) {
    res.send("Register Success").statusCode(201);
    INFORMATION.push({ email: email, info: `${name} info` })
  }
  else {
    res.send("user already exists").statusCode(409)
  }
});

app.post("/users/login", (req, res, next) => {
  const { email, password } = req.body;
  if (email === true) {
    res.send({ accessToken, refreshToken, email, name, isAdmin }).statusCode(200);
  } else {
    res.send("User or Password incorrect").statusCode(403)
  }
})

app.post("/users/tokenValidate", (req, res, next) => {
  const AuthKey = req.headers["Authorization"].split(" ")[1];
})


const USERS = [...{ email, name, password, isAdmin }],
const INFORMATION = [...{ email, info }]
const REFRESHTOKENS = []

const Admin = { email: "admin@email.com", name: "admin", password: "**hashed password**", isAdmin: true };

const Adminpass = "Rc123456!";