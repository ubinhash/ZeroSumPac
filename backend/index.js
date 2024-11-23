const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const nftRoutes = require('./routes/nft');

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3002;


// CORS related middleware, remove the following chunk to remove cors check
const allowedOrigins = ['http://localhost:3002', 'https://another-allowed-site.com'];
const corsOptions = {
    origin: (origin, callback) => {
        if (allowedOrigins.includes(origin) || !origin) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
};
app.use(cors(corsOptions));
//--------
app.get('/', (req, res) => {
    res.send('Welcome!');
});

app.use(express.json());
app.use('/', nftRoutes);

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
