export const Preference = {
    WINDOW: "WINDOW",
    QUIET: "QUIET",
    NEAR_PLAY_AREA: "NEAR_PLAY_AREA",
  } as const
  
  export type Preference = (typeof Preference)[keyof typeof Preference]