const express = require ('express');
const controllers = require ('./controllers.js')
const app = express();
const port = 3000;

app.use(express.json());

app.get('/api/reviews/', controllers.getReviews);

app.get('/api/reviews/meta/', controllers.getReviewsMeta);

app.post('/api/reviews', controllers.postReview);

app.put('/api/reviews/:review_id/helpful', controllers.helpful);

app.put('/api/reviews/:review_id/report', controllers.report);


app.listen(port, () => {
  console.log(`server listening on port ${port}`);
});
