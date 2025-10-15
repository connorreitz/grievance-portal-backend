import AWS from "aws-sdk";
import createHttpError from "http-errors";

const snsClient = new AWS.SNS();

// Publishes the provided message to the configured SNS topic so all SMS subscribers receive it.
export const sendTextMessageToSubscribers = async (message: string): Promise<string> => {
    if (!message.trim()) {
        throw createHttpError(400, "SNS message must be a non-empty string.");
    }

    const topicArn = process.env.SNS_TOPIC_ARN;

    if (!topicArn) {
        throw createHttpError(500, "SNS_TOPIC_ARN environment variable is not set.");
    }

    const result = await snsClient.publish({
        TopicArn: topicArn,
        Message: message
    }).promise();

    const messageId = result.MessageId;

    if (!messageId) {
        throw createHttpError(500, "SNS publish operation did not return a MessageId.");
    }

    return messageId;
};
