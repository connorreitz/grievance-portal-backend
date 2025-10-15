import middy from "@middy/core";
import httpRouterHandler from "@middy/http-router";
import { routes } from "./routes";
import httpErrorHandler from "@middy/http-error-handler";
import httpCors from "@middy/http-cors";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";

export const handler = middy<APIGatewayProxyEvent, APIGatewayProxyResult>()
.use(httpCors({origin: '*'}))
.use(httpErrorHandler())
.handler(httpRouterHandler(routes))