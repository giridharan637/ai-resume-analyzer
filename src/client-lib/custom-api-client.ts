import { integrationsClient } from "@/client-lib/shared";

interface ExecuteCustomApiParams {
  method?: string;
  path?: string;
  headers?: Record<string, string>;
  body?: Record<string, unknown> | unknown[];
}

/**
 * Call a Custom API through the Vybe proxy. Can only be used client-side.
 * @param id - The id of the Custom API to call.
 * @param params.method - HTTP method (default: GET)
 * @param params.path - Path to append to the configured domain
 * @param params.headers - Extra headers to include in the request
 * @param params.body - Request body (JSON)
 * @returns The response from the external API
 */
export async function callCustomApi<ResponseType>(id: string, params: ExecuteCustomApiParams): Promise<ResponseType> {
  return integrationsClient.post<ResponseType>(`/custom-apis/${id}/execute`, params).then((res) => res.data);
}
