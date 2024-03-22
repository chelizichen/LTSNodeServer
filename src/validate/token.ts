import jwt from "jsonwebtoken"

// // 密钥，用于签名token
// const secretKey = "your_secret_key"

// // 生成token的函数
// function generateToken(username: string, expiresAt: number) {
//   // 设置token的有效期
//   const payload = {
//     username: username,
//     exp: expiresAt
//   }

//   // 使用密钥生成token
//   const token = jwt.sign(payload, secretKey)
//   return token
// }

// function authenticateUser(username: string, password: string, user: UserDto) {
//   // 验证密码是否匹配
//   return user.password === password
// }

// function test() {
//   // 假设从客户端接收到的用户名和密码
//   const username = "user1"
//   const password = "password1"

//   // 验证用户身份
//   if (authenticateUser(username, password)) {
//     // 如果验证通过，生成token
//     const expiresAt = Math.floor(Date.now() / 1000) + 60 * 60 * 24 // 假设token有效期为一天
//     const token = generateToken(username, expiresAt)
//     console.log("Token:", token)
//   } else {
//     console.log("Authentication failed")
//   }
// }
