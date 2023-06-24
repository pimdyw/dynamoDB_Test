const express = require("express")
const pool = require("../config")
const Joi = require('joi')
const bcrypt = require('bcrypt');
const { isLoggedIn } = require('../middlewares')
const { generateToken } = require("../utils/token");
const passwordValidator = (value, helpers) => {
    if (value.length < 8) {
        throw new Joi.ValidationError('Password must contain at least 8 characters')
    }
    return value
}
const usernameValidator = async (value, helpers) => {
      const [rows, _] = await pool.query(
        "SELECT username FROM users WHERE username = ?", 
        [value]
      )
      if (rows.length < 0) {
          const message = 'This user is already taken'
          throw new Joi.ValidationError(message, { message })
      }
      return value
    }
const signupSchema = Joi.object({
   first_name: Joi.string().required().max(150),
   last_name: Joi.string().required().max(100),
   email: Joi.string().email().required().max(100),
   mobile: Joi.string().required().pattern(/0[0-9]{9}/),
   password: Joi.string().required().custom(passwordValidator),
   confirm_password: Joi.string().required().equal(Joi.ref('password')),
   username: Joi.string().required().min(5).external(usernameValidator),
}) 
router = express.Router();

    router.post('/user/signup', async (req, res, next) => {
        try{
           await signupSchema.validateAsync(req.body,  { abortEarly: false })
        }catch(err){
           return res.status(400).json(err)
        }
       //  res.send('ok')
       const conn = await pool.getConnection()
       await conn.beginTransaction()

       const username = req.body.username
       const password = await bcrypt.hash(req.body.password, 5)
       const first_name = req.body.first_name
       const last_name = req.body.last_name
       const email = req.body.email
       const mobile = req.body.mobile

       try {
           await conn.query(
               'INSERT INTO users(username, password, first_name, last_name, email, mobile) ' +
               'VALUES (?, ?, ?, ?, ?, ?)',[username, password, first_name, last_name, email, mobile]
           )
           conn.commit()
           res.status(201).send()
       } catch (err) {
           conn.rollback()
           res.status(400).json(err.toString());
       } finally {
           conn.release()
       }
    })
const loginSchema = Joi.object({
    username: Joi.string().required(),
    password: Joi.string().required()
})

router.post('/user/login', async (req, res, next) => {
    console.log(req.body.password)
    try {
        await loginSchema.validateAsync(req.body, { abortEarly: false })
    } catch (err) {
        return res.status(400).send(err)
    }
    const username = req.body.username
    const password = req.body.password
    const conn = await pool.getConnection()
    await conn.beginTransaction()

    try {
        // Check if username is correct
        const [users] = await conn.query(
            'SELECT * FROM users WHERE username=?', 
            [username]
        )
        const user = users[0]
        console.log(user.username)
        if (!user) {    
            console.log('Incorrect username or password')
        }

        // Check if password is correct
        if (!(await bcrypt.compare(password, user.password))) {
            console.log('Incorrect username or password')
        }

        // Check if token already existed
        const [tokens] = await conn.query(
            'SELECT * FROM tokens WHERE user_id=?', 
            [user.user_id]
        )
        let token = tokens[0]?.token
        console.log(token)
        if (!token) {
            // Generate and save token into database
            token = generateToken()
            // console.log(token)
            await conn.query(
                'INSERT INTO tokens(user_id, token) VALUES (?, ?)', 
                [user.user_id, token]
            )
        }
        console.log("success")
        conn.commit()
        res.status(200).json({'token': token})
    } catch (error) {
        conn.rollback()
        res.status(400).json(error.toString())
    } finally {
        conn.release()
    }
})
    router.get('/user/me', isLoggedIn, async (req, res, next) => {
        // req.user ถูก save ข้อมูล user จาก database ใน middleware function "isLoggedIn"
        let token = req.headers.authorization.split(" ")[1]
        try{
            const [token_user] = await pool.query(
                'SELECT * FROM tokens WHERE token=?', 
                [token]
            )
            const [user] = await pool.query(
                'SELECT * FROM users WHERE user_id=?', 
                [token_user[0].user_id]
            )
            res.status(200).json(user[0])
        }
        catch(error){
            console.log(error)
        }
        
    })

    
exports.router = router