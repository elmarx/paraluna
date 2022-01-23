import axios from "axios";
import { from, map, Observable } from "rxjs";
import { HassState } from "./codec.state";
import { unwrap } from "../../utils";

export function hassHttp(
  token: string,
  url: string,
): (entityId: string) => Observable<HassState> {
  const client = axios.create({
    baseURL: url + (url.endsWith("/") ? "" : "/") + "api/states/",
    headers: {
      authorization: `Bearer ${token}`,
      "content-type": "application/json",
    },
  });

  return (entityId: string): Observable<HassState> =>
    from(client.get<unknown>(entityId)).pipe(
      map((r) => unwrap(HassState.decode(r.data))),
    );
}
