import middy from "@middy/core";
import { APIGatewayEvent, APIGatewayProxyResult, Context } from "aws-lambda";
import { getTableData, PartitionKeys } from "../services/dynamo";
import createHttpError from "http-errors";
import { DYNAMO_TABLE_SCHEMA } from "../model/dynamoModel";

async function getAmountFiled(event: APIGatewayEvent, context: Context): Promise<APIGatewayProxyResult> {
    const tableName = 'grievance-coutner'
    const attributeName = 'audrey-counter'
    
    const access = await getTableData(tableName, attributeName, PartitionKeys.ID)
    const accessResult = DYNAMO_TABLE_SCHEMA.safeParse(access)

    if (!accessResult.success) {
        throw createHttpError(500, 'Invalid data from dynamo', accessResult.error.errors)
    }

    return {
        statusCode: 200,
        body: `amountFiled: ${accessResult.data["audrey-counter"]}`
    }

}

export const getAmountFiledHandler = middy<APIGatewayEvent, APIGatewayProxyResult>()
    .handler(getAmountFiled)