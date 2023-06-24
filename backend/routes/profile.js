
const express = require("express");
const pool = require("../config");
const bcrypt = require('bcrypt');
const Joi = require('joi')


router = express.Router();

const passwordValidator = (value, helpers) => {
  if (value.length < 8) {
      throw new Joi.ValidationError('Password must contain at least 8 characters')
  }
  return value
}
const changeSchema = Joi.object({
  oldpw: Joi.string(),
  newpw: Joi.string().required().custom(passwordValidator)
}) 

router.get("/user/profileMe/:user_id", function(req, res, next) {
   
    const promise1 = pool.query("SELECT * FROM users WHERE user_id=?;", [req.params.user_id]);

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
router.post("/user/change/:user_id", async function(req, res, next) {
   
  // Begin transaction
    const conn = await pool.getConnection();
    await conn.beginTransaction();
    const [user] = await conn.query("SELECT password FROM users WHERE user_id=?;", [req.params.user_id]);
    if ((await bcrypt.compare(req.body.oldpw, user[0].password))) {

        try{
            await changeSchema.validateAsync(req.body,  { abortEarly: false })
        }catch(err){
            return res.status(400).json(err)
        }

        const new_password = await bcrypt.hash(req.body.newpw, 5)
        try {
          const [rows, fields] = await conn.query(
            "UPDATE users SET users.password = ? WHERE users.user_id=?", [
                new_password, req.params.user_id,
          ]);
    
        res.json({ rows : rows });
        await conn.commit();
        } catch (err) {
          console.log(err)
          await conn.rollback();
          return res.status(500).json(err);
        }finally {
          console.log("Success");
          conn.release();
        }
        // res.send("123")

    }
    else{
       res.send("123")
    }
});
exports.router = router;