export type Block =
  | { t: "h"; text: string }
  | { t: "p"; text: string }
  | { t: "list"; items: string[] }
  | { t: "formula"; text: string; legend?: string }
  | { t: "example"; title: string; text: string }
  | { t: "mistake"; text: string }
  | { t: "candle"; caption: string; o: number; h: number; l: number; c: number }
  | { t: "series"; caption: string; candles: { o: number; h: number; l: number; c: number }[] };

export interface QuizQuestion {
  q: string;
  options: string[];
  answer: number;
  explain: string;
}

export interface Term {
  term: string;
  def: string;
}

export interface Lesson {
  id: string;
  moduleId: number;
  title: string;
  level: "Новичок" | "Базовый";
  minutes: number;
  goals: string[];
  terms: Term[];
  body: Block[];
  quiz: QuizQuestion[];
}

export interface Module {
  id: number;
  title: string;
  summary: string;
}
