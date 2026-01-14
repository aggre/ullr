import { type Observable, type Subscription } from 'rxjs'
import { noChange } from 'lit'
import { type DirectiveResult } from 'lit/directive.js'
import { AsyncDirective, directive } from 'lit/async-directive.js'
import { type Templatable } from '..'

type TemplateCallback<T> = (x: T) => Templatable

type StoreApi<T> = {
	getState: () => T
	subscribe: (listener: (state: T, prevState: T) => void) => () => void
}

type Subscribable<T> = Observable<T> | StoreApi<T>

const isStore = <T>(
	subscribable: Subscribable<T>,
): subscribable is StoreApi<T> =>
	typeof (subscribable as StoreApi<T>).getState === 'function'

class Subscribe<T> extends AsyncDirective {
	subscribable: Subscribable<T> | undefined
	subscription: Subscription | undefined
	unsubscribe: (() => void) | undefined
	template: TemplateCallback<T>
	lastValue: T | undefined
	hasValue = false

	render(
		subscribable: Subscribable<T>,
		template: TemplateCallback<T>,
		defaultContent?: Templatable,
	) {
		const templateChanged = this.template !== template
		this.template = template

		if (this.subscribable !== subscribable) {
			this.cleanup()
			this.subscribable = subscribable
			this.subscribe(subscribable)
		} else if (templateChanged && this.hasValue) {
			// Template changed but same subscribable: re-render with last value
			this.setValue(this.template(this.lastValue as T))
		}

		if (defaultContent) {
			return defaultContent
		}

		return noChange
	}

	subscribe(subscribable: Subscribable<T>) {
		if (isStore(subscribable)) {
			// Zustand-like store: render initial state immediately
			this.lastValue = subscribable.getState()
			this.hasValue = true
			this.setValue(this.template(this.lastValue))
			this.unsubscribe = subscribable.subscribe((state) => {
				this.lastValue = state
				this.setValue(this.template(state))
			})
		} else {
			// RxJS Observable
			this.subscription = subscribable.subscribe((x) => {
				this.lastValue = x
				this.hasValue = true
				this.setValue(this.template(x))
			})
		}
	}

	cleanup() {
		this.subscription?.unsubscribe()
		this.unsubscribe?.()
		this.subscription = undefined
		this.unsubscribe = undefined
		this.lastValue = undefined
		this.hasValue = false
	}

	disconnected() {
		this.cleanup()
	}

	reconnected() {
		this.subscribe(this.subscribable!)
	}
}

export const subscribe = directive(Subscribe) as <T>(
	subscribable: Subscribable<T>,
	template: TemplateCallback<T>,
	defaultContent?: Templatable,
) => DirectiveResult
