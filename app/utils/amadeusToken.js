import axios from 'axios';

const getAmadeusToken = async () => {
  const client_id = "19DAuf0O0MY7ur26yNV9xNzBPvmBlvRS";
  const client_secret = "mufNAAw26Dmtz18A";
  console.log(client_id, client_secret)
  const tokenResponse = await axios.post(
    'https://test.api.amadeus.com/v1/security/oauth2/token',
    new URLSearchParams({
      grant_type: 'client_credentials',
      client_id,
      client_secret,
    }),
    {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    }
  );

  return tokenResponse.data.access_token;
};

export default getAmadeusToken;