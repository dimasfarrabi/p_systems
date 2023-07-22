const db = require("../models");
const config = require("../config/auth.config");
let configure = require("../config/db_configure");
const User = db.user;
const Role = db.role;
let mysqli = require('mysql');
const Op = db.Sequelize.Op;

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");

exports.signup = (req, res) => {
  User.create({
    username: req.body.username,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, 8)
  })
    .then(user => {
      if (req.body.roles) {
        Role.findAll({
          where: {
            name: {
              [Op.or]: req.body.roles
            }
          }
        }).then(roles => {
          user.setRoles(roles).then(() => {
            res.send({ message: "User registered successfully!" });
          });
        });
      } else {
        // user role = 1
        user.setRoles([1]).then(() => {
          res.send({ message: "User registered successfully!" });
        });
      }
    })
    .catch(err => {
      res.status(500).send({ message: err.message });
    });
};

exports.signin = (req, res) => {
  User.findOne({
    where: {
      username: req.body.username
    }
  })
    .then(user => {
      if (!user) {
        return res.status(404).send({ message: "User Not found." });
      }

      var passwordIsValid = bcrypt.compareSync(
        req.body.password,
        user.password
      );

      if (!passwordIsValid) {
        return res.status(401).send({
          accessToken: null,
          message: "Invalid Password!"
        });
      }

      var token = jwt.sign({ id: user.id }, config.secret, {
        expiresIn: 86400 // 24 hours
      });

      var authorities = [];
      user.getRoles().then(roles => {
        for (let i = 0; i < roles.length; i++) {
          authorities.push("ROLE_" + roles[i].name.toUpperCase());
        }
        res.status(200).send({
          id: user.id,
          username: user.username,
          email: user.email,
          roles: authorities,
          accessToken: token
        });
      });
    })
    .catch(err => {
      res.status(500).send({ message: err.message });
    });
};
exports.update = (req,res) => {
  User.findOne({
    where: {
      id: req.body.id
    }
  })
  .then(user => {
    if (!user) {
      return res.status(404).send({ message: "User Not found." });
    }
    var sql = "UPDATE users SET username = '"+req.body.username+"', email = '"+req.body.email+"' WHERE id = '"+req.body.id+"'";
    let connection = mysqli.createConnection(configure);
    connection.query(sql, (error, results) => {
      if (error){
        res.status(500).send({ message: error.message });
      }
      console.log('Rows affected:', results.affectedRows);
      res.status(200).send({ message: "Updated!" });
    });
    
    connection.end();
  })
};
exports.passupdate = (req,res) => {
  User.findOne({
    where: {
      id: req.body.id
    }
  })
  .then(user => {
    if (!user) {
      return res.status(404).send({ message: "User Not found." });
    }
    var PwdCheck = bcrypt.compareSync(
      req.body.oldpassword,
      user.password
    );
    if (!PwdCheck) {
      return res.status(404).send({ message: "Old password is not valid" });
    }
    else{
      var sql = "UPDATE users SET password = '"+bcrypt.hashSync(req.body.newpassword, 8)+"' WHERE id = '"+req.body.id+"'";
      let connection = mysqli.createConnection(configure);
      connection.query(sql, (error, results) => {
        if (error){
          res.status(500).send({ message: error.message });
        }
        console.log('Rows affected:', results.affectedRows);
        res.status(200).send({ message: "Updated!" });
      });
    }
    connection.end();
  })
};