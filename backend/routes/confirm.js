const express = require("express");
const path = require("path")
const pool = require("../config");
const multer = require("multer")


var storage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, './static/uploads')
    },
    filename: function (req, file, callback) {
        callback(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
    }
})

  
const upload = multer({ storage: storage })

const router = express.Router();

// // Get comment
// router.get('/:blogId/comments', function (req, res, next) {
// });

// Create new comment
router.post('/user/confimepayment', upload.single('myImage'), async function (req, res, next) {
// const comment = req.body.comment]
const file = req.file;
// let order_id = null;
const conn = await pool.getConnection()
await conn.beginTransaction()

if (!file) {
    return res.status(400).json({ message: "Please upload a file" });
  }

try {        
    console.log(req.body)
    console.log(req.file.path)
    // const [rows1, fields1] = await conn.query(
    //     'INSERT INTO order (order_status, order_price, user_id, order_img) VALUES (?, ?, ?, ?)', 
    //     [req.body.order_status, req.body.order_price, req.body.user_id, "/"+req.file.path.substring(7).replace(/\\/g, "/")] );
        if (file){
            const [row1, columns1] = await conn.query('INSERT INTO `order`(`order_status`, `order_price`, `user_id`) VALUES(?, ?, ?)',
            [req.body.order_status, req.body.order_price, req.body.user_id])
            // res.json(row1);
            console.log(row1.insertId)
            const [row2, columns2] = await conn.query('INSERT INTO `payment`(`banking_name`, `total_price`, `payment_img`, `order_id`) VALUES(?, ?, ?, ?)',
            [req.body.bank_name, req.body.order_price, "/"+ file.path.substring(7).replace(/\\/g, "/"), row1.insertId])
            // res.json(row2);
        }
        await conn.commit()
        return res.status(200).end()
} catch (err) {
    console.log(err)
    await conn.rollback()
} finally {
    console.log('finally')
    conn.release();}
});





exports.router = router