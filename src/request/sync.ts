import axios from "axios"
import { config } from "dotenv"

config()
let baseURL = ""
if (process.env.SIMP_PRODUCTION === "Yes") {
  baseURL = process.env.PROD_SYNC_PATH || ""
} else {
  baseURL = process.env.DEV_SYNC_PATH || ""
}
console.log("baseURL", baseURL)

const syncReq = axios.create({
  baseURL
})

export function getBasicUrl() {
  return syncReq({
    url: "/syncCache",
    method: "get"
  })
}

export let userCache: Record<string, string> = {}

export function initSync() {
  setInterval(async () => {
    const data = await getBasicUrl()
    userCache = data.data.data
  }, 10 * 1000)
}

export function getCache(userName: string) {
  return userCache[userName]
}

export function getRemoteCache(user: string) {
  return syncReq({
    url: "/getCache",
    method: "get",
    params: {
      user
    }
  })
}
