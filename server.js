const express = require('express');
const { swagger } = require('./swagger');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());


swagger(app);

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
    console.log(`Scalar docs available at http://localhost:${PORT}/docs`);
    console.log(`Raw JSON docs at http://localhost:${PORT}/docs.json`);
});
