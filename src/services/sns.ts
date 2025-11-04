import AWS from "aws-sdk";
import createError from "http-errors";
import 'dotenv/config'

const snsClient = new AWS.SNS();

// Publishes the provided message to the configured SNS topic so all SMS subscribers receive it.
export const sendMessageToSubscribers = async (message: string): Promise<string> => {
    console.log('enter sns function')

    const topicArn = process.env.SNS_TOPIC_ARN
    console.log('check topic arn')
    if (!topicArn) {
        throw createError(500, "SNS_TOPIC_ARN environment variable is not set.");
    }

    console.log(`attempt publish: ${message}`)
    const result = await snsClient.publish({
        TopicArn: topicArn,
        Message: message
    }).promise();
    console.log('complete publish')

    const messageId = result.MessageId;

    if (!messageId) {
        throw createError(500, "SNS publish operation did not return a MessageId.");
    }

    return messageId;
};
