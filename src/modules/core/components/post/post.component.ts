import { Component, HostBinding, Input, OnInit } from '@angular/core';

@Component({
    selector: 'core-post',
    styleUrls: ['./post.component.scss'],
    templateUrl: './post.component.html'
})
export class PostComponent implements OnInit {
    @Input('corePostSeen')
    @HostBinding('class.is-seen')
    public seen: boolean;

    @HostBinding('style.height')
    public height: number;

    public ngOnInit(): void {
        this.height = Math.round(1000 * Math.random());
    }
}
