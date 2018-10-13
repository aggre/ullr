import { dom } from './dom'
import { TemplateResult, render } from 'lit-html'

export const ssr = (
	template: TemplateResult,
	callback: (h: string) => any
): MutationObserver => {
	const target = dom.window.document.body
	const observer = new MutationObserver(() => callback(dom.serialize()))
	observer.observe(target, {
		attributes: true,
		subtree: true,
		childList: true,
		characterData: true
	})
	render(template, target)
	return observer
}
