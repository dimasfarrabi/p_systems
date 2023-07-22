const db = require("../models");
const config = require("../config/auth.config");
let configure = require("../config/db_configure");
const User = db.user;
const Role = db.role;
let mysqli = require('mysql');

exports.allAccess = (req, res) => {
  res.status(200).send("Public Content.");
};

exports.userBoard = (req, res) => {
  User.findOne({
    where: {
      id: res.req.userId
    }
  })
  .then(user => {
    var authorities = [];
    user.getRoles().then(roles => {
      for (let i = 0; i < roles.length; i++) {
        authorities.push("ROLE_" + roles[i].name.toUpperCase());
      }
      res.status(200).send({
        id: user.id,
        username: user.username,
        email: user.email,
        roles: authorities
      });
    });
  })
};

exports.adminBoard = (req, res) => {
  res.status(200).send("Admin Content.");
};

exports.moderatorBoard = (req, res) => {
  res.status(200).send("Moderator Content.");
};
