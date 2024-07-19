import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FeedComponent } from './feed/feed.component';
import { ProfileComponent } from './profile/profile.component';
import { MessagesComponent } from './messages/messages.component';
import { CreatePostComponent } from './create-post/create-post.component';
import { LabelsShopComponent } from './labels-shop/labels-shop.component';
import { PaymentInfoComponent } from './payment-info/payment-info.component';
import { PostDetailComponent } from 'src/app/shared/components/post-detail/post-detail.component';
import { authGuard } from 'src/app/core/guards/auth.guard';
import { RoleEnum } from 'src/app/core/interfaces/user';

const routes: Routes = [
  {
    path: '',
    component: FeedComponent,
  },
  
  {
    path: 'profile/:userId',
    component: ProfileComponent,
  },
  {
    path: 'messages',
    component: MessagesComponent,
    loadChildren: () =>
      import('./messages/messages.module').then((m) => m.MessagesModule),
    canActivate: [authGuard],
    data: { requiredRoles: [RoleEnum.USER] }
  },
  {
    path: 'create-post',
    component: CreatePostComponent,
    canActivate: [authGuard],
    data: { requiredRoles: [RoleEnum.USER] }
  },
  {
    path: 'post/:id',
    component: PostDetailComponent,
  },
  {
    path: 'labels-shop',
    component: LabelsShopComponent
  },
  {
    path: 'payment-info',
    component: PaymentInfoComponent,
    canActivate: [authGuard],
    data: { requiredRoles: [RoleEnum.USER] }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UserHomeRoutingModule {}
