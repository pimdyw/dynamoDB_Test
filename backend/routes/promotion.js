const { readAllUsers } = require('../db');
const express = require('express');
const router = express.Router();

router.get('/user', async(req, res) => {
  const { success, data } = await readAllUsers();

  if (success) {
    return res.json({ success, data });
  }
  return res.status(500).json({ success: false, message: 'Error' });
});

module.exports = router;
