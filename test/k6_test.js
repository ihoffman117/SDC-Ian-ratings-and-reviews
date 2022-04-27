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
  let res = http.get('http://13.57.240.153:3000/api/reviews/meta/?product_id=999999');
}