require('dotenv').config();
const express = require('express');
const database = require('./src/Config/mongoose');
const indexRouter = require('./src/Router/index.Router');
const cors = require('cors');
const app = express();

database();

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));
app.use(express.urlencoded({ extended : true }))
app.use(express.json());
app.use('/', indexRouter);

const PORT = process.env.PORT || 8000;

app.listen(process.env.PORT,() => console.log(`server is running on http://localhost:${PORT}`));

