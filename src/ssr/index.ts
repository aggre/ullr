import { dom } from './dom'
import { TemplateResult, render } from 'lit-html'

const removeComment = (h: string) => h.replace(/<\!---->/g, '')

export const ssr = async (
	template: TemplateResult,
	cond: (h: Document) => boolean
) => {
	const target = dom.window.document.body
	const obs = await new Promise<MutationObserver>(resolve => {
		const observer = new MutationObserver(() => {
			if (cond(dom.window.document)) {
				observer.disconnect()
				resolve(observer)
			}
		})
		observer.observe(target, {
			attributes: true,
			subtree: true,
			childList: true,
			characterData: true
		})
		render(template, target)
	})
	obs.disconnect()
	return [removeComment(dom.serialize()), removeComment(target.innerHTML)]
}
