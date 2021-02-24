import { Observable } from "rxjs";
import { E1743SourceProperties, LED1836G9SourceProperties } from "../devices";

/**
 * ZigbeeSource interface. Uses function overloading to set the correct types for given (zigbee2mqtt) model ids
 *
 * TODO: use conditional types/dependent types for a cleaner/modularized solution
 */
export interface ZigbeeSource {
  /**
   * subscribe to a zigbee device topic: zigbee2mqtt-base-topic plus friendly name
   *
   * It revives the "last_seen" date if present, but does no further processing, especially no
   * validation if the payload matches the type
   */
  device<T>(friendlyName: string): Observable<T>;
  device(
    friendlyName: string,
    modelId: "TRADFRI bulb E27 WW 806lm"
  ): Observable<LED1836G9SourceProperties>;
  device(
    friendlyName: string,
    modelId: "TRADFRI on/off switch"
  ): Observable<E1743SourceProperties>;

  /**
   * current state of the bridge
   *
   * https://www.zigbee2mqtt.io/information/mqtt_topics_and_message_structure.html#zigbee2mqttbridgestate
   */
  state(): Observable<"online" | "offline">;
}
