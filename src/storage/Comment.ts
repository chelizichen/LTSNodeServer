import { Knex } from "knex"
import { tables } from "../constant"
import { FMT_DAY, dbRsu2Vo, dto2tableFields } from "../lib/utils"

export function initCommentStorage(knex: Knex) {
  const tableName = tables.eff_eve_comment
  return {
    saveComment: async function (dto: Omit<CommentDto, "id">) {
      const pojo = dto2tableFields<CommentPojo>(dto)
      console.log("storage | pojo | ", JSON.stringify(pojo))
      const r = await knex.insert(pojo, ["id"]).into(tableName)
      return r
    },
    getCommentsByEventId: async function (id: string) {
      const resp = await knex.select("*").from(tableName).where("event_id", id)
      let voResp = dbRsu2Vo<CommentDto[]>(resp)
      console.log("getCommentsByEventId | voResp", voResp)
      voResp = voResp.map((v) => {
        v.createTime = FMT_DAY(v.createTime)
        return v
      })
      return voResp
    }
  }
}
