import e, { Express, Request, Response, NextFunction } from "express"
import { constant } from "../constant"
import knex, { Knex } from "knex"
import { Resp, parseStorageConf } from "../lib/utils"
import { validationResult } from "express-validator"
import { getRemoteCache, userCache } from "../request/sync"

export function targetHandler(ctx: Express) {
  return function (req: Request, res: Response, next: NextFunction) {
    res.setHeader(
      "port",
      process.env.SIMP_TARGET_PORT || ctx.get(constant.SIMP_SERVER_PORT)
    )
    next()
  }
}

export function tokenValidateHandler() {
  return async function (req: Request, res: Response, next: NextFunction) {
    try {
      const [username, token] = ((req.headers.token || "") as string).split("|")
      if (!token && username) {
        const remoteToken = await getRemoteCache(username)
        if (remoteToken.data.Data) {
          next(e)
        } else {
          res.send(Resp.Error(-1, "token validate error", null))
        }
      } else if (username && token && userCache[username] == token) {
        next()
      } else {
        res.send(Resp.Error(-1, "token validate error", null))
      }
    } catch (e) {
      next(e)
    }
  }
}

export function errorHandler() {
  return (err, req: Request, res: Response, next: NextFunction) => {
    console.log("err", err)
    res.json(Resp.Error(-1, err.message, null))
  }
}

export function validateMiddleWare(req, res, next) {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(200).json(Resp.Error(-1, "validateError", errors.array()))
  }
  next()
}

export async function loadStorage(ctx: Express) {
  const conf = ctx.get(constant.SIMP_SERVER_CONF) as SimpConf["server"]
  const storageConf = parseStorageConf(conf.storage)
  console.log("storageConf", storageConf)
  const conn = knex({
    client: "mysql2",
    connection: {
      database: storageConf.database!,
      host: storageConf.host,
      port: storageConf.port,
      user: storageConf.username,
      password: storageConf.password
    }
  })
  ctx.set(constant.SIMP_SERVER_STORAGE, conn)
}
