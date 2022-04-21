const express = require ('express');
const controllers = require ('./controllers.js')
const app = express();
const port = 3000;

app.use(express.json());

app.get('/api/reviews/', (req, res) => {
  controllers.getReviews(req, res);
})

app.listen(port, () => {
  console.log(`server listening on port ${port}`);
})
