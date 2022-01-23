import { Observable } from "rxjs";
import {
  DeviceInformation,
  DeviceMessage,
  ZigbeeMessage,
  ZigbeeSubscription,
} from "./interface";
import { DeviceSource } from "../../devices";
import { JsonRecord } from "fp-ts/Json";
import { BridgeState } from "./codec.bridge";

/**
 * ZigbeeSource interface. Uses function overloading to set the correct types for given (zigbee2mqtt) model ids
 *
 * TODO: use conditional types/dependent types for a cleaner/modularized solution
 */
export interface ZigbeeSource {
  /**
   * subscribe to arbitrary
   * @param subscription
   */
  subscribe(
    subscription: ZigbeeSubscription[] | ZigbeeSubscription,
  ): Observable<ZigbeeMessage>;

  /**
   * subscribe to a zigbee device topic: zigbee2mqtt-base-topic plus friendly name
   *
   * It revives the "last_seen" date if present, but does no further processing, especially no
   * validation if the payload matches the type
   */
  device<T extends JsonRecord>(friendlyName: string): Observable<T>;
  device<M extends string>(
    friendlyName: string,
    modelId: M,
  ): Observable<DeviceSource<M>>;

  /**
   * just like device(): subscribe to a device, but return a DeviceMessage (i.e.: the value/state/payload together
   * with the friendly device name).
   *
   * So it's something between subscribe() and device()
   */
  deviceMessage<T>(friendlyName: string): Observable<DeviceMessage<T>>;
  deviceMessage<M extends string>(
    friendlyName: string,
    modelId: M,
  ): Observable<DeviceMessage<DeviceSource<M>>>;

  /**
   * current state of the bridge
   *
   * @see https://www.zigbee2mqtt.io/information/mqtt_topics_and_message_structure.html#zigbee2mqttbridgestate
   */
  state(): Observable<BridgeState>;

  /**
   * show detailed device information
   *
   * return null if the device is not found
   *
   * @see https://www.zigbee2mqtt.io/information/mqtt_topics_and_message_structure.html#zigbee2mqttbridgedevices
   */
  deviceInfo(friendlyName: string): Observable<DeviceInformation | null>;

  deviceInfos(): Observable<DeviceInformation[]>;
}
