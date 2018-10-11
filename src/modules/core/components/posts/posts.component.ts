import { Component } from '@angular/core';
import { INearEnd } from '../../directives/overflow/interfaces/near-end.interface';
import { OverflowDirective } from '../../directives/overflow/overflow.directive';

@Component({
    selector: 'core-posts',
    styleUrls: ['./posts.component.scss'],
    templateUrl: './posts.component.html'
})
export class PostsComponent {
    public static readonly PAGE_SIZE: number = 20;
    public posts: Array<boolean>;

    constructor(overflowContainer: OverflowDirective) {
        this.posts = [];

        overflowContainer.isNearEnd$.subscribe((isNearEnd: INearEnd) => {
            if (isNearEnd.vertical) {
                this.addMore();
            }
        });

        this.addMore();
    }

    public addMore(): void {
        for (let x: number = 0; x < PostsComponent.PAGE_SIZE; x++) {
            this.posts.push(false);
        }
    }
}
