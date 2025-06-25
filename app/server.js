const express = require('express');
const path = require('path');
const fs = require('fs');
const bodyParser = require('body-parser');
const { MongoClient } = require('mongodb');

const app = express();
const PORT = 3000;

const mongoURL = process.env.MONGO_URL || 'mongodb://admin:password@mongodb:27017/?authSource=admin';
const dbName = 'users_prof';
let db;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(__dirname));
app.use('/images', express.static(path.join(__dirname, 'images')));

// Mongo connection
MongoClient.connect(mongoURL)
  .then(client => {
    console.log('✅ Connected to MongoDB');
    db = client.db(dbName);
  })
  .catch(err => {
    console.error('❌ Failed to connect to MongoDB', err);
  });

// Serve HTML
app.get('/', (req, res) => {
  console.log('GET / request');
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/profile-picture', (req, res) => {
  const filePath = path.join(__dirname, 'images', 'profile-1.jpg');
  if (fs.existsSync(filePath)) {
    res.sendFile(filePath);
  } else {
    res.status(404).send('Image not found');
  }
});

app.get('/get-profile', async (req, res) => {
  try {
    const profile = await db.collection('profiles').findOne({});
    res.json(profile || {
      name: 'Anna Smith',
      email: 'anna.smith@example.com',
      interests: 'coding'
    });
  } catch (err) {
    res.status(500).send('Error fetching profile');
  }
});

app.post('/update-profile', async (req, res) => {
  const { name, email, interests } = req.body;
  try {
    await db.collection('profiles').deleteMany({});
    await db.collection('profiles').insertOne({ name, email, interests });
    res.json({ name, email, interests });
  } catch (err) {
    res.status(500).send('Error updating profile');
  }
});

app.use((req, res) => {
  res.status(404).send('Page not found');
});

app.listen(PORT, () => {
  console.log(`🚀 App listening on port ${PORT}`);
});
