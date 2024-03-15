export enum constant {
  SIMP_SERVER_PORT = "SIMP_SERVER_PORT",
  SIMP_SERVER_CONF = "SIMP_SERVER_CONF",
  SIMP_SERVER_STORAGE = "SIMP_SERVER_STORAGE"
}
export enum tables {
  eff_event = "eff_event"
}

export enum dates {
  FMT = "YYYY-MM-DD HH:mm:ss"
}
export const NewError = function (code: number, msg: string) {
  return {
    code: code || -1,
    msg
  }
}
