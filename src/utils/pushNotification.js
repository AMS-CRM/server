const courier = require("@trycourier/courier");

const courierClient = courier.CourierClient({
  authorizationToken: process.env.COURIER_TOKEN,
});

module.exports = pushNotification = async (pushToken) => {
  const response = await courierClient.send({
    message: {
      to: {
        expo: {
          tokens: [pushToken],
        },
      },
      content: {
        title: "Welcome!",
        body: "From Courier",
      },
      routing: {
        method: "single",
        channels: ["expo"],
      },
      data: {
        fakeData: "data",
      },
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
  console.log(response);
};
