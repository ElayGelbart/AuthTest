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
  INFORMATION.push({ email: email, info: `${name} info` })
  USERS.push({ email, name, password: encryptPassword })
  console.log("in end of register")
  res.status(201).send("Register Success");
});

app.post("/users/login", (req, res, next) => {
  const { email, password } = req.body;
  const userByEmail = USERS.find((user) => { return user.email === email });
  if (!userByEmail) {
    next({ status: 404, msg: "cannot find user" })
    return;
  }
  const encryptGivenPassword = crypto.createHash("sha256", passSalt).update(password).digest("hex")
  if (encryptGivenPassword === userByEmail.password) {
    const isAdmin = userByEmail.isAdmin || false;
    const name = userByEmail.name;
    const accessToken = jwt.sign(userByEmail, jwtSalt, { expiresIn: "10s" });
    const refreshToken = jwt.sign(userByEmail, jwtSalt, { expiresIn: "10m" });
    REFRESHTOKENS.push(refreshToken)
    console.log("end of login");
    res.send({ accessToken, refreshToken, email, name, isAdmin });
    return;
  } else {
    next({ status: 403, msg: "User or Password incorrect" })
    return;
  }
})

app.post("/users/tokenValidate", (req, res, next) => {
  const AuthKey = req.headers["authorization"].split(" ")[1];
  if (!AuthKey) {
    next({ status: 401, msg: "Access Token Required" })
    return;
  }
  const jwtObj = jwt.verify(AuthKey, jwtSalt)
  console.log("jwt Token", jwtObj);
  if (jwtObj) {
    res.send({ valid: true });
  }
  else {
    next({ status: 403, msg: "Invalid Access Token" })
    return;
  }
});

app.get("/api/v1/information", (req, res, next) => {
  const AuthKey = req.headers["authorization"].split(" ")[1];
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
  const AuthKey = req.headers["authorization"].split(" ")[1];
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
  res.setHeader("Allow", "OPTIONS, GET, POST");
  const endPointsArray = []
  endPointsArray.push(
    { method: "post", path: "/users/register", description: "Register, Required: email, name, password", example: { body: { email: "user@email.com", name: "user", password: "password" } } },
    { method: "post", path: "/users/login", description: "Login, Required: valid email and password", example: { body: { email: "user@email.com", password: "password" } } }
  )

  if (!req.headers["authorization"]) {
    res.send(endPointsArray);
    return;
  }
  endPointsArray.push(
    { method: "post", path: "/users/token", description: "Renew access token, Required: valid refresh token", example: { headers: { token: "\*Refresh Token\*" } } }
  )
  const AuthKey = req.headers["authorization"].split(" ")[1];
  try {
    jwt.verify(AuthKey, jwtSalt)
  } catch (err) {
    console.log("in catchhhh! @#@#")
    res.send(endPointsArray);
    return;
  }

  const JWTobj = jwt.verify(AuthKey, jwtSalt);
  if (!JWTobj) {
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
      { method: "get", path: "api/v1/users", description: "Get users DB, Required: Valid access token of admin user", example: { headers: { Authorization: "Bearer \*Access Token\*" } } }
    )
  }
  res.send(endPointsArray)
  return;
})


app.use((err, req, res, next) => {
  if (err.status) {
    console.log("spec error");
    res.status(err.status).send(err.msg)
    return;
  }
  console.log("general error");
  res.status(444).send("unknown endpoint")
})

module.exports = app;

const USERS = [{ email: "admin@email.com", name: "admin", password: crypto.createHash("sha256", passSalt).update("Rc123456!").digest("hex"), isAdmin: true }]
const INFORMATION = [{ email: "admin@email.com", info: `admin info` }]
const REFRESHTOKENS = []

const Admin = { email: "admin@email.com", name: "admin", password: crypto.createHash("sha256", passSalt).update("Rc123456!").digest("hex"), isAdmin: true };

const Adminpass = "Rc123456!";