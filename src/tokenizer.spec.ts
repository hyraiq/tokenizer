import { globalTokens } from './__fixtures/global';
import { Tokenizer } from './tokenizer';

describe('tokenizer', () => {
  it('should resolve colors', () => {
    const semantic = {
      'default': 'white',
      'secondary': 'grey-25',
      'hover': 'grey-50',
      'active': 'grey-100',
      'selected': 'grey-75',
      'tertiary': 'grey-50',
      'tertiary-hover': 'grey-75',
      'tertiary-active': 'grey-200',
      'tertiary-selected': 'grey-100',
      'brand': 'blue-600',
      'inverse': 'grey-800',
      'inverse-hover': 'grey-700',
      'selected-brand': 'blue-50',
    };
    expect(Tokenizer.with(globalTokens).handle(semantic)).toEqual({
      'default': '#FFFFFF',
      'secondary': '#F9F9FB',
      'hover': '#F0F1F5',
      'active': '#D9DBE3',
      'selected': '#E4E6EC',
      'tertiary': '#F0F1F5',
      'tertiary-hover': '#E4E6EC',
      'tertiary-active': '#C2C6D1',
      'tertiary-selected': '#D9DBE3',
      'brand': '#002FFF',
      'inverse': '#2D3340',
      'inverse-hover': '#3F4655',
      'selected-brand': '#EBF3FE',
    });
  });

  it('throws if reference attempts to use an object color without specifying a property', () => {
    expect(() => Tokenizer.with(globalTokens).handle({
      'foo': 'blue'
    })).toThrowError(/^Resolved 'blue', however it is an object/);
  });

  it('throws if reference attempts to access a property on a string', () => {
    expect(() => Tokenizer.with(globalTokens).handle({
      'foo': 'white-200'
    })).toThrowError(/^Tried to resolve 'white-200', but 'white' is a single value instead of an object/);
  });

  it('throws if cannot find unknown top string token', () => {
    expect(() => Tokenizer.with(globalTokens).handle({
      'foo': 'blarg'
    })).toThrowError(/^Tried to resolve 'blarg', but it is neither a token itself, nor a nested reference/);
  });

  it('throws if cannot find unknown top nested object', () => {
    expect(() => Tokenizer.with(globalTokens).handle({
      'foo': 'blarg-104'
    })).toThrowError(/^Tried to resolve 'blarg-104', but 'blarg' is not a token/);
  });
});
