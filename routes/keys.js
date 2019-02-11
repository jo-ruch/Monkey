var express = require('express');
var router = express.Router();
let crypto = require('crypto');
let Monky = require('./../models/monky');

router.get('/', function (req, res, next) {
  res.send("No key provided");
});

router.get('/generate', function (req, res, next) {
  crypto.randomBytes(32, function(err, buffer) {
    key = buffer.toString('hex');
  });
  let entry = new Monky.key();
  entry.profiles.push(
      {
        name: "users",
        content: [
          {
            name: "id",
            type: "id"
          },
          {
            name: "username",
            type: "string"
          },
          {
            name: "email",
            type: "string"
          }
        ]
      });

  entry.profiles.push(
      {
        name: "posts",
        content: [
          {
            name: "id",
            type: "id"
          },
          {
            name: "ltb",
            type: "id"
          }
        ]
      });
  entry.save(function (err, monky) {
    if(err) return;
    res.send(monky);
  });
});

router.get('/:uuid', function(req, res, next) {
    let id = req.params.uuid;

    if (id.match(/^[0-9a-fA-F]{24}$/)) {
        Monky.key.findById(id, '').exec(function (err, monky) {
            if (err) {
                console.log(err);
                return;
            }
            if (monky !== null) {
                res.send(monky);
            } else {
                res.send("Key does not exist");
            }
        });
    } else {
        res.status(500);
        res.send("Not a valid uuid");
    }
});

module.exports = router;
