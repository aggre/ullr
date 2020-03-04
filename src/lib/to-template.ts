import { TemplateResult, html } from 'lit-html'

export const toTemplate = (value: unknown): TemplateResult =>
	value instanceof TemplateResult
		? value
		: html`
				${value}
		  `
