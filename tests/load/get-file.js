import http from 'k6/http'
import { check, sleep } from 'k6'

export const options = {
  stages: [
    { duration: '10s', target: 10 },
    { duration: '20s', target: 50 },
    { duration: '30s', target: 50 },
    { duration: '10s', target: 0 }
  ],
  insecureSkipTLSVerify: true
}

export default function () {
  let res = http.get(__ENV.SHARE_URL)
  check(res, { 'status is 200': (res) => res.status === 200 })
  sleep(1)
}
