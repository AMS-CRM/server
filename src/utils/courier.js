const courier = require("@trycourier/courier");

const courierClient = courier.CourierClient({
  authorizationToken: process.env.COURIER_TOKEN,
});

// Create a courier profile
const createCourierProfile = async (
  userId,
  name,
  email,
  phone,
  expoPushToken = null
) => {
  try {
    const createProfile = await courierClient.replaceProfile({
      recipientId: userId,
      profile: {
        email,
        name,
        phone,
        expo: {
          token: expoPushToken,
        },
      },
    });
    if (createProfile.status !== "SUCCESS") {
      throw new Error("Something went wrong when createing a profile");
    }

    // Subscribe the user to thel ist
    const subscribe = await courierClient.lists.subscribe(
      process.env.DEFAULT_PUSH_NOTIFICATION_LIST,
      userId
    );

    return true;
  } catch (error) {
    throw new Error(error);
  }
};

// Send notification to a list
const pushNotificationList = async (list, title, message, data = {}) => {
  try {
    const response = await courierClient.send({
      message: {
        to: {
          list_id: list,
        },
        content: {
          title: title,
          body: message,
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
    console.log(response);
  } catch (error) {
    throw new Error(error);
  }
};

// Send push notification to a specific push token
const pushNotification = async (pushToken) => {
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

/*
pushNotificationList("crew", "Hello 👍", "This is first notification to list");
/*
createCourierProfile(
  "0460766e-8463-4905-ae98-b72c7aef41d6",
  "Shivdeep Singh",
  "deep.shiv880@gmail.com",
  "234343"
);

(async () => {
  const { profile } = await courierClient.getProfile({
    recipientId: "63e7f11cdb4ca04d769dea70",
  });
  console.log(profile);
})();
*/

module.exports = {
  pushNotification,
  pushNotificationList,
  createCourierProfile,
};
