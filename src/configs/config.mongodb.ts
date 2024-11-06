import dotenv from 'dotenv'
dotenv.config()

interface EnvConfig {
  app: AppConfig
  db: DbConfig
}

interface AppConfig {
  port: string | number
}
interface DbConfig {
  host: string | undefined
  port: string | number
  name: string | undefined
}

const dev: EnvConfig = {
  app: {
    port: process.env.DEV_APP_PORT || 3005
  },
  db: {
    host: process.env.DEV_DB_HOST || 'localhost',
    port: process.env.DEV_DB_PORT || 27017,
    name: process.env.DEV_DB_NAME || 'shopDev'
  }
}

const pro: EnvConfig = {
  app: {
    port: process.env.PROD_APP_PORT || 3000
  },
  db: {
    host: process.env.PROD_DB_HOST || 'localhost',
    port: process.env.PROD_DB_PORT || 27017,
    name: process.env.PROD_DB_NAME || 'shopPro'
  }
}

const config = { dev, pro }

const env: 'dev' | 'pro' = (process.env.NODE_ENV as 'dev' | 'pro') || 'dev'

export default config[env]
