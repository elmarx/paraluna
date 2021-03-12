import { Observable } from "rxjs";
import {
  E1524E1810Source,
  E1525E1745Source,
  E1743Source,
  LED1624G9Source,
  LED1836G9Source,
  LED1903C5LED1835C6Source,
} from "../../devices";
import { BridgeState, DeviceInformation } from "./interface";
import { ZigbeeMessage } from "./interface.message";

/**
 * ZigbeeSource interface. Uses function overloading to set the correct types for given (zigbee2mqtt) model ids
 *
 * TODO: use conditional types/dependent types for a cleaner/modularized solution
 */
export interface ZigbeeSource {
  message$: Observable<ZigbeeMessage>;
  deviceInfos$: Observable<DeviceInformation[]>;

  /**
   * subscribe to a zigbee device topic: zigbee2mqtt-base-topic plus friendly name
   *
   * It revives the "last_seen" date if present, but does no further processing, especially no
   * validation if the payload matches the type
   */
  device<T>(friendlyName: string): Observable<T>;

  device(
    friendlyName: string,
    modelId: "TRADFRI bulb E27 WW 806lm",
  ): Observable<LED1836G9Source>;

  device(
    friendlyName: string,
    modelId: "TRADFRI on/off switch",
  ): Observable<E1743Source>;

  device(
    friendlyName: string,
    modelId: "TRADFRI bulb E14 WS 470lm",
  ): Observable<LED1903C5LED1835C6Source>;

  device(
    friendlyName: string,
    modelId: "TRADFRI remote control",
  ): Observable<E1524E1810Source>;

  device(
    friendlyName: string,
    modelId: "TRADFRI motion sensor",
  ): Observable<E1525E1745Source>;

  device(
    friendlyName: string,
    modelId: "TRADFRI bulb E14 CWS opal 600lm",
  ): Observable<LED1624G9Source>;

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
}
