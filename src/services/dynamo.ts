
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, GetCommand, UpdateCommand } from "@aws-sdk/lib-dynamodb";

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
        console.error('Error fetching data from DynamoDB:', error);
        throw error;
    }
};

//
export const addToTableNumber = async (
    table: string,
    attribute: string,
    key: PartitionKeys,
    amount: number
): Promise<number> => {
    const updateResult = await docClient.send(new UpdateCommand({
        TableName: table,
        Key: {
            [key]: attribute
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

    const updatedValue = updateResult.Attributes?.[attribute];

    if (typeof updatedValue !== 'number') {
        throw new Error(`Failed to update numeric attribute "${attribute}" on table "${table}".`);
    }

    return updatedValue;
}


export enum PartitionKeys {
    ID = 'grievance-id',
  }
