Functional Web Components

**Building Web Components with Functional Programming.**

![CI](https://github.com/aggre/ullr/workflows/CI/badge.svg)
[![Published on npm](https://img.shields.io/npm/v/@aggre/ullr.svg)](https://www.npmjs.com/package/@aggre/ullr)

```

      ___                                       ___
     /__/\                                     /  /\
     \  \:\                                   /  /::\
      \  \:\    ___     ___   ___     ___    /  /:/\:\
  ___  \  \:\  /__/\   /  /\ /__/\   /  /\  /  /:/~/:/
 /__/\  \__\:\ \  \:\ /  /:/ \  \:\ /  /:/ /__/:/ /:/___
 \  \:\ /  /:/  \  \:\  /:/   \  \:\  /:/  \  \:\/:::::/
  \  \:\  /:/    \  \:\/:/     \  \:\/:/    \  \::/~~~~
   \  \:\/:/      \  \::/       \  \::/      \  \:\
    \  \::/        \__\/         \__\/        \  \:\
     \__\/                                     \__\/

```

---

# Installation

Add to lit-html project:

```bash
npm i @aggre/ullr
```

When creating a new project using lit-html as template and RxJS as the state management:

```bash
npm i @aggre/ullr lit-html rxjs
```

Partially supports run on Node.js (with jsdom).

# APIs

## `component`

`component` is a lit-html directive.

Encapsulate the template with Shadow DOM.

```ts
import { html } from 'lit-html'
import { component } from '@aggre/ullr'

export const main = (title: string, desc: string) =>
	component(html`
		<style>
			h1 {
				color: blue;
			}
		</style>
		<main>
			<h1>${title}</h1>
			<p>${desc}</p>
		</main>
	`)
```

| Browser | Node.js                                                                                             |
| ------- | --------------------------------------------------------------------------------------------------- |
| ✅      | 🚸 <br/> Shadow Dom isn't supported. An inside content of Shadow Dom is shown as just an innerHTML. |

---

💡 How to preprocess style tags with PostCSS: 💅 https://github.com/aggre/lit-style

## `subscribe`

`subscribe` is a lit-html directive.

Subscribe to `Observable<T>` of RxJS and re-rendering with a callback function.

When the directive part is removed, it will automatically `unsubscribe`.

```ts
import { html } from 'lit-html'
import { subscribe } from '@aggre/ullr'
import { timer as _timer } from 'rxjs'

export const timer = (initialDelay: number, period: number) =>
	subscribe(
		_timer(initialDelay, period),
		(x) => html` <p>${x}</p> `,
		html` <p>Default content</p> `
	)
```

| Browser | Node.js                                                                             |
| ------- | ----------------------------------------------------------------------------------- |
| ✅      | 🚸 <br/> Create string as a DOM is supported. But auto-unsubscribe isn't supported. |

---

## `customElements`

`customElements` creates a class that can be passed to `customElements.define`.

```ts
import { customElements } from '@aggre/ullr'
import { main } from './main'

const observedAttributes = ['title', 'desc']

const template = ([title, desc]) => main(title, desc)

window.customElements.define(
	'x-app',
	customElements(template, observedAttributes)
)
```

| Browser | Node.js |
| ------- | ------- |
| ✅      | ❌      |

---
