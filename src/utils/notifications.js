const courier = require("@trycourier/courier");

const courierClient = courier.CourierClient({
  authorizationToken:
    process.env.COURIER_TOKEN || "pk_prod_QG91AQ0YK6MYK5QW26JP7DN7JBMH",
});

const emailNotifications = async (
  transferFromName,
  transferToEmail,
  receipientName,
  transferAmount,
  template
) => {
  const response = await courierClient.send({
    message: {
      template: template,
      to: {
        email: transferToEmail,
      },
      data: {
        recipientName: receipientName,
        transferAmount: transferAmount,
        currency: "CAD",
        transferFromAccount: transferFromName,
        transferToAccount: transferToEmail,
      },
      routing: {
        method: "single",
        channels: ["email"],
      },
    },
  });
};

const pushNotification = async (pushToken, title, body, data) => {
  const response = await courierClient.send({
    message: {
      to: {
        expo: {
          tokens: [pushToken],
        },
      },
      content: {
        title: title,
        body: body,
      },
      routing: {
        method: "single",
        channels: ["expo"],
      },
      data: data,
      providers: {
        expo: {
          override: {
            ttl: 10,
            sound: "default",
          },
        },
      },
    },
  });
};

module.exports = {
  pushNotification,
  emailNotifications,
};
