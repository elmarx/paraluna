export type DeviceInformation = (
  | { definition: Definition; supported: true }
  | {
      definition: null;
      supported: false;
    }
) & {
  endpoints: Record<string, Endpoint>;
  friendly_name: string;
  ieee_address: string;
  interview_completed: boolean;
  interviewing: boolean;
  network_address: number;
  type: string;
  date_code?: string;
  model_id?: string;
  power_source?: string;
  software_build_id?: string;
};

export type Definition = {
  description: string;
  exposes: Expose[];
  model: string;
  supports_ota: boolean;
  vendor: string;
};

export type Expose = {
  features?: Feature[];
  type: string;
  access?: number;
  description?: string;
  name?: string;
  property?: string;
  values?: string[];
  unit?: Unit;
  value_max?: number;
  value_min?: number;
  value_off?: boolean;
  value_on?: boolean;
};

export type Feature = {
  access: number;
  description: string;
  name: string;
  property: string;
  type: string;
  value_off?: string;
  value_on?: string;
  value_toggle?: string;
  value_max?: number;
  value_min?: number;
  presets?: Preset[];
  unit?: string;
};

export type Preset = {
  description: string;
  name: string;
  value: number;
};

export enum Unit {
  C = "°C",
  Empty = "%",
  Lqi = "lqi",
}

export type Endpoint = {
  bindings: Binding[];
  clusters: Clusters;
  configured_reportings: ConfiguredReporting[];
};

export type Binding = {
  cluster: string;
  target: Target;
};

export type Target = {
  id: number;
  type: string;
};

export type Clusters = {
  input: string[];
  output: string[];
};

export type ConfiguredReporting = {
  attribute: string;
  cluster: string;
  maximum_report_interval: number;
  minimum_report_interval: number;
  reportable_change: number;
};
