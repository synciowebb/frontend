import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserHomeRoutingModule } from './user-home-routing.module';
import { UserHomeComponent } from './user-home.component';
import { CreatePostComponent } from './create-post/create-post.component';
import { FeedComponent } from './feed/feed.component';
import { LeftMenuComponent } from './left-menu/left-menu.component';
import { PrimengModule } from 'src/app/primeng/primeng.module';
import { TopMenuComponent } from './top-menu/top-menu.component';
import { CoreModule } from 'src/app/core/core.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { ProfileComponent } from './profile/profile.component';
import { SearchComponent } from './search/search.component';
import { PickerComponent } from '@ctrl/ngx-emoji-mart';
import { StoryListComponent } from '../story/story-list/story-list.component';
import { ViewStoryComponent } from '../story/view-story/view-story.component';
import { SearchSuggestionComponent } from './search/search-suggestion/search-suggestion.component';
import { LabelsShopComponent } from './labels-shop/labels-shop.component';
import { PaymentInfoComponent } from './payment-info/payment-info.component';
import { NotificationsComponent } from './notifications/notifications.component';
import { NotificationsItemComponent } from './notifications/notifications-item/notifications-item.component';
import { FollowerDialogComponent } from './profile/follower-dialog/follower-dialog.component';
import { FollowingDialogComponent } from './profile/following-dialog/following-dialog.component';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    UserHomeComponent,
    CreatePostComponent,
    FeedComponent,
    LeftMenuComponent,
    TopMenuComponent,
    ProfileComponent,
    SearchComponent,
    StoryListComponent,
    ViewStoryComponent,
    SearchSuggestionComponent,
    LabelsShopComponent,
    PaymentInfoComponent,
    NotificationsComponent,
    NotificationsItemComponent,
    FollowerDialogComponent,
    FollowingDialogComponent
  ],
  imports: [
    CommonModule,
    UserHomeRoutingModule,
    PrimengModule,
    CoreModule,
    SharedModule,
    PickerComponent,
    TranslateModule
  ],
})
export class UserHomeModule {}
