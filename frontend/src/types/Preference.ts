export const Preference = {
    WINDOW: "WINDOW",
    PRIVATE: "PRIVATE",
    NEAR_PLAY_AREA: "NEAR_PLAY_AREA",
} as const
  
export type Preference = (typeof Preference)[keyof typeof Preference]
