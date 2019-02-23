import { Observable, Subscription } from 'rxjs'
import { html, directive, render, TemplateResult, Part } from 'lit-html'
import { UllrElement } from '../lib/element'
import { DirectiveFunction } from '.'
import { define } from '../lib/define'

type TemplateCallback<T> = (x: T) => TemplateResult

const el = class<T> extends UllrElement {
	observable: Observable<T>
	template: TemplateCallback<T>
	subscription: Subscription
	defaultContent: TemplateResult
	static get is(): string {
		return 'ullr-sbsc'
	}
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

define(el)

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
