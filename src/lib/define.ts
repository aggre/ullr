import { UllrElement } from './element'
import when from 'ramda/es/when'

export const define = when(
	(el: typeof UllrElement) =>
		typeof customElements !== 'undefined' &&
		customElements.get(el.is) === undefined,
	el => {
		customElements.define(el.is, el)
	}
)
