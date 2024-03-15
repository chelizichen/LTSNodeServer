import { Knex } from "knex"
import { tables } from "../constant"
import { dbRsu2Vo, dto2tableFields } from "../lib/utils"

export function initUserStorage(knex: Knex) {
  const tableName = tables.blog_user
  return {
    getList: async function (pagination: Pagination) {
      console.log("pagination", pagination)
      const resp = await knex
        .select("*")
        .from(tableName)
        .where("user_name", "like", `%${pagination.keyword}%`)
        .offset(pagination.offset)
        .limit(pagination.size)
      console.log("resp", resp)
      const voResp = dbRsu2Vo(resp)
      return voResp
    },
    changeLevel: async function (body: Pick<UserDto, "id" | "level">) {
      return await knex(tableName).where("id", body.id).update({
        level: body.level
      })
    },
    saveUser: async function (dto: UserDto) {
      const pojo = dto2tableFields<UserPojo>(dto)
      const r = await knex.insert(pojo, ["id"]).into(tableName)
      return r
    }
  }
}
