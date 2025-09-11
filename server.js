const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const { swagger } = require('./swagger');
const path = require('node:path');
const routes = require('./routes/routes');

dotenv.config();

const app = express();
const PORT = process.env.APP_PORT || 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

const apiPrefix = '/api/v1';

app.use(`${apiPrefix}/uploads`, express.static(path.join(__dirname, 'uploads')));
routes(app, apiPrefix);
swagger(app);

app.get('/', (_req, res) => {
    res.send('Server is running');
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
    console.log(`Swagger docs available at http://localhost:${PORT}/docs`);
    console.log(`Raw JSON docs at http://localhost:${PORT}/docs.json`);
});
