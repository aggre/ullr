const result =
	typeof process !== 'undefined' &&
	typeof process.release !== 'undefined' &&
	typeof process.release.name !== 'undefined' &&
	typeof global !== 'undefined'

export const isNodeEnv = (): boolean => result
