import yaml from "js-yaml"
import path from "path"
import { readFileSync } from "fs"
export function parseStorageConf(connectionString: string) {
  // 正则表达式用于找到tcp(host:port)部分
  const tcpRegex = /tcp\(([^)]+)\)/
  const tcpMatch = tcpRegex.exec(connectionString)

  if (!tcpMatch) {
    throw new Error("Invalid connection string: tcp(host:port) not found")
  }

  // 分割host和port
  const hostPort = tcpMatch[1].split(":")
  const host = hostPort[0]
  const port = hostPort[1]

  // 分割用户名和密码
  const credentials = connectionString.split("@")[0]
  const [username, password] = credentials.split(":")

  // 获取数据库名（?之后的参数我们不关心）
  const databaseMatch = connectionString.match(/(\/[^?]*)/)
  const database = databaseMatch ? databaseMatch[0].substring(1) : null

  return {
    username,
    password,
    host,
    port: parseInt(port, 10), // 转换为整数
    database
  }
}

export function parseSimpConf(p: string): SimpConf {
  const cwd = process.cwd()
  const confPath = path.join(cwd, p || "simp.yaml")
  const content = readFileSync(confPath, "utf-8")
  const conf = yaml.load(content) as SimpConf
  return conf
}
