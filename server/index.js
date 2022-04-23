const express = require ('express');
const controllers = require ('./controllers.js')
const app = express();
const port = 3000;

app.use(express.json());

app.get('/api/reviews/', (req, res) => {
  controllers.getReviews(req, res);
});

app.get('/api/reviews/meta/', (req, res) => {
  controllers.getReviewsMeta(req, res);
});

app.post('/api/reviews', (req, res) => {
  controllers.postReview(req, res);
})

app.listen(port, () => {
  console.log(`server listening on port ${port}`);
});
