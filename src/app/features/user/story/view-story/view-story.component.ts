import { Location } from '@angular/common';
import { Component, EventEmitter, HostListener, Input, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Story } from 'src/app/core/interfaces/story';
import { StoryView } from 'src/app/core/interfaces/story-view';
import { StoryViewService } from 'src/app/core/services/story-view.service';
import { StoryService } from 'src/app/core/services/story.service';

@Component({
  selector: 'app-view-story',
  templateUrl: './view-story.component.html',
  styleUrls: ['./view-story.component.scss']
})

export class ViewStoryComponent {
  @Input() userIdInput: string = ''; // If userIdInput is true, the story view was opened from the FeedComponent. Otherwise, it was opened from a direct link.
  @Output() storyViewedAll = new EventEmitter<void>(); // Event emitted when all stories have been viewed
  @Output() close = new EventEmitter<void>();

  stories: Story[] = []; // List of stories of userIdInput
  firstUnreadStoryIndex = 0; // Index of the first unread story
  viewedStoriesWillSave: StoryView[] = []; // List of stories that have been viewed

  constructor(
    private storyService: StoryService,
    private storyViewService: StoryViewService,
    private route: ActivatedRoute,
    private location: Location,
    private router: Router
  ) { }

  ngOnInit() {
    if(this.userIdInput) {
      // get stories by userId
      this.getStoriesByUserId(this.userIdInput);
    }
    else {
      // get stories by route param
      const userId = this.route.snapshot.paramMap.get('userId');
      if(userId) this.getStoriesByUserId(userId);
    }
  }

  /**
   * Get stories by userId and set the first unread story index
   * @param userId - The id of the user
   */
  getStoriesByUserId(userId: string) {
    this.storyService.getStoriesByUserId(userId).subscribe({
      next: (stories) => {
        this.stories = stories;
        // Find the first unread story
        const index = this.stories.findIndex(story => !story.viewed);
        this.firstUnreadStoryIndex = index === -1 ? 0 : index;
        // If the first story is unread (index == 0), mark it as viewed
        if(this.firstUnreadStoryIndex === 0) {
          this.addToViewedStoriesWillSave(0);
        }
      },
      error: (error) => {
        console.error(error);
      }
    })
  }

  closeViewStory() {
    // Check if all stories have been viewed, then emit the storyViewedAll event to change border color
    if(this.stories.findIndex(story => !story.viewed) === -1) {
      this.storyViewedAll.emit();
    }

    // Close the story view
    if(this.userIdInput) {
      // Close from FeedComponent
      this.close.emit();
      this.location.replaceState('/');
    }
    else {
      // Close from direct link
      this.router.navigate(['/']);
    }
  }

  /**
   * Handle page change event of carousel
   * @param event - The event object { page: number }
   */
  onPageChange(event: any) {
    if(this.stories[event.page]) {
      this.addToViewedStoriesWillSave(event.page);
    }
  }

  /**
   * Add story to viewedStoriesWillSave list if it has not been viewed
   * @param index - The index of the story
   */
  addToViewedStoriesWillSave(index: number) {
    if(!this.stories[index].viewed) {
      this.stories[index].viewed = true;
      this.viewedStoriesWillSave.push({
        storyId: this.stories[index].id
      });
    }
  }

  /**
   * Handle the beforeunload event to save all story views before the window is closed, prevent save every time carousel page changes
   * @param event 
   */
  @HostListener('window:beforeunload', [ '$event' ])
  beforeUnloadHandler(event: any) {
    this.saveAllStoryViews();
  }

  ngOnDestroy() { 
    this.saveAllStoryViews();
  }

  /**
   * Save all story views
   * @returns Save all story views
   */
  saveAllStoryViews() {
    if(this.viewedStoriesWillSave.length === 0) return;
    this.storyViewService.saveAllStoryViews(this.viewedStoriesWillSave).subscribe({
      next: () => {
        console.log('Story views saved');
      },
      error: (error) => {
        console.error(error);
      }
    });
  }
}



/**
 * The closeViewStory method in ViewStoryComponent handles two cases:
 * 
 *  1. Closing from the FeedComponent: If userIdInput is true, it emits a close event and replaces 
 *  the current state in the browser's history with the root URL ('/'). 
 *  This effectively closes the story view without reloading the FeedComponent.
 * 
 *  2. Closing from a direct link: If userIdInput is false, it navigates to the root URL ('/'). 
 *  This will cause the FeedComponent to load, which is the expected behavior 
 *  when the story view was opened from a direct link.
 */