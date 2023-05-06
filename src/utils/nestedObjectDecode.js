module.exports = nested = (data) => {
  const result = {};

  Object.keys(data).map((element) => {
    if (typeof data[element] == "object") {
      const nestedObject = Object.keys(data[element]);

      // Loop through the nested object
      nestedObject.forEach((nestedKey) => {
        const newKeyName = `${element}.${nestedKey}`;
        // Check if the nested element is further nested object
        if (typeof data[element][nestedKey] == "object") {
          // Execute nested function again
          Object.assign(
            result,
            nested({ [newKeyName]: { ...data[element][nestedKey] } })
          );
        } else {
          // Return the result
          result[newKeyName] = data[element][nestedKey];
        }
      });
    } else {
      result[element] = data[element];
    }
  });
  return result;
};
