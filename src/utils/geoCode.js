const NodeGeocoder = require("node-geocoder");

const addressToGeoCode = async (address) => {
  const geocoder = NodeGeocoder({
    provider: process.env.GEO_CODE_PROVIDER,
    apiKey: process.env.GEO_CODE_API,
  });
  return await geocoder.geocode(address);
};

module.exports = {
  addressToGeoCode,
};
