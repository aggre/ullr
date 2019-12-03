import { Observable, Subscription } from 'rxjs'
import { html, directive, render, TemplateResult, Part } from 'lit-html'
import { UllrElement } from '../lib/element'
import { DirectiveFunction } from '.'
import { define } from '../lib/define'
import { isNodeEnv } from '../lib/is-node-env'

type TemplateCallback<T> = (x: T) => TemplateResult

define(class<T> extends UllrElement {
	observable: Observable<T>
	template: TemplateCallback<T>
	subscription: Subscription
	defaultContent: TemplateResult
	static get is(): string {
		return 'ullr-sbsc'
	}

	connectedCallback(): void {
		if (this.defaultContent !== undefined) {
			render(this.defaultContent, this)
		}

		if (this.observable === undefined) {
			return
		}

		this.subscription = this.observable.subscribe(x => {
			render(this.template(x), this)
		})
	}

	disconnectedCallback(): void {
		if (this.subscription !== undefined) {
			this.subscription.unsubscribe()
		}
	}
})

const f = ((
	content: <T>(
		observable: Observable<T>,
		template: TemplateCallback<T>,
		part: Part,
		defaultContent?: TemplateResult
	) => void
): (<T>(
	observable: Observable<T>,
	template: TemplateCallback<T>,
	defaultContent?: TemplateResult
) => DirectiveFunction) => <T>(
	observable: Observable<T>,
	template: TemplateCallback<T>,
	defaultContent?: TemplateResult
) => (part: Part): void => {
	content(observable, template, part, defaultContent)
})(
	isNodeEnv()
		? <T>(
				observable: Observable<T>,
				template: TemplateCallback<T>,
				part: Part,
				defaultContent?: TemplateResult
		  ): void => {
				part.setValue(defaultContent)
				observable.subscribe(x => {
					part.setValue(
						html`
							<ullr-sbsc>${template(x)}</ullr-sbsc>
						`
					)
					part.commit()
				})
		  }
		: <T>(
				observable: Observable<T>,
				template: TemplateCallback<T>,
				part: Part,
				defaultContent?: TemplateResult
		  ): void => {
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
)

export const subscribe = directive(f) as <T>(
	observable: Observable<T>,
	template: TemplateCallback<T>,
	defaultContent?: TemplateResult
) => (part: Part) => void
