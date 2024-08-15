import * as express from 'express'
import swaggerJsdoc = require('swagger-jsdoc')
import swaggerUi = require('swagger-ui-express')
import path = require('path')
import { swaggerOptions } from '@/utils/config'
import { SwaggerTheme, SwaggerThemeNameEnum } from 'swagger-themes'

// Define the Swagger router
const swaggerRouter = express.Router()

// Initialize swagger-jsdoc with options
// swagger-jsdoc generates an OpenAPI specs from JSDoc comments
const swaggerSpec = swaggerJsdoc(swaggerOptions)

// Define the Swagger theme
const theme = new SwaggerTheme()
const options = {
  explorer: true,
  customCss: theme.getBuffer(SwaggerThemeNameEnum.DARK),
}

// Serve the Swagger UI with the generated OpenAPI specs
swaggerRouter.use('/', swaggerUi.serve, swaggerUi.setup(swaggerSpec, options))
export default swaggerRouter
