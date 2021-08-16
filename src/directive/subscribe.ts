import { Observable, Subscription } from 'rxjs'
import { noChange } from 'lit'
import { DirectiveResult } from 'lit/directive.js'
import { AsyncDirective, directive } from 'lit/async-directive.js'
import { Templatable } from '..'

type TemplateCallback<T> = (x: T) => Templatable

class Subscribe<T> extends AsyncDirective {
	observable: Observable<T> | undefined
	subscription: Subscription | undefined
	template: TemplateCallback<T>

	render(
		observable: Observable<T>,
		template: TemplateCallback<T>,
		defaultContent?: Templatable
	) {
		this.template = template
		if (this.observable !== observable) {
			this.subscription?.unsubscribe()
			this.observable = observable
			this.subscribe(observable)
		}

		if (defaultContent) {
			return defaultContent
		}

		return noChange
	}

	subscribe(observable: Observable<T>) {
		this.subscription = observable.subscribe((x) => {
			this.setValue(this.template(x))
		})
	}

	disconnected() {
		this.subscription?.unsubscribe()
	}

	reconnected() {
		this.subscribe(this.observable!)
	}
}

export const subscribe = directive(Subscribe) as <T>(
	observable: Observable<T>,
	template: TemplateCallback<T>,
	defaultContent?: Templatable
) => DirectiveResult
