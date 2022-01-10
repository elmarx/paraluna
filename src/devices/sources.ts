import {
  LED1624G9Source,
  LED1836G9Source,
  LED1903C5LED1835C6Source,
} from "./ikea.light";
import { E1524E1810Source, E1743Source } from "./ikea.trigger";
import { E1525E1745Source } from "./ikea.sensor";
import { PowerSwitchSource } from "./switch";
import { JsonRecord } from "fp-ts/Json";

export type DeviceSource<M> = M extends "TRADFRI bulb E27 WW 806lm"
  ? LED1836G9Source
  : M extends "TRADFRI bulb E27 WW 806lm"
  ? LED1836G9Source
  : M extends "TRADFRI on/off switch"
  ? E1743Source
  : M extends "TRADFRI bulb E14 WS 470lm"
  ? LED1903C5LED1835C6Source
  : M extends "TRADFRI remote control"
  ? E1524E1810Source
  : M extends "TRADFRI motion sensor"
  ? E1525E1745Source
  : M extends "TRADFRI bulb E14 CWS opal 600lm"
  ? LED1624G9Source
  : M extends "Plug 01"
  ? PowerSwitchSource
  : JsonRecord;
