import middy from "@middy/core";
import { APIGatewayEvent, APIGatewayProxyResult, Context } from "aws-lambda";
import { addToTableNumber, PartitionKeys } from "../services/dynamo";
import createError from "http-errors";
import { sendMessageToSubscribers } from "../services/sns";
import { REQUEST_BODY_SCHEMA } from "../model/bodyModel";

async function publishGrievance(event: APIGatewayEvent, context: Context): Promise<APIGatewayProxyResult> {
    const tableName = process.env.TABLE_NAME ?? 'default'
    const attributeName = 'audrey-counter'
    
    const results = await Promise.all([
        addToTableNumber(tableName, attributeName, PartitionKeys.ID, '1', 1),
        sendMessageToSubscribers(buildGrievanceMessage(event))
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
    console.log('building message')
    if (!event.body) {
        throw createError(500, 'no event body')
    }
    const body = JSON.parse(event.body)
    const bodyResult = REQUEST_BODY_SCHEMA.safeParse(body)

    if (!bodyResult.success) {
        throw createError(400, 'Bad request body')
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