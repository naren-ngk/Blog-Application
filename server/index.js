const express = require('express');
const app = express();
const dotenv = require('dotenv');
const mongoose = require('mongoose');

const authRoutes = require('./routes/auth.js');

dotenv.config();
app.use(express.json());

mongoose.connect(process.env.MONGODB_URL, {
    useNewUrlParser: true
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "Connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

app.use('/api/auth', authRoutes);

app.listen('8080', () => {
    console.log('Listening on port 8080!');
});