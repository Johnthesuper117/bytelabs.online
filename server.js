// server.js
const express = require('express');
const app = express();
const port = 3000;

app.use(express.json()); // Enable JSON body parsing

// Sample data
let items = [{ id: 1, name: 'Item A' }, { id: 2, name: 'Item B' }];

// GET all items
app.get('/api/items', (req, res) => {
  res.json(items);
});

// GET item by ID
app.get('/api/items/:id', (req, res) => {
  const item = items.find(i => i.id === parseInt(req.params.id));
  if (!item) return res.status(404).send('Item not found');
  res.json(item);
});

// POST a new item
app.post('/api/items', (req, res) => {
  const newItem = {
    id: items.length + 1,
    name: req.body.name
  };
  items.push(newItem);
  res.status(201).json(newItem);
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});