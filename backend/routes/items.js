const express = require('express');
const router = express.Router();
const Item = require('../models/Item');

// Lấy tất cả items
router.get('/items', async (req, res) => {
  const items = await Item.find({});
  res.send(items);
});

// Cập nhật item count
router.post('/update-item', async (req, res) => {
  const { name, count } = req.body;
  await Item.findOneAndUpdate({ name }, { count });
  res.send({ message: 'Item updated' });
});

// Reset tất cả items
router.post('/reset-items', async (req, res) => {
  await Item.updateMany({}, { count: 0 });
  res.send({ message: 'Items reset' });
});

module.exports = router;
