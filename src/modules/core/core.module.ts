import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './components/app/app.component';
import { PostComponent } from './components/post/post.component';
import { PostsComponent } from './components/posts/posts.component';
import { OverflowDirective } from './directives/overflow/overflow.directive';

@NgModule({
    declarations: [
        AppComponent,
        OverflowDirective,
        PostComponent,
        PostsComponent
    ],
    imports: [
        BrowserModule,
        CommonModule
    ],
    bootstrap: [AppComponent]
})
export class CoreModule {}
