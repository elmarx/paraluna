export type JsonPrimitive = string | number | boolean;
export type JsonArray = JsonValue[];
export type JsonObject = { [n: string]: JsonValue };
export type JsonValue = JsonPrimitive | JsonArray | JsonObject;
