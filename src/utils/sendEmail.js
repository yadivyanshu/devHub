const { SendEmailCommand } = require("@aws-sdk/client-ses");
const { sesClient } = require("./sesClient.js");

const createSendEmailCommand = (toAddress, fromAddress, subject, body) => {
    return new SendEmailCommand({
        Destination: {
        CcAddresses: [],
        ToAddresses: [toAddress],
        },
        Message: {
        Body: {
            Html: {
            Charset: "UTF-8",
            Data: body,
            },
            Text: {
            Charset: "UTF-8",
            Data: "This is the text format email",
            },
        },
        Subject: {
            Charset: "UTF-8",
            Data: subject,
        },
        },
        Source: fromAddress,
        ReplyToAddresses: [
        ],
    });
};

const run = async (subject, body) => {
    const sendEmailCommand = createSendEmailCommand(
        "divycic3@gmail.com",
        "info@devhub.work",
        subject,
        body
    );

    try {
        return await sesClient.send(sendEmailCommand);
    } catch (caught) {
        if (caught instanceof Error && caught.name === "MessageRejected") {
        const messageRejectedError = caught;
        return messageRejectedError;
        }
        throw caught;
    }
};

module.exports = { run };