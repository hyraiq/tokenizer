type GlobalTokens = Record<string|number, string|Record<string|number, string>>;

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
        Tokenizer.resolve(value, this.globalTokens),
      ]),
    );
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
