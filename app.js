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
  if (!AuthKey) {
    res.send("Access Token Required").statusCode(401)
  }
  else if (AuthKey === true) {
    res.send({ valid: true }).statusCode(200);
  }
  else if (AuthKey === false) {
    res.send("Invalid Access Token").statusCode(403);
  }
});

app.get("/api/v1/information", (req, res, next) => {
  const AuthKey = req.headers["Authorization"].split(" ")[1];
  if (!AuthKey) {
    res.send("Access Token Required").statusCode(401)
  }
  else if (AuthKey === true) {
    res.send({ email, info }).statusCode(200);

  }
  else if (AuthKey === false) {
    res.send("Invalid Access Token").statusCode(403);
  }
})

app.post("/users/token", (req, res, next) => {
  const refreshToken = req.body.token;
  if (!refreshToken) {
    res.send("Refresh Token Required").statusCode(401)
  }
  else if (AuthKey === true) {
    res.send({ email, info }).statusCode(200);

  }
  else if (AuthKey === false) {
    res.send("Invalid Refresh Token").statusCode(403);
  }
})

app.post("/users/logout", (req, res, next) => {
  const refreshToken = req.body.token;
  const someAction = req.body.what; // change this
  if (!refreshToken) {
    res.send("Refresh Token Required").statusCode(400)
  }
  else if (someAction === true) {
    res.send("User Logged Out Successfully").statusCode(200)
  }
  else if (someAction === false) {
    res.send("Invalid Refresh Token").statusCode(400);
  }
});

app.get("/api/v1/users", (req, res, next) => {
  const AuthKey = req.headers["Authorization"].split(" ")[1];
  if (!AuthKey) {
    res.send("Access Token Required").statusCode(401)
  }
  else if (AuthKey === true) {
    res.send({ USERS: [...[{ email, name, password, isAdmin }]] }).statusCode(200);

  }
  else if (AuthKey === false) {
    res.send("Invalid Access Token").statusCode(403);
  }
});

app.options("/", (req, res, next) => {
  const AuthKey = req.headers["Authorization"].split(" ")[1];
  const endPointsArray = []
  res.setHeader("Allow", "OPTIONS, GET, POST");
  endPointsArray.push(
    { method: "post", path: "/users/register", description: "Register, Required: email, name, password", example: { body: { email: "user@email.com", name: "user", password: "password" } } },
    { method: "post", path: "/users/login", description: "Login, Required: valid email and password", example: { body: { email: "user@email.com", password: "password" } } }
  )
  if (!AuthKey) {
    res.send(endPointsArray);
    return;
  }
  endPointsArray.push(
    { method: "post", path: "/users/token", description: "Renew access token, Required: valid refresh token", example: { headers: { token: "\*Refresh Token\*" } } }
  )
  const JWTobj = AuthKey.jwt();
  if (AuthKey == false) {
    res.send(endPointsArray);
    return;
  }
  endPointsArray.push(
    { method: "post", path: "/users/tokenValidate", description: "Access Token Validation, Required: valid access token", example: { headers: { Authorization: "Bearer \*Access Token\*" } } },
    { method: "get", path: "/api/v1/information", description: "Access user's information, Required: valid access token", example: { headers: { Authorization: "Bearer \*Access Token\*" } } },
    { method: "post", path: "/users/logout", description: "Logout, Required: access token", example: { body: { token: "\*Refresh Token\*" } } },
  )
  if (JWTobj.isAdmin === true) {
    endPointsArray.push(
      { method: "get", path: "api/v1/users", description: "Get users DB, Required: Valid access token of admin user", example: { headers: { authorization: "Bearer \*Access Token\*" } } }
    )
  }
  res.send(endPointsArray)
})


const USERS = [...{ email, name, password, isAdmin }],
const INFORMATION = [...{ email, info }]
const REFRESHTOKENS = []

const Admin = { email: "admin@email.com", name: "admin", password: "**hashed password**", isAdmin: true };

const Adminpass = "Rc123456!";