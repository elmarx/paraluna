import {
  ZigbeeMulitPublish,
  ZigbeePublish,
  ZigbeeSinglePublish,
} from "./interface.sink";

export function isZigbeeSinglePublish(
  p: ZigbeePublish,
): p is ZigbeeSinglePublish {
  return p.hasOwnProperty("friendlyName");
}

export function isZigbeeMultiPublish(
  p: ZigbeePublish,
): p is ZigbeeMulitPublish {
  return p.hasOwnProperty("topic");
}
