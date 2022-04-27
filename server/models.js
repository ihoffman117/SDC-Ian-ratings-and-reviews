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
    FROM reviews WHERE reviews.product_id = $1 AND reviews.reported = false
    ORDER BY ${sortString}
    LIMIT $2
    OFFSET $3
  `;

  db.query(queryString, queryArgs)
    .then((reviews) => {
      reviewsObj = {
        product: product_id,
        page: page,
        count: count,
        results: reviews.rows
      }
      callback(null, reviewsObj);
    })
    .catch((err) => {
      callback(err);
    })
}

const getReviewsMeta = (product_id, callback) => {
  const queryArgs = [product_id]

  const queryString =  `SELECT
  (SELECT json_object_agg(rating, count)
  ratings FROM (SELECT rating, COUNT(rating) FROM reviews WHERE product_id = $1 GROUP BY rating) ratings),

  (SELECT json_object_agg(recommend, count)
  recommended FROM (SELECT recommend, COUNT(recommend) FROM reviews WHERE product_id = $1 GROUP BY recommend) recommended),

  (SELECT json_object_agg(name, json_build_object('id', id, 'value', avg)) AS
  characteristics FROM (SELECT name, characteristics.id, AVG(value) FROM characteristics LEFT JOIN characteristicReviews ON characteristics.id = characteristicReviews.characteristic_id WHERE characteristics.product_id = $1 GROUP BY characteristics.id) characteristics)
  `

  /**


SELECT
  (SELECT json_object_agg(rating, count)
  ratings FROM (SELECT rating, COUNT(rating) FROM reviews WHERE product_id = 999999 GROUP BY rating) ratings),

  (SELECT json_object_agg(recommend, count)
  recommended FROM (SELECT recommend, COUNT(recommend) FROM reviews WHERE product_id = 999999 GROUP BY recommend) recommended),

  (SELECT json_object_agg(name, json_build_object('id', id, 'value', avg)) AS
  characteristics FROM (SELECT name, characteristics.id, AVG(value) FROM characteristics LEFT JOIN characteristicReviews ON characteristics.id = characteristicReviews.characteristic_id WHERE characteristics.product_id = 999999 GROUP BY characteristics.id) characteristics)

   */

  db.query(queryString, queryArgs)
    .then((meta) => {
      let obj = meta.rows[0];
      obj.product_id = product_id;
      callback(null, obj);
    })
    .catch((err) => {
      callback(err);
    });
}

const postReview = (object, callback) => {

  const product_id = object.product_id
  const rating = object.rating
  const summary = object.summary
  const body = object.body
  const recommend = object.recommend
  const name = object.name
  const email = object.email
  const photos = object.photos
  const characteristics = object.characteristics
  const date = Date.now();

  const queryArgs = [product_id, rating, summary, body, recommend, name, email, date];

  const queryString = `
    INSERT INTO reviews (product_id, rating, summary, body, recommend, reviewer_name, reviewer_email, date, response, helpfulness) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 'null', 0)
  `;

  const queryString2 =`
    INSERT INTO photos (review_id, photo_url) VALUES ((SELECT id FROM reviews ORDER BY id DESC LIMIT 1), $1)
  `

  const queryString3 =`
    INSERT INTO characteristicReviews (characteristic_id, review_id, value)
    VALUES ($1, (SELECT id FROM reviews ORDER BY id DESC LIMIT 1), $2)
  `

  db.query(queryString, queryArgs)
    .then((result) => {
      photos.map((photo) => {
        const queryArgs2 = [photo];
        db.query(queryString2, queryArgs2)
        .catch((err) => {
          callback(err);
        })
      })

      for(let key in characteristics) {

        const queryArgs3 =[key, characteristics[key]]
        db.query(queryString3, queryArgs3)
        .catch((err) => {
          callback(err);
        })
      }
      callback(null, null)
    })
    .catch((err) => {
      callback(err);
    })
}

const helpful = (review_id, callback) => {

  const queryArgs = [review_id];

  const queryString = `
    UPDATE reviews SET helpfulness = helpfulness + 1 WHERE id = $1
  `;

  db.query(queryString, queryArgs)
    .then (() => {
      callback(null);
    })
    .catch((err) => {
      callback(err);
    })
}

const report = (review_id, callback) => {

  const queryArgs = [review_id];

  const queryString = `
    UPDATE reviews SET reported = NOT reported WHERE id = $1
  `;

  db.query(queryString, queryArgs)
    .then (() => {
      callback(null);
    })
    .catch((err) => {
      callback(err);
    })
}

module.exports = {getReviews , getReviewsMeta, postReview, helpful, report,}