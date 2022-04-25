const models = require('./models');

const getReviews = (req, res) => {
  models.getReviews(req.query.product_id, req.query.page, req.query.count, req.query.sort, (err, reviews) => {
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

const getReviewsMeta = (req, res) => {
  models.getReviewsMeta(req.query.product_id, (err, meta) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.status(200)
      if (meta.length <=0 ) {
        res.send('no meta data');
      } else {
        res.send(meta);
      }
    }
  });
}

const postReview = (req, res) => {
  models.postReview(req.body, (err, posted) => {
    if(err){
      res.status(424).send(err);
    } else {
      res.status(201)
      res.send(posted)
    }
  })
}

const helpful = (req, res) => {
  models.helpful(req.params.review_id, (err) => {
    if(err){
      res.status(400).send(err);
    } else {
      res.status(204)
      res.send();
    }
  })
}

const report = (req, res) => {
  models.report(req.params.review_id, (err) => {
    if(err){
      res.status(400).send(err);
    } else {
      res.status(204)
      res.send();
    }
  })
}

module.exports = {getReviews, getReviewsMeta, postReview, helpful, report}