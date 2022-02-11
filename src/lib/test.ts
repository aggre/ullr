// Tslint:disable:no-unnecessary-type-annotation
export const sleep = async (time: number): Promise<void> =>
	new Promise(
		(resolve: (value?: void | PromiseLike<void> | undefined) => void): void => {
			setTimeout(resolve, time)
		}
	)

export const slotSelector = (
	element: Element | undefined,
	slot: string,
	selector: string
): Element | undefined => {
	if (element === null || element === undefined) {
		return
	}

	const { shadowRoot } = element
	const slotEl = (() => {
		if (shadowRoot !== undefined && shadowRoot !== null) {
			return shadowRoot
		}

		return element
	})().querySelector(slot)
	if (slotEl === null) {
		return
	}

	const [assigned] = (slotEl as HTMLSlotElement).assignedNodes()
	const { parentElement } = assigned
	if (parentElement === null) {
		return
	}

	return parentElement.querySelector(selector) ?? undefined
}

export const removeExtraString = (c: string): string =>
	c.replace(/<!--((?!-->)[\w\W])*-->/g, '').trim()
