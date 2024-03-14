import { Express } from "express"
import { constant } from "../constant"
import knex from "knex"
import { parseStorageConf } from "../lib/utils"

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
  // eslint-disable-next-line no-constant-condition
  if (true) {
    const t = await conn.table("blog_article").first()
    console.log("t", t)
  }
}
