const express = require('express');
const PORT = 3000;
const cookieParser = require('cookie-parser');
const cookieSession = require("cookie-session");
require('dotenv').config();
const secret = process.env.MY_SECRET;


const app = express();

app.use(express.json());

// cookie
app.use(cookieParser());
app.use(
    cookieSession({
        name: "session",
        keys: [secret],

        // Cookie Options
        maxAge: 24 * 60 * 60 * 1000, // 24 hours
    })
);


// routesフォルダ配下でルーティングを管理する
app.use('/api', require('./routes'));

app.listen(PORT);

module.exports = app;