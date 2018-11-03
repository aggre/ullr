import { dom } from './dom'
import { TemplateResult, render } from 'lit-html'

interface SSROptions {
	target: string
	html: string
}

const defaultOptions = {
	target: 'body',
	html: ''
}

const removeCommentsLineBreaks = (h: string) =>
	h.replace(/<\!---->/g, '').replace(/(\r\n\t|\n|\r|\t)/gm, '')

export const ssr = async (
	template: TemplateResult,
	cond: (h: Document) => boolean,
	options: SSROptions = defaultOptions
) => {
	const { target: selector, html } = options
	const ssrDom = dom(html)
	const target = ssrDom.window.document.querySelector(selector)
	if (!target) {
		throw new Error('target is not found!')
	}
	const obs = await new Promise<MutationObserver>(resolve => {
		const observer = new MutationObserver(() => {
			if (cond(ssrDom.window.document)) {
				resolve(observer)
			}
		})
		observer.observe(target, {
			attributes: true,
			subtree: true,
			childList: true,
			characterData: true
		})
		try {
			render(template, target)
		} catch (err) {
			console.error('rendering ended forcibly', err)
			resolve(observer)
		}
	})
	obs.disconnect()
	return [
		removeCommentsLineBreaks(ssrDom.serialize()),
		removeCommentsLineBreaks(target.innerHTML)
	]
}
