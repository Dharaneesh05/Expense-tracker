import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();
const app = express();
const port = process.env.PORT || 5000;
app.use(cors());
app.use(express.json());

const mongoURI = process.env.MONGODB_URI||'mongodb://localhost:27017/expenseDB';

mongoose.connect(mongoURI, {useNewUrlParser: true,useUnifiedTopology: true,})
.then(() => console.log('MongoDB connected'))
.catch((err) => console.error('MongoDB connection error:', err));

const itemSchema = new mongoose.Schema({
  name: String,
  amount: Number,
});
const Item = mongoose.model('Item', itemSchema);
app.get('/api/items', async (req, res) => {
  try {
    const items = await Item.find();
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
app.post('/api/items', async (req, res) => {
  console.log('POST /api/items body:', req.body);
  const newItem = new Item({
    name: req.body.name,
    amount: req.body.amount,
  });

  try {
    const savedItem = await newItem.save();
    console.log('Saved item:', savedItem);
    res.status(201).json(savedItem);
  } catch (err) {
    console.error('Error saving item:', err);
    res.status(400).json({ message: err.message });
  }
});

app.delete('/api/items/:id', async (req, res) => {
  try {
    const deletedItem = await Item.findByIdAndDelete(req.params.id);
    if (!deletedItem) {
      return res.status(404).json({ message: 'Item not found' });
    }
    res.json({ message: 'Item deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
// app.delete('/api/items/:id',async(req,res)=>{
//   const {id}=req.params;
// })
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
