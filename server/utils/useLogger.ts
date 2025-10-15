import pino from 'pino'
import 'pino-roll'
import 'pino-pretty'
import fs from 'node:fs'
import path from 'node:path'

// 确保 logs 目录存在
const logDir = path.resolve('./logs')
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir)
}

export const logger = pino({
  transport: {
    targets: [
      {
        target: 'pino-pretty', // 让日志在控制台更好看
        options: {
          colorize: true,
          translateTime: 'yyyy-mm-dd HH:MM:ss',
          ignore: 'pid,hostname',
        },
      },
      {
        target: 'pino-roll',
        options: {
          file: path.join(logDir, 'app'),
          mkdir: true,
          frequency: 'daily',
          limit: {
            count: 7,
          },
          dateFormat: 'yyyy-MM-dd',
        },
      },
    ],
  },
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
})
