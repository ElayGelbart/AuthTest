const express = require("express");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const jwtSalt = "Salt4JWT"
const passSalt = "Salt4Pass"
const app = express();
app.use(express.json());

app.post("/users/register", (req, res, next) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    next({ status: 403, msg: "Problem with Data" })
    return;
  }
  const encryptPassword = crypto.createHash("sha256", passSalt).update(password).digest("hex");

  for (let user of USERS) {
    if (user.email === email) {
      next({ status: 409, msg: "user already exists" })
      return;
    }
  }
  res.status(201).send("Register Success");
  INFORMATION.push({ email: email, info: `${name} info` })
  USERS.push({ email, name, password: encryptPassword })
});

app.post("/users/login", (req, res, next) => {
  const { email, password } = req.body;
  if (email === true) {
    res.send({ accessToken, refreshToken, email, name, isAdmin });
  } else {
    next({ status: 403, msg: "User or Password incorrect" })
    return;
  }
})

app.post("/users/tokenValidate", (req, res, next) => {
  const AuthKey = req.headers["Authorization"].split(" ")[1];
  if (!AuthKey) {
    next({ status: 401, msg: "Access Token Required" })
    return;
  }
  else if (AuthKey === true) {
    res.send({ valid: true });
  }
  else if (AuthKey === false) {
    next({ status: 403, msg: "Invalid Access Token" })
    return;
  }
});

app.get("/api/v1/information", (req, res, next) => {
  const AuthKey = req.headers["Authorization"].split(" ")[1];
  if (!AuthKey) {
    next({ status: 401, msg: "Access Token Required" })
    return;
  }
  else if (AuthKey === true) {
    res.send({ email, info });

  }
  else if (AuthKey === false) {
    next({ status: 403, msg: "Invalid Access Token" })
    return;
  }
})

app.post("/users/token", (req, res, next) => {
  const refreshToken = req.body.token;
  if (!refreshToken) {
    next({ status: 401, msg: "Refresh Token Required" })
    return;
  }
  else if (AuthKey === true) {
    res.send({ email, info });

  }
  else if (AuthKey === false) {
    next({ status: 403, msg: "Invalid Refresh Token" })
    return;
  }
})

app.post("/users/logout", (req, res, next) => {
  const refreshToken = req.body.token;
  const someAction = req.body.what; // change this
  if (!refreshToken) {
    next({ status: 401, msg: "Refresh Token Required" })
    return;
  }
  else if (someAction === true) {
    res.send("User Logged Out Successfully").statusCode(200)
  }
  else if (someAction === false) {
    next({ status: 403, msg: "Invalid Refresh Token" })
    return;
  }
});

app.get("/api/v1/users", (req, res, next) => {
  const AuthKey = req.headers["Authorization"].split(" ")[1];
  if (!AuthKey) {
    next({ status: 401, msg: "Access Token Required" })
    return;
  }
  else if (AuthKey === true) {
    res.send({ USERS: [...[{ email, name, password, isAdmin }]] }).statusCode(200);

  }
  else if (AuthKey === false) {
    next({ status: 403, msg: "Invalid Access Token" })
    return;
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


app.use((err, req, res, next) => {
  if (err.status) {

  }
  res.status(404).send("unknown endpoint")
})

module.exports = app;

const USERS = []
const INFORMATION = []
const REFRESHTOKENS = []

const Admin = { email: "admin@email.com", name: "admin", password: crypto.createHash("sha256", passSalt).update("Rc123456!").digest("hex"), isAdmin: true };

const Adminpass = "Rc123456!";