import { UllrElement } from './element'
import when from 'ramda/es/when'

export const define = when(
	(el: typeof UllrElement) => !customElements.get(el.is),
	el => {
		customElements.define(el.is, el)
	}
)
