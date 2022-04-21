const models = require('./models');

const getReviews = (req, res) => {
  models.getReviews(req.query.product_id, req.query.page, req.query.count, (err, reviews) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.status(200)
      if (reviews.length <=0 ) {
        res.send('no reviews here!');
      } else {
        res.send(reviews);
      }
    }
  });
}

module.exports = {getReviews}