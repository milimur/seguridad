const { app } = require('./index'); // Import the app from index.js
const dotenv = require('dotenv');

dotenv.config();

const port = process.env.PORT || 3001;

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
