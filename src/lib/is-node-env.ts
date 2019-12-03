const result = typeof process !== 'undefined' && typeof global !== 'undefined'

export const isNodeEnv = (): boolean => result
