import { Directive, ElementRef } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { INearEnd } from './interfaces/near-end.interface';
import { IScrollPosition } from './interfaces/scroll-position.interface';

@Directive({
    selector: '[core-overflow]'
})
export class OverflowDirective {
    public onScroll$: Observable<IScrollPosition>;
    public isNearEnd$: Observable<INearEnd>;
    private _onScroll: BehaviorSubject<IScrollPosition>;

    constructor(elementRef: ElementRef<HTMLElement>) {
        const element: HTMLElement = elementRef.nativeElement;

        if (!OverflowDirective.isScrollableElement(element)) {
            throw new Error('Element not scrollable');
        }

        this._onScroll = new BehaviorSubject<IScrollPosition>(OverflowDirective.createScrollEvent(element));
        this.onScroll$ = this._onScroll.asObservable();

        let lastIsNearEnd: INearEnd = {} as INearEnd;

        this.isNearEnd$ = this._onScroll.asObservable().pipe(map((scrollEvent: IScrollPosition) => {
            return {
                horizontal: ((element.scrollWidth - element.offsetWidth) - scrollEvent.horizontal) < 500,
                vertical: ((element.scrollHeight - element.offsetHeight) - scrollEvent.vertical) < 500
            };
        }), filter((isNearEnd: INearEnd) => {
            if (!(lastIsNearEnd.horizontal === isNearEnd.horizontal && lastIsNearEnd.vertical === isNearEnd.vertical)) {
                lastIsNearEnd = isNearEnd;

                return true;
            }

            return false;
        }));

        element.addEventListener('scroll', (event: UIEvent) => {
            if (OverflowDirective.isScrollableElement(event.target)) {
                this._onScroll.next(OverflowDirective.createScrollEvent(element));
            }
        });
    }

    private static createScrollEvent(element: HTMLElement): IScrollPosition {
        return {
            horizontal: element.scrollLeft,
            vertical: element.scrollTop
        };
    }

    private static isScrollableElement(target: EventTarget | null): target is HTMLElement {
        return !!target && 'scrollTop' in target && 'scrollLeft' in target;
    }
}
