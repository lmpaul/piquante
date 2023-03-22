const express = require('express')
const app = express()
const mongoose = require('mongoose')

// Importing the routers


// Connecting to the database
mongoose.connect('mongodb+srv://lmpaul:rK7GUv2ER1vzpVa6@piquantecluster0.ceb0vvx.mongodb.net/?retryWrites=true&w=majority',
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

// Configuring the CORS policy + JSON usage
app.use(express.json())

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});

// Configuring the app routing


module.exports = app
