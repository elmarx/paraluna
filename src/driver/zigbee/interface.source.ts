import { Observable } from "rxjs";
import {
  BridgeState,
  DeviceInformation,
  ZigbeeMessage,
  ZigbeeSubscription,
} from "./interface";
import { DeviceSource } from "../../devices";
import { JsonObject } from "../../json";

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
  device<T extends JsonObject>(friendlyName: string): Observable<T>;
  device<M extends string>(
    friendlyName: string,
    modelId: M,
  ): Observable<DeviceSource<M>>;

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
