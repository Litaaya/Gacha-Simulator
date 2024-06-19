const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

mongoose.connect('mongodb://localhost:27017/gacha', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('Connected to MongoDB');
}).catch((err) => {
  console.error('Error connecting to MongoDB:', err);
});

const itemSchema = new mongoose.Schema({
  name: String,
  image: String,
  count: Number
});

const Item = mongoose.model('Item', itemSchema);

app.get('/items', async (req, res) => {
  try {
    const items = await Item.find();
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.post('/items', async (req, res) => {
  const items = req.body.items;
  try {
    await Item.deleteMany({});
    await Item.insertMany(items);
    res.status(201).json({ message: 'Items created' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.post('/reset-items', async (req, res) => {
  try {
    await Item.updateMany({}, { count: 0 });
    res.json({ message: 'Items reset' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
