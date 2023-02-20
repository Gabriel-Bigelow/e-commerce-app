const app = require('./app.js');
const serverless = require('serverless-http');

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
    console.log(`Server is listening on ${PORT}`);
});

module.exports.handler = serverless(app);