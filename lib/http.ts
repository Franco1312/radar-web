import { ENV } from "@/config/env";

/**
 * HTTP client with timeout and error handling
 */
export class HttpError extends Error {
  constructor(
    message: string,
    public status: number,
    public statusText: string,
    public body?: unknown
  ) {
    super(message);
    this.name = "HttpError";
  }
}

/**
 * Fetch JSON with timeout and error handling
 */
export async function fetchJson<T>(
  url: string,
  init?: RequestInit & { timeoutMs?: number }
): Promise<T> {
  const controller = new AbortController();
  const timeoutMs = init?.timeoutMs ?? ENV.REQUEST_TIMEOUT_MS;
  
  const timeoutId = setTimeout(() => {
    controller.abort();
  }, timeoutMs);

  try {
    const response = await fetch(url, {
      ...init,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      let body: unknown;
      try {
        body = await response.json();
      } catch {
        body = await response.text();
      }
      
      throw new HttpError(
        `HTTP ${response.status}: ${response.statusText}`,
        response.status,
        response.statusText,
        body
      );
    }

    return await response.json();
  } catch (error) {
    clearTimeout(timeoutId);
    
    if (error instanceof HttpError) {
      throw error;
    }
    
    if (error instanceof Error && error.name === "AbortError") {
      throw new HttpError(
        `Request timeout after ${timeoutMs}ms`,
        408,
        "Request Timeout"
      );
    }
    
    throw new HttpError(
      error instanceof Error ? error.message : "Unknown error",
      0,
      "Network Error"
    );
  }
}
