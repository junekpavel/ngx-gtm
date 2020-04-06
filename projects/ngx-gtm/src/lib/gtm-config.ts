interface EnabledGtmConfig {

  gtmId: string;
  isEnabled?: true;

}

interface DisabledGtmConfig {

  gtmId?: string;
  isEnabled: false;

}

export type GtmConfig = EnabledGtmConfig | DisabledGtmConfig;
