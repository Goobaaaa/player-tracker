# Development Todo List: Dashboard & Tasks Page Updates

## Dashboard Page Fixes
- [ ] **Fix Task Modal Window**
  - [ ] Investigate modal viewport positioning issue
  - [ ] Ensure modal appears within user's visible viewport
  - [ ] Verify modal content renders properly (check for CSS/display issues)
  - [ ] Test modal functionality across different screen sizes
  - [ ] Validate backdrop blur effect works correctly

## Tasks Page Updates
- [ ] **Thumbnail Visibility Control**
  - [ ] Remove thumbnails from main tasks list view
  - [ ] Ensure thumbnails appear only in task comments view
  - [ ] Test thumbnail visibility toggle functionality

- [ ] **Task Description Truncation**
  - [ ] Implement description shortening for main tasks view
  - [ ] Preserve original task card dimensions
  - [ ] Show full descriptions only in comments view
  - [ ] Add "..." or "Read more" indicator for truncated text

- [ ] **Enhanced Media Upload System**
  - [ ] Enable multiple media uploads in comments
  - [ ] Add image naming functionality during upload
  - [ ] Display image names below thumbnails
  - [ ] Implement file type validation
  - [ ] Add upload progress indicators
  - [ ] Ensure responsive thumbnail grid layout

## Implementation Notes
1. **Modal Debugging Priority**: Start with modal viewport issue as it blocks core functionality
2. **Consistent Styling**: Maintain consistent card dimensions after description truncation
3. **Media Handling**:
   - Use FormData for multi-file uploads
   - Implement client-side image naming before upload
   - Consider lazy loading for thumbnail grids
4. **Accessibility**:
   - Add ARIA labels for modals and thumbnails
   - Ensure keyboard navigation works for uploads
5. **Testing**:
   - Verify all changes work on mobile/tablet/desktop
   - Test with various media file types/sizes
   - Check modal behavior with dynamic content

## Dependencies
- [ ] Confirm modal library version (e.g., Bootstrap, Material UI)
- [ ] Verify image upload API endpoints support multiple files
- [ ] Check database schema supports image naming

---
*Last Updated: 2023-10-15*
*Status: Pending Implementation*