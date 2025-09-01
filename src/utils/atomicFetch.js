export const atomicFetch = async (
  url,
  init = {
    method: "GET",
    headers: {},
    body: {},
    withAuth: true,
    signal: null,
  }
) => {
  const headers = new Headers({
    "Content-Type": "application/json",
    "X-timezone-region": Intl.DateTimeFormat().resolvedOptions().timeZone,
    "Accept-Language": language?.split("-")[0] || `en`,
    ...(init.headers || {}),
  });
  // Automatically add authorization header
  if (init?.withAuth ?? true) {
    const accessToken = localStorage.getItem("accessToken");
    headers.append("Authorization", `Bearer ${accessToken}`);
  }
  // Configure request
  let requestObj = {
    method: init.method,
    signal: init.signal,
    headers,
  };

  if (["POST", "PUT", "PATCH"].includes(init.method)) {
    requestObj.body = JSON.stringify(init.body);
  }

  const response = await fetch(url, requestObj);
  const json = await response.json();

  return {
    data: json.data,
    error: json.error,
    success: json.isSuccess,
  };
};
