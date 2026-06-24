import http from 'k6/http'
import { check, sleep } from 'k6'

export const options = {
  vus: 20,
  duration: '30s',
  insecureSkipTLSVerify: true
}

export default function () {
  let res = http.get(__ENV.SHARE_URL)
  check(res, { 'status is 200': (res) => res.status === 200 })
  sleep(1)
}
