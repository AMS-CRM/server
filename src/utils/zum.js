const axios = require("axios");

// Function to create zumrails user to initate later transfers
async function createZumUser(
  token,
  FirstName,
  LastName,
  Email,
  PhoneNumber,
  ClientUserId,
  InstitutionNumber,
  TransitNumber,
  AccountNumber
) {
  const URL = `${process.env.ZUM_ENDPOINT}/user`;

  try {
    // Compose the zumrails payload
    const data = {
      FirstName,
      LastName,
      Email,
      PhoneNumber,
      ClientUserId,
      BankAccountInformation: {
        InstitutionNumber,
        TransitNumber,
        AccountNumber,
      },
    };

    console.log(data);
    // Send the axios request to create new user
    return await axios.post(URL, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (error) {
    console.log(error);
    throw new Error(error);
  }
}

// Function to send request to create e-transfer
async function transfer(token, transferMethod, data) {
  const URL = `https://api-app.zumrails.com/api/transaction`;

  // Compose the data
  data = {
    ZumRailsType: "AccountsPayable",
    TransactionMethod: transferMethod,
    Memo: "Pay",
    WalletId: "27dc3323-1426-45df-8e74-fa0d8d4a72cc",
    ...data,
  };

  // Send the request to create transaction
  try {
    return await axios.post(URL, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (error) {
    console.log(error);
    throw new Error(error);
  }
}

// Function to connect to zumrails account
async function zumConnect() {
  const username = process.env.ZUM_USERNAME;
  const password = process.env.ZUM_PASSWORD;
  const URL = `${process.env.ZUM_ENDPOINT}/Authorize`;

  return await axios.post(URL, {
    username,
    password,
  });
}
/*
const TOKEN =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1bmlxdWVfbmFtZSI6IjE4M2NiNmY5LTNmYWQtNDQ4NS1hMjQxLThmNTViZGU5ZGE2ZSIsImh0dHA6Ly9zY2hlbWFzLm1pY3Jvc29mdC5jb20vd3MvMjAwOC8wNi9pZGVudGl0eS9jbGFpbXMvdXNlcmRhdGEiOiIzZTk5MzdiOS1iYzE3LTRlNDctYjQzYS05ODFjZGI4MzhlMDAiLCJyb2xlIjoiQVBJIiwibmFtZWlkIjoiRmxhd2xlc3MgVGVjaG5vbG9naWVzIEluYyIsImFjdG9ydCI6IkN1c3RvbWVyIiwibmJmIjoxNjg4MTM4OTQ3LCJleHAiOjE2ODgxNDI1NDcsImlhdCI6MTY4ODEzODk0N30.KZ2AVRbg6mg1sPXAmwTxdeSs24ClKx5PV8GrfUjoWEA";
data.forEach((transferData) => {
  transfer(TOKEN, "Interac", {
    Amount: transferData.amount,
    User: {
      firstname: transferData.firstName,
      lastname: transferData.lastName,
      email: transferData.email,
    },
    InteracHasSecurityQuestionAndAnswer: true,
    InteracSecurityQuestion: "Name of the city",
    InteracSecurityAnswer: "brampton",
  });
});*/

module.exports = {
  zumConnect,
  transfer,
  createZumUser,
};
