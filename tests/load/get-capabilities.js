import http from 'k6/http'
import encoding from 'k6/encoding'
import { check, sleep } from 'k6'

const BASE_URL = __ENV.OC_BASE_URL || 'https://host.docker.internal:9200'
const USER = __ENV.OC_USER || 'admin'
const PASS = __ENV.OC_PASS || 'admin'
const AUTH = `Basic ${encoding.b64encode(`${USER}:${PASS}`)}`

export const options = {
  insecureSkipTLSVerify: true,
  // ramp up, hold, ramp down
  stages: [
    { duration: '15s', target: 10 },
    { duration: '30s', target: 10},
    { duration: '15s', target: 0 }
  ],
  // turn the test into a pass/fail gate
  thresholds: {
    http_req_duration: ['p(95)<500'], // 95% of requests faster than 500ms
    http_req_failed: ['rate<0.01'] //fewer than 1% errors
  }
}

export default function (){
  const res = http.get(`${BASE_URL}/ocs/v1.php/cloud/capabilities?format=json`, {
    headers: { Authorization:AUTH }
  })
  check(res, {
    'status is 200': (r) => r.status === 200,
    'backend is installed': (r) =>
      r.json('ocs.data.capabilities.core.status.installed') === true
  })
  sleep(1)
}
