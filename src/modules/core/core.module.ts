import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './components/app/app.component';
import { PostComponent } from './components/post/post.component';
import { PostsComponent } from './components/posts/posts.component';
import { OverflowDirective } from './directives/overflow/overflow.directive';
import { SeenDirective } from './directives/seen/seen.directive';

@NgModule({
    declarations: [
        AppComponent,
        OverflowDirective,
        PostComponent,
        PostsComponent,
        SeenDirective
    ],
    imports: [
        BrowserModule,
        CommonModule
    ],
    bootstrap: [AppComponent]
})
export class CoreModule {}
