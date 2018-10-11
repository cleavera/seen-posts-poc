import { Component, HostBinding, Input } from '@angular/core';

@Component({
    selector: 'core-post',
    styleUrls: ['./post.component.scss'],
    templateUrl: './post.component.html'
})
export class PostComponent {
    @Input('corePostSeen')
    @HostBinding('class.is-seen')
    public seen: boolean;

    @Input('corePostHeight')
    @HostBinding('style.height')
    public height: number;
}
