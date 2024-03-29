import express, { Express } from "express"
import { NewError, constant } from "../constant"
import { loadStorage } from "../configuration"
import { parseSimpConf } from "./utils"

export function NewHttpServerCtx(p: string): Express {
  const app = express()
  app.use(express.json())
  const conf = parseSimpConf(p)
  try {
    console.log("conf", JSON.stringify(conf))
    app.set(constant.SIMP_SERVER_PORT, conf.server.port)
    app.set(constant.SIMP_SERVER_CONF, conf.server)
    loadStorage(app)
  } catch (e) {
    NewError(-1, "read storage error")
  }
  return app
}

export function NewSimpHttpServer(ctx: Express) {
  const SIMP_TARGET_PORT = process.env.SIMP_TARGET_PORT
  console.log("SIMP_TARGET_PORT:" + SIMP_TARGET_PORT)
  console.log("SIMP_SERVER_PORT:" + String(ctx.get(constant.SIMP_SERVER_PORT)))
  if (
    SIMP_TARGET_PORT &&
    SIMP_TARGET_PORT !== String(ctx.get(constant.SIMP_SERVER_PORT))
  ) {
    const port = Number(SIMP_TARGET_PORT)
    ctx.listen(port, function () {
      console.log("child_service : server started at localhost:" + port)
    })
    return
  }
  const port = ctx.get(constant.SIMP_SERVER_PORT)
  ctx.listen(port, function () {
    console.log("main_service :server started at localhost:" + port)
  })
}

export function NewMainThread() {
  return process.env.SIMP_SERVER_INDEX == "1"
}
