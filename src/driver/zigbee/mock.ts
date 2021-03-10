import { Observable, of } from "rxjs";
import { BridgeState, DeviceInformation } from "./interface.bridge";
import { ZigbeeSource } from "./interface.source";

export function zigbeeSourceMock<T>(
  devices: Map<string, Observable<T>> = new Map(),
): ZigbeeSource {
  return {
    device(friendlyName: string): any {
      return devices.get(friendlyName) || of();
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
