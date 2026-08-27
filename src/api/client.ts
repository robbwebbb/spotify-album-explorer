import { getAccessToken } from "./auth.js";

const BASE_URL = "https://api.spotify.com/v1";

async function spotifyFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const token = await getAccessToken();
  
  const response = await fetch(`${BASE_URL}${path}`, {
    ...init,
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json",
      ...init?.headers,
    },
  });

  if (response.status === 401) {
    const newToken = await getAccessToken();
    const retryResponse = await fetch(`${BASE_URL}${path}`, {
      ...init,
      headers: {
        "Authorization": `Bearer ${newToken}`,
        "Content-Type": "application/json",
        ...init?.headers,
      },
    });
    
    if (!retryResponse.ok) {
      const error = await retryResponse.text();
      throw new Error(`API error: ${retryResponse.status} ${error}`);
    }
    return retryResponse.json() as Promise<T>;
  }

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`API error: ${response.status} ${error}`);
  }

  if (response.status === 204) {
    return {} as T;
  }

  return response.json() as Promise<T>;
}

export { spotifyFetch };