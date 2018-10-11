import { AfterViewInit, Directive, ElementRef, EventEmitter, Output } from '@angular/core';
import { IIntersection } from '../overflow/interfaces/intersection.interface';
import { OverflowDirective } from '../overflow/overflow.directive';

@Directive({
    selector: '[core-seen]'
})
export class SeenDirective implements AfterViewInit {
    private static readonly MINIMUM_INTERSECTION_PERCENTAGE: number = 0.5;
    private _element: HTMLElement;
    private _overflow: OverflowDirective;
    private _timeout: number | null;

    @Output('core-seen')
    public onSeen: EventEmitter<void> = new EventEmitter<void>();

    constructor(overflow: OverflowDirective, elementRef: ElementRef) {
        const element: HTMLElement = elementRef.nativeElement;

        if (!SeenDirective.isScrollableElement(element)) {
            throw new Error('Element not scrollable');
        }

        this._element = element;
        this._overflow = overflow;
    }

    public ngAfterViewInit(): void {
        this._overflow.onScroll$.subscribe(() => {
            const intersection: IIntersection = this._overflow.getIntersection(this._element);

            if (
                (intersection.horizontal > (this._element.offsetWidth * SeenDirective.MINIMUM_INTERSECTION_PERCENTAGE))
                && (intersection.vertical > (this._element.offsetHeight * SeenDirective.MINIMUM_INTERSECTION_PERCENTAGE))) {
                    if (!this._timeout) {
                        this._timeout = window.setTimeout(() => {
                            this.onSeen.emit();
                        }, 1000);
                    }
            } else if (this._timeout) {
                window.clearTimeout(this._timeout);
                this._timeout = null;
            }
        });
    }

    private static isScrollableElement(target: EventTarget | null): target is HTMLElement {
        return !!target && 'scrollTop' in target && 'scrollLeft' in target;
    }
}
