# Development Requests for /dashboard and /tasks

I would like the following updates and improvements to be made to the system.

---

## Changes to `/dashboard` Page

1. **Wider Task Modal**
   - Increase the width of the task modal window by **0.75x** for better visibility of task details.

2. **Image Thumbnail Visibility**
   - Fix issue where clicking on image thumbnails does not display the image.
   - Ensure thumbnails can be clicked to open the image in a modal view.

3. **Default Media Link Box**
   - By default, display **one media link input field** and its associated **name/title field**.
   - Retain the option to "Add Another Media Link" for additional entries.

4. **File Name Under Thumbnails**
   - Display the uploaded file’s **name/title below its thumbnail** in comments.

5. **Delete Own Comments**
   - Allow users to delete their own comments.
   - Add a **red trash icon** in the top-right corner of each comment for this action.

6. **Remove Clippy Icon on Dashboard**
   - Remove the **clippy icon** indicator for uploaded media on the dashboard.
   - Uploaded media should only be viewable as thumbnails inside the task modal window.

---

## Changes to `/tasks` Page

1. **Contain All Task Information**
   - Ensure all task-related information (created date, number of comments, buttons) stays within the task box.

2. **Remove Clippy Icons**
   - Remove the clippy thumbnail icons from tasks, as they are not needed.

3. **Full Task Description in Comments View**
   - When clicking the "Comment" button to view a task, display the **full task description**.

4. **Default Media Box**
   - Include a default **Add Media box and Name field** (same as dashboard implementation).

---

# To-Do List

### `/dashboard` Page
- [ ] Widen the task modal by 0.75x.
- [ ] Fix image thumbnail click issue (open in modal).
- [ ] Add default media link + name fields with "Add Another Media Link" option.
- [ ] Display file name/title under thumbnails in comments.
- [ ] Implement red trash icon for users to delete their own comments.
- [ ] Remove clippy icon on dashboard; keep thumbnails only in task modal.

### `/tasks` Page
- [ ] Keep all task details (date, comments, buttons) inside task box.
- [ ] Remove clippy icons.
- [ ] Show full task description when clicking "Comment".
- [ ] Add default media link + name fields (same as dashboard implementation).
