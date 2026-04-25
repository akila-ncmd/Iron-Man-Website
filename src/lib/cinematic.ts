export const CINE_FRAME_COUNT = 169;

export const cineFramePath = (n: number) =>
  `/frames2/frame_${String(n).padStart(4, "0")}.jpg`;

export type Beat = {
  id: string;
  show: number;
  hide: number;
  label: string;
  quote: string;
  speaker: string;
  film: string;
};

export const BEATS: Beat[] = [
  {
    id: "b1",
    show: 0.1,
    hide: 0.3,
    label: "01 — The Sacrifice",
    quote: "You can rest now.",
    speaker: "Pepper Potts",
    film: "AVENGERS: ENDGAME — 2019",
  },
  {
    id: "b2",
    show: 0.35,
    hide: 0.55,
    label: "02 — The Legacy",
    quote: "Everyone wants a happy ending, right? But it doesn't always roll that way.",
    speaker: "Tony Stark",
    film: "AVENGERS: ENDGAME — 2019",
  },
  {
    id: "b3",
    show: 0.6,
    hide: 0.8,
    label: "03 — Eternity",
    quote: "I love you 3000.",
    speaker: "Tony Stark",
    film: "AVENGERS: ENDGAME — 2019",
  },
];

export const CINE_INTRO_FADE_END = 0.08;
