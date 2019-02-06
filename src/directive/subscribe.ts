import { Observable, Subscription } from 'rxjs'
import { html, directive, render, TemplateResult, Part } from 'lit-html'
import { DirectiveFunction } from '.'

type TemplateCallback<T> = (x: T) => TemplateResult

window.customElements.define(
	'ullr-sbsc',
	class<T> extends HTMLElement {
		observable: Observable<T>
		template: TemplateCallback<T>
		subscription: Subscription
		defaultContent: TemplateResult
		connectedCallback(): void {
			if (this.defaultContent) {
				render(this.defaultContent, this)
			}
			if (!this.observable) {
				return
			}
			this.subscription = this.observable.subscribe(x => {
				render(this.template(x), this)
			})
		}
		disconnectedCallback(): void {
			if (this.subscription) {
				this.subscription.unsubscribe()
			}
		}
	}
)

// tslint:disable:no-unnecessary-type-annotation
const f = <T>(
	observable: Observable<T>,
	template: TemplateCallback<T>,
	defaultContent?: TemplateResult
): DirectiveFunction => (part: Part): void => {
	part.setValue(
		html`
			<ullr-sbsc
				.observable="${observable}"
				.template="${template}"
				.defaultContent="${defaultContent}"
			></ullr-sbsc>
		`
	)
	part.commit()
}

export const subscribe = directive(f)
