Functional Web Components

```
 __  __     __         __         ______
/\ \/\ \   /\ \       /\ \       /\  == \
\ \ \_\ \  \ \ \____  \ \ \____  \ \  __<
 \ \_____\  \ \_____\  \ \_____\  \ \_\ \_\
  \/_____/   \/_____/   \/_____/   \/_/ /_/
```

---

# Installation

```
npm i ullr lit-html rxjs
```

# APIs

## `component`

`component` will capsule the result of `html` in the CSS scope(use Shadow DOM).

```ts
component = (template: TemplateResult) => TemplateResult
```

## `customElements`

`customElements` creates a class that can be passed to `customElements.define`.

```ts
customElements = (template: (props: string[]) => TemplateResult, observedAttributes?: string[]) => HTMLElement // Extended HTMLElement
```

## `subscribe`

`subscribe` is a lit-html directive.

Subscribe to `Subscribe<T>` of RxJS and re-rendering with callback function.

```ts
subscribe = <T>(observable: Observable<T>, template: (x: T) => TemplateResult, defaultContent?: TemplateResult | undefined) => (part: NodePart) => void
```

# Usage

Basic usage:

```ts
import { component, customElements } from 'ullr'
import { html } from 'lit-html'

// Create a template with lit-html
const template = (title: string, desc: string) => html`
	<style>
		h1 {
			font-weight: 400;
		}
		p {
			font-size: 1rem;
		}
	</style>
	<h1>${title}</h1>
	<p>${desc}</p>
`

// Create a CSS scope with `component()`
const app = (title: string, desc: string) => component(template(title, desc))

// Create a Custom Elements with `customElements()`
const xApp = customElements(([title, desc]) => app(title, desc), [
	'title',
	'desc'
])

// Register the Custom Elements with `customElements.define()`.
window.customElements.define('x-app', xApp)
```

Template to subscribe RxJS and update:

```ts
import { subscribe } from 'ullr/directive'
import { timer as _timer } from 'rxjs'
import { take, filter } from 'rxjs/operators'

const timer = _timer(10, 1).pipe(
	filter(x => x > 0),
	take(10)
)

const template = html`
	<main>
		${subscribe(
			timer,
			x => html`<p>${x}</p>`,
			html`<p>Default content</p>`
		)}
	</main>
`
```
