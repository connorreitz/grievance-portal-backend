
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, GetCommand, UpdateCommand } from "@aws-sdk/lib-dynamodb";
import createHttpError from "http-errors";

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

export const getTableData = async (table: string, id: string, key: PartitionKeys): Promise<Record<string, any> | undefined> => {
    try {
        const command = new GetCommand({
            TableName: table,
            Key: {
                [key]: id
            }
        });

        const response = await docClient.send(command);
        console.log(response.Item);
        return response.Item;
    } catch (error) {
        throw createHttpError(500, 'Error fetching from dynamo')
    }
};

export const addToTableNumber = async (
    table: string,
    attribute: string,
    key: PartitionKeys,
    id: string,
    amount: number
): Promise<number> => {
    let updateResult
    try {
        console.log('attempt table update')
    updateResult = await docClient.send(new UpdateCommand({
        TableName: table,
        Key: {
            [key]: id
        },
        UpdateExpression: 'ADD #attr :amount',
        ConditionExpression: 'attribute_exists(#attr)',
        ExpressionAttributeNames: {
            '#attr': attribute
        },
        ExpressionAttributeValues: {
            ':amount': amount
        },
        ReturnValues: 'UPDATED_NEW'
    }));
    console.log('complete table update')

} catch (error) {
    throw createHttpError(500, 'Error updating counter');
}

    const updatedValue = updateResult.Attributes?.[attribute];

    if (typeof updatedValue !== 'number') {
        throw createHttpError(500, `Failed to update numeric attribute "${attribute}" on table "${table}".`);
    }

    return updatedValue;
}


export enum PartitionKeys {
    ID = 'grievance-id',
  }
