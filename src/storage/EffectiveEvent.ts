import { Knex } from "knex"
import { tables } from "../constant"
import { Now, dbRsu2Vo, dto2tableFields } from "../lib/utils"
import dayjs from "dayjs"

export function initEventStorage(knex: Knex) {
  const tableName = tables.eff_event
  return {
    saveEvent: async function (dto: Camelize<EffectiveEventsDto>) {
      dto.createTime = Now()
      const pojo = dto2tableFields<EffectiveEventsPojo>(dto)
      const r = await knex.insert(pojo, ["id"]).into(tableName)
      return r
    },
    queryEvents: async function (pagination: Pagination) {
      const resp = await knex
        .select("*")
        .from(tableName)
        .where("title", "like", `%${pagination.keyword}%`)
        .offset(pagination.offset)
        .limit(pagination.size)

      const voResp = dbRsu2Vo(resp)
      return voResp
    },
    changeStatus: async function (
      body: Pick<EffectiveEventsDto, "id" | "status">
    ) {
      return knex(tableName).where("id", body.id).update({
        status: body.status
      })
    }
  }
}
