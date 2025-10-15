import middy from "@middy/core";
import { APIGatewayEvent, APIGatewayProxyResult, Context } from "aws-lambda";
import { addToTableNumber, PartitionKeys } from "../services/dynamo";
import createHttpError from "http-errors";
import { sendTextMessageToSubscribers } from "../services/sns";
import { REQUEST_BODY_SCHEMA } from "../model/bodyModel";

async function publishGrievance(event: APIGatewayEvent, context: Context): Promise<APIGatewayProxyResult> {
    const tableName = 'grievance-coutner'
    const attributeName = 'audrey-counter'
    
    const results = await Promise.all([
        addToTableNumber(tableName, attributeName, PartitionKeys.ID, 1),
        sendTextMessageToSubscribers(buildGrievanceMessage(event))
    ])

    return {
        statusCode: 200,
        body: JSON.stringify({
            updatedCounter: results[0],
            messageId: results[1]
        })
    }
}

function buildGrievanceMessage(event: APIGatewayEvent) {
    const bodyResult = REQUEST_BODY_SCHEMA.safeParse(event.body)

    if (!bodyResult.success) {
        throw createHttpError(400, 'Bad request body', bodyResult.error.errors)
    }

    const data = bodyResult.data

    const message = `
    new grievance filed by audrey

    grievance date: ${data.date}
    severity: ${data.severity}

    ${data.message}
    `

    return message
    

}

export const publishHandler = middy<APIGatewayEvent, APIGatewayProxyResult>()
    .handler(publishGrievance)