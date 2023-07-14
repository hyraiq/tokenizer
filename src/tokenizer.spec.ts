import { Tokenizer } from './tokenizer';

describe('tokenizer', () => {
  it('should return world', () => {
    expect(Tokenizer.hello()).toBe('world');
  });
});
