import e, { Express, Request, Response, NextFunction } from "express"
import { constant } from "../constant"
import knex, { Knex } from "knex"
import { validationResult } from "express-validator"
import { Resp } from "sgridnode/build/main"
import { f_env} from 'sgridnode/build/lib/constant/index'

export function targetHandler(ctx: Express) {
  return function (req: Request, res: Response, next: NextFunction) {
    res.setHeader(
      "port",
      process.env.SGRID_TARGET_PORT || ctx.get(constant.SGRID_TARGET_PORT)
    )
    next()
  }
}

export function errorHandler() {
  return (err, req: Request, res: Response, _: NextFunction) => {
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
  const conf = ctx.get(f_env.ENV_SGRID_CONFIG) as SimpConf
  const storageConf = conf.config.db as Record<string, string>
  console.log("storageConf", storageConf)
  const conn = knex({
    client: "mysql2",
    connection: {
      database: storageConf.database!,
      host: storageConf.host,
      port: Number(storageConf.port),
      user: storageConf.username,
      password: String(storageConf.password)
    }
  })
  ctx.set(constant.SGRID_DATABASE, conn)
}
