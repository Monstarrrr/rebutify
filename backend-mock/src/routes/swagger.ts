import * as express from 'express'
import swaggerJsdoc = require('swagger-jsdoc')
import swaggerUi = require('swagger-ui-express')
import path = require('path')
import { swaggerOptions } from '@/utils/config'

// Define the Swagger router
const swaggerRouter = express.Router()

// Initialize swagger-jsdoc with options
// swagger-jsdoc generates an OpenAPI specs from JSDoc comments
const swaggerSpec = swaggerJsdoc(swaggerOptions)

// Serve the Swagger UI with the generated OpenAPI specs
swaggerRouter.use('/', swaggerUi.serve, swaggerUi.setup(swaggerSpec))
export default swaggerRouter
