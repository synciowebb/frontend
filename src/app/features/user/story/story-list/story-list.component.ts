import { Location } from '@angular/common';
import { Component } from '@angular/core';
import { UserStory } from 'src/app/core/interfaces/user-story';
import { TokenService } from 'src/app/core/services/token.service';
import { UserService } from 'src/app/core/services/user.service';

@Component({
  selector: 'app-story-list',
  templateUrl: './story-list.component.html',
  styleUrls: ['./story-list.component.scss']
})

export class StoryListComponent {
  usersWithStories: UserStory[] = [];
  currentUserId: string = '';
  selectedUser: UserStory | null = null;

  constructor(
    private userService: UserService,
    private tokenService: TokenService,
    private location: Location,
  ) { }

  ngOnInit() {
    this.currentUserId = this.tokenService.extractUserIdFromToken();
    this.getUsersWithStories();
  }

  getUsersWithStories() {
    this.userService.getUsersWithStories().subscribe({
      next: (users) => {
        this.usersWithStories = users;
        // Move the current user to the top of the list
        if(this.currentUserId !== null) {
          let index = this.usersWithStories.findIndex(user => user.id === this.currentUserId);
          if (index !== -1) {
            let user = this.usersWithStories.splice(index, 1)[0];
            this.usersWithStories.unshift(user);
          }
        }
      },
      error: (error) => {
        console.error(error);
      }
    });
  }

  /**
   * Navigate to the story of the selected user and update the URL by replacing the current state
   * @param user 
   */
  navigateToStory(user: UserStory) {
    this.selectedUser = user;
    this.location.replaceState(`/story/${user.id}`);
  }

  close() {
    this.selectedUser = null;
  }

}
