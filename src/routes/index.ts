// src/routes/index.ts

import { Router, Express } from "express"
import { constant } from "../constant"
import { Knex } from "knex"
import { initEventStorage } from "../storage/EffectiveEvent"
import { Resp } from "../lib/utils"

function routes(ctx: Express): Router {
  const r = Router()
  const knex = ctx.get(constant.SIMP_SERVER_STORAGE) as Knex
  const storage = initEventStorage(knex)

  r.get("/getEvents", async function (req, res, next) {
    try {
      const query: Pagination = req.query
      const resp = await storage.queryEvents(query).catch((e) => {
        console.log("e", e)
        throw e
      })
      res.status(200).json(Resp.Ok(resp))
    } catch (e) {
      next(e)
    }
  })

  r.post("/saveEvent", async function (req, res, next) {
    try {
      const body: EffectiveEventsDto = req.body
      storage
        .saveEvent(body)
        .then((resp) => {
          res.status(200).json(Resp.Ok(resp))
        })
        .catch((e) => {
          res.status(403).json(Resp.Error(-1, "saveError", e))
        })
    } catch (e) {
      next(e)
    }
  })

  r.post("/changeStatus", async function (req, res, next) {
    try {
      const body: Pick<EffectiveEventsDto, "id" | "status"> = req.body
      const resp = await storage.changeStatus(body)
      res.status(200).send(resp)
    } catch (e) {
      next(e)
    }
  })

  return r
}

export default routes
