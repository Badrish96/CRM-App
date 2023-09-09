const Client = require("node-rest-client").Client;

const client = new Client();

module.exports = (subject, content, recipient, requester) => {
  const reqBody = {
    subject: subject,
    recipientEmail: recipient,
    content: content,
    requester: requester,
  };

  const reqHeaders = {
    "Content-Type": "application/json",
  };

  const args = {
    data: reqBody,
    headers: reqHeaders,
  };
  client.post(
    "http://localhost:5500/notificationService/api/v1/notification",
    args,
    (data, res) => {
      console.log(`Request Sent:: ${data}`);
    }
  );
};
