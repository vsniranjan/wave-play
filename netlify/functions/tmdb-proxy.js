exports.handler = async (event, context) => {
  const apiKey = process.env.TMDB_API_KEY;

  if (!apiKey) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "TMDB_API_KEY not configured" }),
    };
  }

  const { endpoint, ...params } = event.queryStringParameters || {};

  if (!endpoint) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "endpoint parameter required" }),
    };
  }

  const queryString = new URLSearchParams({
    api_key: apiKey,
    ...params,
  }).toString();

  try {
    const response = await fetch(
      `https://api.themoviedb.org/3${endpoint}?${queryString}`
    );

    if (!response.ok) {
      return {
        statusCode: response.status,
        body: JSON.stringify({
          error: `TMDB API error: ${response.status}`,
        }),
      };
    }

    const data = await response.json();

    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: "Failed to fetch from TMDB",
        details: error.message,
      }),
    };
  }
};
