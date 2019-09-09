interface ParseResult {
  success: boolean;
  state: typeof ids.SEM_OK | typeof ids.SEM_SKIP;
  length: number;
  matched: number;
  maxMatched: number;
  maxTreeDepth: number;
  nodeHits: number;
  inputLength: number;
  subBegin: number;
  subEnd: number;
  subLength: number;
}

export const ids: {
  ALT: 1;
  CAT: 2;
  REP: 3;
  RNM: 4;
  TRG: 5;
  TBS: 6;
  TLS: 7;
  UDT: 11;
  AND: 12;
  NOT: 13;
  BKR: 14;
  BKA: 15;
  BKN: 16;
  ABG: 17;
  AEN: 18;
  ACTIVE: 100;
  MATCH: 101;
  EMPTY: 102;
  NOMATCH: 103;
  SEM_PRE: 200;
  SEM_POST: 201;
  SEM_OK: 300;
  SEM_SKIP: 301;
  ATTR_N: 400;
  ATTR_R: 401;
  ATTR_MR: 402;
  ATTR_NMR: 403;
  ATTR_RMR: 404;
  LOOKAROUND_NONE: 500;
  LOOKAROUND_AHEAD: 501;
  LOOKAROUND_BEHIND: 502;
  BKR_MODE_UM: 601;
  BKR_MODE_PM: 602;
  BKR_MODE_CS: 603;
  BKR_MODE_CI: 604;
};
export const parser: any;
export const ast: any;
export const utils: {
  getBounds(
    length: number,
    beg: number,
    len: number
  ): {
    beg: number;
    end: number;
  };

  htmlToPage(html: string, title?: string): string;

  parserResultToHtml(result: ParseResult, title?: string): string;

  charsToString(
    chars: number[],
    phraseIndex: number,
    phraseLength: number
  ): string;

  stringToChars(string: string): number[];

  opcodeToString(type: ids[keyof typeof ids]): string;
  stateToString(type: ids[keyof typeof ids]): string;

  asciiChars: string[];

  charToHex(char: number): string;

  charsToDec(chars: number[], beg: number, len: number): string;
  charsToHex(chars: number[], beg: number, len: number): string;
  charsToHtmlEntities(chars: number[], beg: number, len: number): string;

  isUnicode(char: number): boolean;
  charsToUnicode(chars: number[], beg: number, len: number): string;
  charsToJsUnicode(chars: number[], beg: number, len: number): string;
  charsToAscii(chars: number[], beg: number, len: number): string;
  charsToAsciiHtml(chars: number[], beg: number, len: number): string;
  stringToAsciiHtml(str: string): string;
};
