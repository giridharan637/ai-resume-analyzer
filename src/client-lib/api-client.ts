import axios from "axios";

export const apiClient = axios.create({
  baseURL: "/api",
});

const fetcher = <T>(url: string) => apiClient.get<T>(url).then((res) => res.data);

/*
// Example code
// You can use this code as a reference to implement the API client.
// You should use SWR when fetching data and mutate when you implement a mutation (a write operation).

export function useItems() {
  return useSWR<Item[], Error>('/items', fetcher);
}

export async function createItem(name: string) {
  try {
    return await apiClient.post<Item>('/items', { name }).then((res) => res.data);
  } finally {
    await mutate('/items');
  }
}
*/
