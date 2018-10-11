import { Directive, ElementRef } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { IBoundingBox } from './interfaces/bounding-box.interface';
import { IIntersection } from './interfaces/intersection.interface';
import { INearEnd } from './interfaces/near-end.interface';
import { IOffset } from './interfaces/offset.interface';
import { IScrollPosition } from './interfaces/scroll-position.interface';

@Directive({
    selector: '[core-overflow]'
})
export class OverflowDirective {
    public onScroll$: Observable<IScrollPosition>;
    public isNearEnd$: Observable<INearEnd>;
    private _onScroll: BehaviorSubject<IScrollPosition>;
    private _scrollElement: HTMLElement;

    constructor(elementRef: ElementRef<HTMLElement>) {
        const element: HTMLElement = elementRef.nativeElement;

        if (!OverflowDirective.isScrollableElement(element)) {
            throw new Error('Element not scrollable');
        }

        this._scrollElement = element;

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

    public getOffset(child: HTMLElement): IOffset {
        const offset: IOffset = {
            left: 0,
            top: 0
        };

        while (child.offsetParent) {
            if (child === this._scrollElement) {
                return offset;
            }

            offset.left += child.offsetLeft;
            offset.top += child.offsetTop;

            child = child.offsetParent as HTMLElement;
        }

        throw new Error(`${child} does not exist in ${this._scrollElement}`);
    }

    public getIntersection(child: HTMLElement): IIntersection {
        const offset: IOffset = this.getOffset(child);
        const scrollPosition: IScrollPosition = this._onScroll.getValue();

        const viewPortBoundingBox: IBoundingBox = {
            top: scrollPosition.vertical,
            left: scrollPosition.horizontal,
            right: scrollPosition.horizontal + this._scrollElement.offsetWidth,
            bottom: scrollPosition.vertical + this._scrollElement.offsetHeight
        };

        const elementBoundingBox: IBoundingBox = {
            top: offset.top,
            left: offset.left,
            right: offset.left + child.offsetWidth,
            bottom: offset.top + child.offsetHeight
        };

        const intersectionBoundingBox: IBoundingBox = {
            top: Math.min(Math.max(elementBoundingBox.top - viewPortBoundingBox.top, 0), this._scrollElement.offsetHeight),
            left: Math.min(Math.max(elementBoundingBox.left - viewPortBoundingBox.left, 0), this._scrollElement.offsetWidth),
            right: Math.min(Math.max(elementBoundingBox.right - viewPortBoundingBox.left, 0), this._scrollElement.offsetWidth),
            bottom: Math.min(Math.max(elementBoundingBox.bottom - viewPortBoundingBox.top, 0), this._scrollElement.offsetHeight)
        };

        return {
            horizontal: intersectionBoundingBox.right - intersectionBoundingBox.left,
            vertical: intersectionBoundingBox.bottom - intersectionBoundingBox.top
        };
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
