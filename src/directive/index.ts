import { type Part } from 'lit-html'
import { shadow } from './shadow'
import { subscribe } from './subscribe'

export type DirectiveFunction = (part: Part) => void

export { shadow, subscribe }
