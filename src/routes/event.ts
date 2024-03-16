// src/routes/index.ts

import e, { Router, Express, NextFunction, Request, Response } from "express"
import { constant } from "../constant"
import { Knex } from "knex"
import { initEventStorage } from "../storage/EffectiveEvent"
import { Now, Resp } from "../lib/utils"
import {
  changeStatusValidate,
  saveEventValidate,
  paginationValidate
} from "../validate"
import { validateMiddleWare } from "../configuration"
import { initCommentStorage } from "../storage/Comment"

function routes(ctx: Express): Router {
  const r = Router()
  const knex = ctx.get(constant.SIMP_SERVER_STORAGE) as Knex
  const storage = initEventStorage(knex)
  const commentStorage = initCommentStorage(knex)

  r.get(
    "/getEvents",
    paginationValidate,
    function (req: Request, res: Response, next: NextFunction) {
      try {
        const query: Pagination = req.query
        storage
          .queryEvents(query)
          .then((resp) => {
            return res.status(200).json(Resp.Ok(resp))
          })
          .catch((e) => {
            console.log("e", e)
            return res.status(200).json(Resp.Error(-1, "getEvents", e))
          })
      } catch (e) {
        next(e)
      }
    }
  )

  r.post(
    "/saveEvent",
    saveEventValidate,
    validateMiddleWare,
    async function (req: Request, res: Response, next: NextFunction) {
      try {
        const body: EffectiveEventsDto = req.body
        storage
          .saveEvent(body)
          .then((resp) => {
            return res.status(200).json(Resp.Ok(resp))
          })
          .catch((e) => {
            return res.status(200).json(Resp.Error(-1, "saveError", e))
          })
      } catch (e) {
        next(e)
      }
    }
  )

  r.post("/deleteEvent", async function (req, res, next) {
    try {
      const query = req.query as unknown as Pick<EffectiveEventsDto, "id">
      const body = {
        id: query.id,
        status: "-2"
      }
      const resp = await storage.deleteEvent(body)
      res.status(200).json(Resp.Ok(resp))
    } catch (error) {
      next(e)
    }
  })

  r.post(
    "/changeStatus",
    changeStatusValidate,
    validateMiddleWare,
    async function (req: Request, res: Response, next: NextFunction) {
      try {
        const body: Pick<
          EffectiveEventsDto,
          "id" | "status" | "realEndTime" | "realEventPay" | "content"
        > = req.body
        const comment: Omit<CommentDto, "id"> = {
          content: body.content,
          eventId: body.id,
          status: body.status,
          targetUserId: 0,
          createbyUserId: 0,
          createTime: Now()
        }
        const saveCommentResp = await commentStorage.saveComment(comment)
        console.log("saveCommentResp", saveCommentResp)
        const resp = await storage.changeStatus(body)
        res.status(200).json(Resp.Ok(resp))
      } catch (e) {
        next(e)
      }
    }
  )
  r.get("/getCommentsByEventId", async function (req, res, next) {
    try {
      const { id } = req.query
      const data = await commentStorage.getCommentsByEventId(id)
      res.json(Resp.Ok(data))
    } catch (e) {
      next(e)
    }
  })

  return r
}

export default routes
