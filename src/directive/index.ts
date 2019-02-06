import { Part } from 'lit-html'
import { component } from './component'
import { subscribe } from './subscribe'

export type DirectiveFunction = (part: Part) => void

export { component, subscribe }
