export const sleep = async (time: number) =>
	new Promise(resolve => {
		setTimeout(() => resolve(), time)
	})

export const slotSelector = (
	element: Element | null,
	slot: string,
	selector: string
) => {
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
