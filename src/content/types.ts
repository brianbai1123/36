export const SECTIONS = ["胜战计", "敌战计", "攻战计", "混战计", "并战计", "败战计"] as const;

export type SectionName = (typeof SECTIONS)[number];

export type OriginalEntry = {
  n: number;
  section: SectionName;
  no: string;
  title: string;
  original: string;
  notes: string[];
  translation: string;
};

export type Check = {
  question: string;
  answer: string;
};

export type ChainLink = {
  via?: string;
  claim: string;
  detail: string;
};

export type Reading = {
  understand: string;
  core: string;
  chain: ChainLink[];
  breaks: string[];
  plain: string;
  checks: Check[];
};

export type Entry = OriginalEntry & Reading;

export type SectionMeta = {
  name: SectionName;
  range: string;
  from: number;
  to: number;
  blurb: string;
};

export const SECTION_META: SectionMeta[] = [
  {
    name: "胜战计",
    range: "1–6",
    from: 1,
    to: 6,
    blurb: "自己占优势时怎么打。藏住真意，挑对方最薄的地方下手。",
  },
  {
    name: "敌战计",
    range: "7–12",
    from: 7,
    to: 12,
    blurb: "双方势均力敌时怎么打。虚实相生，等对方先乱。",
  },
  {
    name: "攻战计",
    range: "13–18",
    from: 13,
    to: 18,
    blurb: "主动进攻时怎么打。先摸清虚实，再引诱、再擒首。",
  },
  {
    name: "混战计",
    range: "19–24",
    from: 19,
    to: 24,
    blurb: "局面混乱时怎么打。抽掉根源，乱中取利，分清远近。",
  },
  {
    name: "并战计",
    range: "25–30",
    from: 25,
    to: 30,
    blurb: "对付盟友和多方角力。悄悄换掉关键，一步步掌握主导。",
  },
  {
    name: "败战计",
    range: "31–36",
    from: 31,
    to: 36,
    blurb: "处在劣势时怎么办。攻心、设疑、以假乱真，实在不行就走。",
  },
];
