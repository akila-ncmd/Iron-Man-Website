export const FRAME_COUNT = 169;

export const framePath = (n: number) =>
  `/frames/frame_${String(n).padStart(4, "0")}.jpg`;

export type Dialogue = {
  id: string;
  show: number;
  hide: number;
  quote: string;
  speaker: string;
  film: string;
};

export const DIALOGUES: Dialogue[] = [
  {
    id: "d1",
    show: 0.1,
    hide: 0.3,
    quote: "I shouldn't be alive unless it was for a reason.",
    speaker: "Tony Stark",
    film: "IRON MAN — 2008",
  },
  {
    id: "d2",
    show: 0.35,
    hide: 0.55,
    quote: "Part of the journey is the end.",
    speaker: "Tony Stark",
    film: "AVENGERS: ENDGAME — 2019",
  },
  {
    id: "d3",
    show: 0.6,
    hide: 0.8,
    quote: "Proof that Tony Stark has a heart.",
    speaker: "Pepper Potts",
    film: "IRON MAN — 2008",
  },
];

export const HERO_TEXT_FADE_END = 0.08;
