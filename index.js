const PORT = 3000;
const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const app = express();

app.get('/', (req,res) => {
    res.json('fill out api initialization')
})

app.listen(PORT, () => console.log(`Server is up on port ${PORT}`))