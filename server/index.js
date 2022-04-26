const express = require ('express');
const cors = require('cors');
const controllers = require ('./controllers.js')
const app = express();
const port = 3000;


app.use(express.json());
app.use(cors());

// app.options('/*', function(req, res, next){
//   res.header('Access-Control-Allow-Origin', '*');
//   res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,OPTIONS');
//   res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
//   res.send(200);
// });


app.get('/api/reviews/', controllers.getReviews);

app.get('/api/reviews/meta/', controllers.getReviewsMeta);

app.post('/api/reviews', controllers.postReview);

app.put('/api/reviews/:review_id/helpful', controllers.helpful);

app.put('/api/reviews/:review_id/report', controllers.report);


app.listen(port, () => {
  console.log(`server listening on port ${port}`);
});
