import http from 'k6/http'
import { sleep, check } from 'k6'

export const options = {
  stages: [
    { duration: '20s', target: 50 },
    { duration: '20s', target: 100 },
    { duration: '20s', target: 160 },
    { duration: '20s', target: 0 },
  ],
}

// ===============================
// CONFIG
// ===============================
const SUPABASE_URL = 'https://bszeokmpjctjufpomxid.supabase.co'
const SUPABASE_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJzemVva21wamN0anVmcG9teGlkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjkxNDg2ODMsImV4cCI6MjA4NDcyNDY4M30.ESOTkKDc5AiItUCDfDGDLwzNJkX41ZAJzYtmtJpT_-8'

// USERNAME YANG ADA DI DATABASE
const USERS = [
  'USER01',
  'USER02',
  'USER03',
  'USER04',
  'USER05',
  'USER06',
  'USER07',
  'USER08',
  'USER09',
  'USER10',
]

const HEADERS = {
  headers: {
    apikey: SUPABASE_KEY,
    Authorization: `Bearer ${SUPABASE_KEY}`,
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
}

// ===============================
// MAIN TEST
// ===============================
export default function () {
  const voter = USERS[Math.floor(Math.random() * USERS.length)]
  let candidate = USERS[Math.floor(Math.random() * USERS.length)]

  // tidak boleh vote diri sendiri
  while (candidate === voter) {
    candidate = USERS[Math.floor(Math.random() * USERS.length)]
  }

  // ===============================
  // STEP 1: GET CURRENT VOTES
  // ===============================
  const getRes = http.get(
    `${SUPABASE_URL}/rest/v1/users?username=eq.${voter}&select=votes_given`,
    HEADERS
  )

  check(getRes, {
    'GET user success': r => r.status === 200,
  })

  const body = JSON.parse(getRes.body)
  const votes = body[0]?.votes_given || []

  // stop jika sudah 3 vote / duplikat
  if (votes.length >= 3 || votes.includes(candidate)) {
    sleep(1)
    return
  }

  // ===============================
  // STEP 2: UPDATE VOTES
  // ===============================
  const updatedVotes = [...votes, candidate]

  const updateRes = http.patch(
    `${SUPABASE_URL}/rest/v1/users?username=eq.${voter}`,
    JSON.stringify({ votes_given: updatedVotes }),
    {
      headers: {
        ...HEADERS.headers,
        Prefer: 'return=minimal',
      },
    }
  )

  check(updateRes, {
    'VOTE stored to DB': r => r.status === 204,
  })

  sleep(1)
}
