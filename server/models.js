const db = require ('../DB');

const getReviews = (product_id, page, count, callback) => {
  queryString = `SELECT * FROM reviews WHERE product_id = ${product_id};`;

  db.query(queryString, (err, reviews) => {
    if (err) {
      callback(err);
    } else {
      reviewsObj = {
        product: product_id,
        results: reviews.rows
      }
      callback(null, reviewsObj);
    }
  })
}

module.exports = {getReviews}