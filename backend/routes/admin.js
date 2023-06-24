// const { json } = require("express");
const express = require("express");
const pool = require("../config");

const router = express.Router();

router.post('/user/edit/:promotion_id', async function (req, res, next) {
    const conn = await pool.getConnection();
    // Begin transaction
    await conn.beginTransaction();
    try {
      const [rows, fields] = await conn.query(
        "UPDATE promotion SET promotion.pmt_name = ?, promotion.price_normal_kid = ?, promotion.price_pmt_kid = ?, promotion.price_normal_adult = ?,promotion.price_pmt_adult = ?, promotion.file_path = ? WHERE promotion.promotion_id=?", [
          req.body.name, req.body.priceKid1, req.body.priceKid2, req.body.priceAdult1, req.body.priceAdult2, req.body.path, req.params.promotion_id,
      ]);
    //   const [rows2, fields2] = await conn.query(
    //     'SELECT * FROM `promotion` WHERE `promotion_id` = ?', 
    //     [rows.insertId]
    // )
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
  });

  router.delete('/user/del/:promotion_id', async function(req, res, next){
    try {
        const [rows1, fields] = await pool.query("DELETE FROM promotion WHERE promotion_id = ?", [req.params.promotion_id])
        deleteCom = {message: 'Promotion ID '+req.params.promotion_id+' is deleted.'}
        res.send(deleteCom)
    } catch (err) {
        return next(err);
    }
});

router.post('/user/add/', async function(req, res, next){
    // comment = req.body.comment
    const conn = await pool.getConnection()
    // Begin transaction
    await conn.beginTransaction();
    try{
        const [rows1, fields1] = await conn.query(
            'INSERT INTO `promotion` (`pmt_name`, `price_normal_kid`, `price_pmt_kid`, `price_normal_adult`, `price_pmt_adult`, `file_path`) VALUES (?, ?, ?, ?, ?)', 
            [req.body.name, req.body.priceKid1, req.body.priceKid2, req.body.priceAdult1, req.body.priceAdult2, req.body.file_path]
        )
        const [rows2, fields2] = await conn.query(
            'SELECT * FROM `promotion` WHERE `promotion_id` = ?', 
            [rows1.insertId]
        )
        await conn.commit()
        return res.json(rows2[0])
    } catch (err) {
        await conn.rollback();
        return res.status(500).json(err)
    }finally{
        console.log('finally')
        conn.release();
    }
});


  exports.router = router