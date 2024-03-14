// src/routes/index.ts

import { Request, Response, Router } from "express"

function routes(): Router {
  const r = Router()
  // 根目录
  r.get("/", (req: Request, res: Response) => {
    res.status(200).send("Hello Shinp!!!")
  })

  r.post("/saveEvent", function (req, res) {
    const body: Camelize<EffectiveEventsDto> = req.body
    res.status(200).send(body.content)
  })
  return r
}

export default routes
