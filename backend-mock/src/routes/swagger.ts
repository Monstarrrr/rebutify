import * as express from 'express'
import swaggerJsdoc = require('swagger-jsdoc')
import swaggerUi = require('swagger-ui-express')
import path = require('path')
import { swaggerOptions } from '@/utils/config'

const swaggerRouter = express.Router()

// Initialize swagger-jsdoc with the options
const swaggerSpec = swaggerJsdoc(swaggerOptions)

// Serve the Swagger UI
swaggerRouter.use('/', swaggerUi.serve, swaggerUi.setup(swaggerSpec))
export default swaggerRouter
