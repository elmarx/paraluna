import { EMPTY, Observable } from "rxjs";
import {
  BridgeState,
  DeviceInformation,
  ZigbeeMessage,
  ZigbeeSource,
  ZigbeeSubscription,
} from "./interface";

export function zigbeeSourceMock<T>(
  devices: Map<string, Observable<T>> = new Map(),
  message$: Observable<ZigbeeMessage> = EMPTY,
): ZigbeeSource {
  return {
    subscribe(
      _subscription: ZigbeeSubscription[] | ZigbeeSubscription,
    ): Observable<ZigbeeMessage> {
      return message$;
    },

    device(friendlyName: string): any {
      return devices.get(friendlyName) || EMPTY;
    },
    deviceInfo(_friendlyName: string): Observable<DeviceInformation | null> {
      throw new Error("not yet implemented");
    },
    deviceInfos(): Observable<DeviceInformation[]> {
      throw new Error("not yet implemented");
    },
    state(): Observable<BridgeState> {
      throw new Error("not yet implemented");
    },
  };
}
