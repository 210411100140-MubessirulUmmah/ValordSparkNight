import http from 'k6/http'
import { sleep } from 'k6'

export const options = {
  stages: [
    { duration: '20s', target: 50 },
    { duration: '20s', target: 100 },
    { duration: '20s', target: 160 },
    { duration: '20s', target: 0 },
  ],
}

export default function () {
  http.get('https://valord-spark-night.vercel.app')
  sleep(1)
}
