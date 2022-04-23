const db = require ('../DB');

const getReviews = (product_id, page = 0, count = 5, sort = 'relevant', callback) => {
  let sortString = '';

  if(sort === 'relevant') {
    sortString = 'helpfulness DESC, date DESC'
  }

  if(sort === 'helpful') {
    sortString = 'helpfulness DESC'
  }

  if(sort === 'newest') {
    sortString = 'date DESC'
  }

  let offset = page * count;

  const queryArgs = [product_id, count, offset]

  const queryString = `
    SELECT
    id,
    rating,
    summary,
    recommend,
    response,
    body,
    to_timestamp(date /1000 ) date,
    reviewer_name,
    helpfulness,
    (SELECT COALESCE(json_agg(row_to_json("photos")),'[]' :: json)
      photos FROM (SELECT id, photo_url FROM photos WHERE photos.review_id = reviews.id) photos)
    FROM reviews WHERE reviews.product_id = $1
    ORDER BY ${sortString}
    LIMIT $2
    OFFSET $3
  `;

  db.query(queryString, queryArgs, (err, reviews) => {
    if (err) {
      callback(err);
    } else {
      reviewsObj = {
        product: product_id,
        page: page,
        count: count,
        results: reviews.rows
      }
      callback(null, reviewsObj);
    }
  })
}

const getReviewsMeta = (product_id, callback) => {
  const queryArgs = [product_id]

  const queryString4 =  `SELECT
  (SELECT json_object_agg(rating, count)
  ratings FROM (SELECT rating, COUNT(rating) FROM reviews WHERE product_id = $1 GROUP BY rating) ratings),

  (SELECT json_object_agg(recommend, count)
  recommended FROM (SELECT recommend, COUNT(recommend) FROM reviews WHERE product_id = $1 GROUP BY recommend) recommended),

  (SELECT json_object_agg(name, json_build_object('id', id, 'value', avg))
  characteristics FROM (SELECT name, characteristics.id, AVG(value) FROM characteristics LEFT JOIN characteristicReviews ON characteristics.id = characteristicReviews.characteristic_id WHERE characteristics.product_id = $1 GROUP BY characteristics.id) characteristics)
  `

  db.query(queryString4, queryArgs, (err, meta) => {
    if (err) {
      callback(err);
    } else {
      let obj = meta.rows[0];
      obj.product_id = product_id;
      callback(null, obj);
    }
  })
}

const postReview = (object) => {
  console.log(object);
  callback(null, null);
}

module.exports = {getReviews , getReviewsMeta}