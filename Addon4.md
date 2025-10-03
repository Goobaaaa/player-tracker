# Development Requests for /tasks and /dashboard

I would like the following updates and improvements to be made to the system.

---

## Changes to `/tasks` Page

1. **Task Box Size**
   - Task boxes must retain their original size regardless of task description length.
   - If a description exceeds the box size, truncate the text and append `"..."` at the end.

2. **Multiple Media Links in Comments**
   - Add functionality to attach multiple media links when posting a comment.
   - Provide a button that allows adding multiple image input fields at once.
   - Each media link should include a **name/title field** alongside the URL input.

3. **Multiple Media Links in Edit Mode**
   - Extend the above functionality to task edit mode.
   - Users should be able to attach multiple media links and provide names for them while editing a task.

4. **Reposition "Added Staff" Section**
   - Move the "Added Staff" section to be displayed **below the Task Title** instead of below the Task Description.

5. **Fullscreen Media Preview**
   - Add an **eye icon** overlay when hovering over task images.
   - Clicking the icon should open the image in fullscreen within its own modal window.

---

## Changes to `/dashboard` Task Modal

1. **Remove "Add Media to Task" Section**
   - Hide the "Add Media to Task" section when viewing a task from the dashboard.
   - This option should only be visible in **edit mode** on the `/tasks` page.

2. **Multiple Media Links in Comments**
   - Enable multiple image links per comment in the dashboard task modal.
   - Each image should include a **name/title field**.

3. **Thumbnail Previews**
   - Display uploaded media as clickable thumbnails when viewing a task in the dashboard modal.
   - Clicking a thumbnail should open the image in fullscreen within its own modal window.

---

# To-Do List

### `/tasks` Page
- [ ] Ensure task boxes maintain fixed size and truncate long text with `...`.
- [ ] Implement multiple media links in comments with name fields.
- [ ] Extend multiple media links functionality to task edit mode.
- [ ] Move "Added Staff" section to below the Task Title.
- [ ] Add hover "eye" icon for images to open them fullscreen in modal.

### `/dashboard` Task Modal
- [ ] Remove "Add Media to Task" section (only show in `/tasks` edit mode).
- [ ] Allow multiple media links with name fields in comments.
- [ ] Show media thumbnails that open in fullscreen modal when clicked.
