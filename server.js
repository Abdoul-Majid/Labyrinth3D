const express = require('express');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = 6060;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

const homeRouter = require('./routes/home.route');
app.use('/', homeRouter);

app.use(express.static(path.join(__dirname, 'public')));

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
