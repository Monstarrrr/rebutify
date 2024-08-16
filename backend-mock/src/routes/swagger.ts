import * as express from 'express'
import swaggerJsdoc = require('swagger-jsdoc')
import swaggerUi = require('swagger-ui-express')
import { swaggerOptions } from '@/utils/config'
import { SwaggerTheme, SwaggerThemeNameEnum } from 'swagger-themes'

// Define the Swagger router
const swaggerRouter = express.Router()

// Generates an OpenAPI specs from JSDoc comments (with swagger options)
const swaggerSpec = swaggerJsdoc(swaggerOptions)

// Define a Swagger UI theme
const theme = new SwaggerTheme()
const options = {
  explorer: true,
  customCss: theme.getBuffer(SwaggerThemeNameEnum.DARK),
}

// Generates the Swagger UI with the generated OpenAPI specs
swaggerRouter.use('/', swaggerUi.serve, swaggerUi.setup(swaggerSpec, options))
export default swaggerRouter
