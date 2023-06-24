const express = require("express");
const pool = require("../config");

router = express.Router();

router.get("/", function(req, res, next) {
   
  const promise1 = pool.query("SELECT * FROM users;");

  promise1.then((results) => {
          const [user] = results;
          console.log(results)
          res.json({
              user: user,
              error: null,
          });
      })
      .catch((err) => {
          return res.status(500).json(err);
      });
});

exports.router = router;