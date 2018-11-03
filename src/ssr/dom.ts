import { JSDOM, DOMWindow } from 'jsdom'

interface ExtendedDOMWindow extends DOMWindow {
	Symbol?: SymbolConstructor
}

declare global {
	namespace NodeJS {
		interface Global {
			window: ExtendedDOMWindow
			document: Document
			navigator: Navigator
			location: DOMWindow['location']
			Window: Window
			self: Window
			DocumentFragment: DOMWindow['DocumentFragment']
			Node: DOMWindow['Node']
			Document: DOMWindow['Document']
			DOMParser: DOMWindow['DOMParser']
			Element: DOMWindow['Element']
			HTMLElement: DOMWindow['HTMLElement']
			NodeFilter: DOMWindow['NodeFilter']
			Event: DOMWindow['Event']
			CustomEvent: DOMWindow['CustomEvent']
			MutationObserver: any
			customElements: any
		}
	}
}

let d = new JSDOM()
global.window = global.Window = global.self = d.window
global.document = d.window.document
global.navigator = d.window.navigator
global.location = d.window.location
global.DocumentFragment = d.window.DocumentFragment
global.Node = d.window.Node
global.Document = d.window.Document
global.DOMParser = d.window.DOMParser
global.Element = d.window.Element
global.HTMLElement = d.window.HTMLElement
global.NodeFilter = d.window.NodeFilter
global.Event = d.window.Event
global.CustomEvent = d.window.CustomEvent
global.window.Symbol = Symbol
;(Window as any).prototype = {
	addEventListener: d.window.addEventListener,
	removeEventListener: d.window.removeEventListener
}
// tslint:disable-next-line:no-require-imports no-var-requires
require('mutationobserver-shim')
global.MutationObserver = (window as any).MutationObserver
// tslint:disable-next-line:no-require-imports no-var-requires
require('@webcomponents/custom-elements')
global.customElements = (window as any).customElements
global.customElements.polyfillWrapFlushCallback()

export const dom = (html = '') => {
	const trueDom = new JSDOM(html)
	d = trueDom
	return trueDom
}
