import { Observable } from 'rxjs'
import { TemplateResult, NodePart, directive } from 'lit-html'

export const subscribe = <T>(
	observable: Observable<T>,
	template: (x: T) => Promise<TemplateResult> | TemplateResult,
	defaultContent?: Promise<TemplateResult> | TemplateResult
) =>
	directive((part: NodePart) => {
		observable.subscribe(x => part.setValue(template(x)))
		if (defaultContent) {
			part.setValue(defaultContent)
		}
	})
