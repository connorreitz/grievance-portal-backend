import middy from "@middy/core";
import { APIGatewayEvent, APIGatewayProxyResult, Context } from "aws-lambda";
import { getTableData, PartitionKeys } from "../services/dynamo";
import createHttpError from "http-errors";
import { DYNAMO_TABLE_SCHEMA } from "../model/dynamoModel";

async function getAmountFiled(): Promise<APIGatewayProxyResult> {
    const tableName = process.env.TABLE_NAME ?? 'default'
    const keyId = '1'
    
    const access = await getTableData(tableName, keyId, PartitionKeys.ID)
    const accessResult = DYNAMO_TABLE_SCHEMA.safeParse(access)

    if (!accessResult.success) {
        throw createHttpError(500, 'Invalid data from dynamo')
    }

    return {
        statusCode: 200,
        body: `{amountFiled: ${accessResult.data["audrey-counter"]}}`
    }

}

export const getAmountFiledHandler = middy<APIGatewayEvent, APIGatewayProxyResult>()
    .handler(getAmountFiled)