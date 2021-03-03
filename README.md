# 🌘 Paraluna — Reactive Home Automation ☂️

![npm](https://img.shields.io/npm/v/paraluna)
 

Paraluna is a set of building blocks to implement home automation using FRP with typescript (and rxjs).

Since every input to your home-automation is typically an event, incoming events can be transformed and written back to devices (e.g. a switch "on" event needs to be written to a "light").

Given that everything is an event you can apply [Event Sourcing](https://martinfowler.com/eaaDev/EventSourcing.html) to build up arbitrary complex "application" state with ease.

On top of that, the model to consume events and return "commands" (to be written to mqtt etc.) makes it possible to model home-automation as pure functions and thus even enable unit testing.         

## Sinks and Sources
               
The idea to communicate with the outside is to think of "sources" as side-effects for input (of events) and "sinks" as side-effects for output (of "commands").
So sources are streams of events or rather values, like triggers or sensors which provide read-only values. Sinks on the other side allow writing values, e.g. a bulb that receives a brightness value.

This basic idea of "sinks" and "sources" is inspired by the [cycle.js](https://cycle.js.org/) framework.      

### RXJS

Building upon [rxjs](https://rxjs.dev/guide/overview) your automation "connects" to an Observable of events and returns observables of "commands" (`{state: "ON"}` via mqtt topic `livingroom/light`).

Given RXJS Operators it's easy to build complex automations (think of the typical reactive/rxjs examples how to implement autocomplete with debounce etc.).

## When to use paraluna?

- when modeling your home automation tasks as *reactive streams*, *sinks & sources* and *event sourced* fits your way of thinking
- when programming-capabilities of other platforms are not sufficient (e.g. home-assistant)
- when writing typescript/code is more convenient than [writing yaml](https://www.home-assistant.io/docs/automation/basics/), using [Node-RED](https://nodered.org/)
- you want to unit-test your automations
- you like rxjs and typescript

## Integration

Paraluna works great with mqtt (e.g. [zigbee2mqtt](https://www.zigbee2mqtt.io/)), but also supports [home-assistant](https://www.home-assistant.io/). Supporting other "systems" is just a matter of defining appropriate drivers (sources and sinks).

Typically, devices can be controlled directly via mqtt/zigbee2mqtt, but to reuse automation/scripts/scenes it makes sense
to use home-assistant as proxy.

Also, home-assistant offers additional "sensors" (or entities to be precise in hass-speak) via it's integrations that are not available via mqtt, e.g. Weather Information, Device Information (from mobile phones), sunset etc.

### zigbee2mqtt

- uses [mqtt](https://www.npmjs.com/package/mqtt) (and [mqtt-async](https://github.com/mqttjs/async-mqtt)) directly.

#### Required settings

- `advanced.last_seen` *ISO_8601* not required directly, but used in type definitions
- `device_options.retain` *true* simplifies usage, especially startup

##### Device specific

- `simulated_brightness` for [Ikea E1743 (TRADFRI ON/OFF switch)](https://www.zigbee2mqtt.io/devices/E1743.html)
  
#### Assumes defaults 

- base topic "zigbee2mqtt" (`mqtt.base_topic`)
- json message format (`exerimental.output` "json" or "attribute_and_json")

### home-assistant

- uses [hasso](https://github.com/elmarx/hasso) to access home-assistant

## Examples

Run examples either via [nodemon](https://www.npmjs.com/package/nodemon) (during development to watch for changes) or via [ts-node](https://www.npmjs.com/package/ts-node) directly.

The examples expect the following environment variables to be set.

- `HASS_TOKEN`
- `HASS_URL`
- `MQTT_HOST`
- `MQTT_USER`
- `MQTT_PASSWORD`

With [direnv](https://direnv.net/) the proper values may be set into a local `.envrc` file:

```shell
# copy the example file
$ cp .envrc.local{.sample,}
# set custom values
$ $EDITOR .envrc.local
# if not yet done, allow the .envrc file
$ direnv allow
```

### ts-node

```shell
$ cd examples
$ ts-node index.ts
```

### nodemon

To make nodemon/ts-node work with typescript project references and also watching changes in src, calling nodemon is a bit counter-intuitive. It needs to be called in project-root, but the `examples` path needs to be omitted.

```shell
$ nodemon index.ts
```
