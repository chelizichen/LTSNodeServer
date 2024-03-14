// src/routes/index.ts

import { Request, Response, Router } from "express"

function routes(): Router {
  const r = Router()
  // 根目录
  r.get("/", (req: Request, res: Response) =>
    res.status(200).send("Hello Shinp!!!")
  )
  return r
}

export default routes
