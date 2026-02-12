import http from 'k6/http'
import { sleep, check } from 'k6'

export const options = {
  stages: [
    { duration: '10s', target: 50 },
    { duration: '20s', target: 100 },
    { duration: '20s', target: 160 },
    { duration: '10s', target: 0 },
  ],
}

// daftar user simulasi
const users = [
  { username: 'USER03', password: '123' },
  { username: 'USER04', password: '123' },
  { username: 'USER01', password: '123' },
  { username: 'USER02', password: '123' },
  { username: 'USER05', password: '123' },
  { username: 'USER06', password: '123' },
  { username: 'USER07', password: '123' },
  { username: 'USER08', password: '123' },
  { username: 'USER09', password: '123' },
  { username: 'USER10', password: '123' },
]

export default function () {
  const user = users[Math.floor(Math.random() * users.length)]

  const url =
    'https://bszeokmpjctjufpomxid.supabase.co/rest/v1/users' +
    `?username=eq.${user.username}&password=eq.${user.password}`

  const params = {
    headers: {
      apikey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJzemVva21wamN0anVmcG9teGlkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjkxNDg2ODMsImV4cCI6MjA4NDcyNDY4M30.ESOTkKDc5AiItUCDfDGDLwzNJkX41ZAJzYtmtJpT_-8',
      Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJzemVva21wamN0anVmcG9teGlkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjkxNDg2ODMsImV4cCI6MjA4NDcyNDY4M30.ESOTkKDc5AiItUCDfDGDLwzNJkX41ZAJzYtmtJpT_-8',
      Accept: 'application/json',
    },
  }

  const res = http.get(url, params)

  check(res, {
    'login success (200)': (r) => r.status === 200,
    'user found': (r) => JSON.parse(r.body).length === 1,
  })

  sleep(1)
}
