const express = require('express')
const mongoose = require('mongoose')
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}


// Creating the express app
const app = express()

// Getting access to server path (for images)
const path = require('path');
app.use('/images', express.static(path.join(__dirname, 'images')));


// Importing the routers
const userRoutes = require('./routes/user')
const sauceRoutes = require('./routes/sauce')

// Connecting to the database
mongoose.connect( process.env.MONGODB_URL,
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
app.use('/api/auth', userRoutes)
app.use('/api/sauces', sauceRoutes)



module.exports = app
