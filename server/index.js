const express = require('express');
const app = express();
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const multer = require('multer');

const authRoutes = require('./routes/auth.js');
const userRoutes = require('./routes/users.js');
const postRoutes = require('./routes/posts.js');
const categoryRoutes = require('./routes/categories.js');

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

const multerStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'images');
    },
    filename: (req, file, cb) => {
        cb(null, req.body.name)
    }
});

const upload = multer({ storage: multerStorage });
app.post('/api/upload', upload.single('file'), (req, res) => {
    res.status(200).json('File has been uploaded!');
})

app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/post', postRoutes);
app.use('/api/category', categoryRoutes);

app.listen('8080', () => {
    console.log('Listening on port 8080!');
});