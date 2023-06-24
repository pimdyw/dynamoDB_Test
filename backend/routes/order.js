const express = require("express");
const pool = require("../config");

router = express.Router();

router.get("/user/order", function (req, res, next) {

    const promise1 = pool.query("SELECT * FROM `order` where `order_status` = 'pending';");

    promise1.then((results) => {
        const [order] = results;
        console.log(results)
        res.json({
            order: order,
            error: null,
        });
    })
        .catch((err) => {
            return res.status(500).json(err);
        });
});

router.get("/user/order/finish/:user_id", function (req, res, next) {

    // const promise1 = pool.query("SELECT * FROM order WHERE user_id=?;", [req.params.user_id]);
    

    const promise1 = pool.query("SELECT * FROM `order` where `user_id` = ?;", [req.params.user_id]);

    promise1.then((results) => {
        const [order] = results;
        console.log(results)
        res.json({
            order: order,
            error: null,
        });
    })
        .catch((err) => {
            return res.status(500).json(err);
        });
});

router.post('/user/orderConfirm/:order_id', async function (req, res, next) {

    const conn = await pool.getConnection();
    // Begin transaction
    await conn.beginTransaction();
    try {
        const [rows, fields] = await conn.query(
            "UPDATE `order` SET `order_status` = ? WHERE `order_id` = ?", [
            req.body.order_status, req.params.order_id,
        ]);

        res.json({ rows: rows });
        await conn.commit();
    } catch (err) {
        console.log(err)
        await conn.rollback();
        return res.status(500).json(err);
    } finally {
        console.log("Success orderConfirm");
        conn.release();
    }
});

router.post('/user/orderCancel/:order_id', async function (req, res, next) {

    const conn = await pool.getConnection();
    // Begin transaction
    await conn.beginTransaction();
    try {
        const [rows, fields] = await conn.query(
            "UPDATE `order` SET `order_status` = ? WHERE `order_id` = ?", [
            req.body.order_status, req.params.order_id,
        ]);

        res.json({ rows: rows });
        await conn.commit();
    } catch (err) {
        console.log(err)
        await conn.rollback();
        return res.status(500).json(err);
    } finally {
        console.log("Success orderConfirm");
        conn.release();
    }
});

exports.router = router;
