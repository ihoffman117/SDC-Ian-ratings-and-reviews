import http from 'k6/http';
import { sleep, check } from 'k6';
export const options = {
    vus: 100,
    duration: '60s',
    thresholds: {
      errors: ["count<10"]
    }
  };

export default function () {
  let res = http.get('http://localhost:3000/api/reviews/meta/?product_id=24');

  //Creating Error Check
  let success = check(res, {
    "status is 200": r => r.status === 200
  });
  if (!success) {
    console.log('error');
    ErrorCount.add(1)
  }

  sleep(1);
}