import { dom } from './dom'
import { TemplateResult, render } from 'lit-html'

const removeComment = (html: string) => html.replace(/<\!---->/g, '')

export const ssr = async (
	template: TemplateResult,
	cond: (h: string) => boolean
) => {
	const target = dom.window.document.body
	const [content, obs] = await new Promise<[string, MutationObserver]>(
		resolve => {
			const observer = new MutationObserver(() => {
				const html = removeComment(target.innerHTML)
				if (cond(html)) {
					observer.disconnect()
					resolve([html, observer])
				}
			})
			observer.observe(target, {
				attributes: true,
				subtree: true,
				childList: true,
				characterData: true
			})
			render(template, target)
		}
	)
	obs.disconnect()
	return content
}
