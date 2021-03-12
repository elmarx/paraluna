import { EMPTY, Observable } from "rxjs";
import { ZigbeeSource } from "./interface.source";
import { DeviceAttributeMessage, DeviceMessage } from "./interface.message";
import { BridgeState, DeviceInformation } from "./interface.bridge";

export function zigbeeSourceMock(
  message$: Observable<DeviceMessage | DeviceAttributeMessage> = EMPTY,
  deviceInfos$: Observable<DeviceInformation[]> = EMPTY,
): ZigbeeSource {
  return {
    message$,
    deviceInfos$,

    device(_friendlyName: string): any {
      throw new Error("not yet implemented");
    },
    deviceInfo(_friendlyName: string): Observable<DeviceInformation | null> {
      throw new Error("not yet implemented");
    },
    state(): Observable<BridgeState> {
      throw new Error("not yet implemented");
    },
  };
}
