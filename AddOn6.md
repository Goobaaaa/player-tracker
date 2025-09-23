# Development Requests for /dashboard and /tasks

I would like the following updates and improvements to be made to the system.

---

## Changes to `/dashboard` Page

1. **Image View in Comments**
   - Fix the issue where clicking on an image inside a task’s comments causes the screen to blur but does not display the full image.
   - Ensure images open in fullscreen or modal view properly.

2. **Add Media Link Placement**
   - Adjust the "Add Another Media Link" button functionality.
   - When pressed, it should add a **new media link + name field below the existing fields**, instead of overlapping on top of them.

---

## Changes to `/tasks` Page

1. **Clickable Thumbnails**
   - Restore image thumbnails within the task description and comments.
   - Make them clickable so users can open them in fullscreen/modal view.

2. **Expand Original Task Description**
   - When clicking "View Comment," do not duplicate the task name and description into comments.
   - Instead, expand the original task description to show the **full text instead of the truncated "..." version**.

3. **Add Media Link Placement**
   - Same fix as dashboard: ensure "Add Another Media Link" places new sections **below existing ones** instead of overlapping.

---

# To-Do List

### `/dashboard` Page
- [ ] Fix image blur issue so clicking thumbnails opens fullscreen/modal.
- [ ] Adjust "Add Another Media Link" so new fields appear below existing ones.

### `/tasks` Page
- [ ] Restore clickable thumbnails in task descriptions and comments.
- [ ] Expand original task description to full text when "View Comment" is clicked (instead of duplicating text).
- [ ] Adjust "Add Another Media Link" so new fields appear below existing ones.
