exports.hello = async (event) => {
  if (!event.queryStringParameters || !event.queryStringParameters.name) {
    return { statusCode: 404, body: `Not Found` }
  }

  const message = {
    statusCode: 200,
    body: `Hello, ${event.queryStringParameters.name}!`
  }
  console.info(message);
  return message;
};
