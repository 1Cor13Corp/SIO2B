import {config} from 'dotenv'

config()

export const MONGODB_URI = process.env.MONGODB_URI

export const PORT_URI = process.env.PORT_URI

export const EXP = process.env.EXP

export const SEED = process.env.SEED