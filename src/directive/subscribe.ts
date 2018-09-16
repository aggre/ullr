import { Observable, Subscription } from 'rxjs'
import { html, NodePart, directive, render } from 'lit-html'
import { AsyncOrSyncTemplateResult } from '..'

type TemplateCallback = <T>(x: T) => AsyncOrSyncTemplateResult

window.customElements.define(
	'ullr-sbsc',
	class<T> extends HTMLElement {
		observable: Observable<T>
		template: TemplateCallback
		subscription: Subscription
		defaultContent: AsyncOrSyncTemplateResult
		async connectedCallback() {
			if (this.defaultContent) {
				render(await this.defaultContent, this)
			}
			if (!this.observable) {
				return
			}
			this.subscription = this.observable.subscribe(async x => {
				render(await this.template(x), this)
			})
		}
		disconnectedCallback() {
			if (this.subscription) {
				this.subscription.unsubscribe()
			}
		}
	}
)

export const subscribe = <T>(
	observable: Observable<T>,
	template: TemplateCallback,
	defaultContent?: AsyncOrSyncTemplateResult
) =>
	directive((part: NodePart) => {
		part.setValue(
			html`<ullr-sbsc .observable='${observable}' .template='${template}' .defaultContent='${defaultContent}'></ullr-sbsc>`
		)
		part.commit()
	})
