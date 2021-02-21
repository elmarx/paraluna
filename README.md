# 🌘 Paraluna — Reactive Home Automation ☂️

Paraluna is a set of building blocks to implement home automation using FRP with typescript.

"Reactive" is a great way to model home automation, since home automation is basically event driven.

## Sinks and Sources

The idea of paraluna is that your home-automation consists of sinks and sources. Sources are streams of events or rather values, like triggers or sensors which provide read-only values. 
If you think of the typical reactive/rxjs examples how to implement autocomplete with rxjs (including debounce etc.), one could imagine how powerful this model ist.

Sinks on the other side allow writing values, e.g. a bulb that receives a brightness value.

To automate your home, sinks can be connected via transformations to sources, so they can *react* to events.

This basic idea of "sinks" and "sources" is inspired by the [cycle.js](https://cycle.js.org/) framework.                   

## Integration

Paraluna works great with zigbee2mqtt, but also supports home-assistant. 
Typically, devices can be controlled directly via mqtt/zigbee2mqtt, but to reuse automation/scripts/scenes it makes sense
to use home-assistant as proxy.

Also, home-assistant offers additional "sensors" (or entities to be precise in hass-speak) via it's integrations that are not availbale via mqtt, e.g. Weather Information, Device Information (from mobile phones), weather, sunset etc.

Other systems could be integrated later.

### zigbee2mqtt

- uses [mqtt](https://www.npmjs.com/package/mqtt) (and [mqtt-async](https://github.com/mqttjs/async-mqtt)) directly.
- requires `experimental.output` set to *attribute_and_json* (attribute would be sufficient, but json is required for home-assistant)
- assumes base topic "zigbee2mqtt""

### home-assistant

- uses [hasso](https://github.com/elmarx/hasso) to access home-assistant
