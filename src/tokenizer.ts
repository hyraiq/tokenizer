type GlobalTokens = Record<string|number, string|Record<string|number, string>>;

const ALPHA_SUFFIX = /^([^/]+)\/(\d{1,3})$/;
const SHORTHAND_HEX = /^#([0-9a-f])([0-9a-f])([0-9a-f])$/i;
const FULL_HEX = /^#[0-9a-f]{6}$/i;

export class Tokenizer {
  public static with(globalTokens: GlobalTokens)  {
    return new Tokenizer(globalTokens);
  }

  constructor(private readonly globalTokens: GlobalTokens) {
  }

  public handle(semanticTokens: Record<string, string>): Record<string, string> {
    return Object.fromEntries(
      Object.entries(semanticTokens).map(([key, value]) => [
        key,
        Tokenizer.resolveWithAlpha(value, this.globalTokens),
      ]),
    );
  }

  private static resolveWithAlpha(input: string, globalTokens: GlobalTokens): string {
    if (!input.includes('/')) {
      return this.resolve(input, globalTokens);
    }

    const withAlpha = input.match(ALPHA_SUFFIX);
    if (withAlpha === null) {
      throw new Error(`Tried to resolve '${input}', but '/' must be followed by a percentage, e.g. 'grey-900/40'`);
    }

    const token = withAlpha[1];
    const percent = withAlpha[2];

    if (Number(percent) > 100) {
      throw new Error(`Tried to resolve '${input}', but alpha '${percent}' is not a percentage between 0 and 100`);
    }

    return this.applyAlpha(input, this.resolve(token, globalTokens), Number(percent));
  }

  private static applyAlpha(input: string, value: string, percent: number): string {
    // Shorthand has to be expanded first, or `#fff` at 40% yields the invalid `#fff66`.
    const hex = value.replace(SHORTHAND_HEX, '#$1$1$2$2$3$3');
    if (!FULL_HEX.test(hex)) {
      throw new Error(`Tried to apply alpha to '${input}', but '${value}' is not a hex colour`);
    }

    const channel = Math.round((percent / 100) * 255).toString(16).padStart(2, '0');

    return `${hex}${channel}`.toUpperCase();
  }

  private static resolve(input: string, globalTokens: GlobalTokens) : string {
    if (Object.hasOwn(globalTokens, input)) {
      const exactMatch = globalTokens[input];
      if (typeof exactMatch === 'object') {
        throw new Error(`Resolved '${input}', however it is an object. Should you be using one of the values from this object?`);
      }

      return exactMatch;
    }

    const splitByHyphen = input.match(/^([^-]+)-(.*)$/);
    if (splitByHyphen === null) {
      throw new Error(`Tried to resolve '${input}', but it is neither a token itself, nor a nested reference`);
    }

    const subkey = splitByHyphen[1];
    const rest = splitByHyphen[2];

    if (!Object.hasOwn(globalTokens, subkey)) {
      throw new Error(`Tried to resolve '${input}', but '${subkey}' is not a token`);
    }

    const subset = globalTokens[subkey];

    if (typeof subset === "string") {
      throw new Error(`Tried to resolve '${input}', but '${subkey}' is a single value instead of an object`);
    }

    return this.resolve(rest, subset);
  }
}
