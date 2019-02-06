// tslint:disable:no-unnecessary-type-annotation
export const sleep = async (time: number): Promise<void> =>
	new Promise(
		(resolve: (value?: void | PromiseLike<void> | undefined) => void): void => {
			setTimeout(resolve, time)
		}
	)

export const slotSelector = (
	element: Element | null,
	slot: string,
	selector: string
): Element | null | undefined => {
	if (!element) {
		return
	}
	const { shadowRoot } = element
	const slotEl = (shadowRoot || element).querySelector(slot)
	if (!slotEl) {
		return
	}
	const [assigned] = (slotEl as HTMLSlotElement).assignedNodes()
	const { parentElement } = assigned
	if (!parentElement) {
		return
	}
	return parentElement.querySelector(selector)
}
