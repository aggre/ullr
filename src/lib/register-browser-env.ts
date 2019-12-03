import browserEnv from 'browser-env'

export const registerBrowserEnv = (): void => {
	if (
		typeof global !== 'undefined' &&
		'window' in global &&
		'customElements' in global
	) {
		return
	}

	browserEnv()

	const customElementsMap: Map<string, HTMLElement> = new Map()
	const customElements = {
		writable: false,
		value: {
			define: (name: string, elm: HTMLElement) => {
				customElementsMap.set(name, elm)
			},
			get: (name: string) => customElementsMap.get(name)
		}
	}
	Object.defineProperty(window, 'customElements', customElements)
	Object.defineProperty(global, 'customElements', customElements)
}
