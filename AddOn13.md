# Project Specification Document

## Prompt
You are working on a web application project. The homepage already exists with a navigation bar containing links such as "Marshalls", "Fleet", "Marshall Chatroom", "Marshall Media", "Quote Wall", "Commendation Jar", and "Upcoming Events".  

Each of these tabs needs to be implemented with specific functionality and layouts. The system uses role-based permissions, and in some cases (like staff management), only Admin users should be able to edit content.  

Your task is to implement the following functionality as described in the To-Do list.

---

## To-Do List

### 1. Marshalls Page
- [ ] Create a staff member wall.
- [ ] Display portraits in a grid (4 across before wrapping).
- [ ] Under each portrait, show a tagline.
- [ ] Clicking a portrait should open a modal with:
  - Name
  - Callsign
  - Tag Line
  - Description
  - Blood Type
  - Favourite Hobby
- [ ] Admin role should have the ability to edit this page (add/remove staff, update info).

---

### 2. Fleet Page
- [ ] Similar to Marshalls page, but for vehicles.
- [ ] Grid layout with 2 across before wrapping.
- [ ] Each entry should include:
  - Large image of the vehicle.
  - Ability to click for detailed description of that vehicle.
- [ ] Admin role should have ability to edit vehicle entries.

---

### 3. Marshall Chatroom
- [ ] Implement a live chatroom for Marshalls.
- [ ] Features required:
  - Poster name
  - Date of post
  - Body of message
  - Edited tag (if message has been updated)
  - Delete button (only visible to original poster or Admin)
  - Reactions (emojis)
- [ ] Support embedding images (via direct link).
- [ ] Support uploading images to embed into chat.

---

### 4. Marshall Media
- [ ] Implement a media gallery.
- [ ] Grid layout: 6 across before wrapping.
- [ ] Each media item should display:
  - Image
  - Description (provided on upload)
  - Uploader’s name
- [ ] Clicking an image opens a modal window in full screen.
- [ ] Support uploading media (via link or manual upload).

---

### 5. Quote Wall
- [ ] Implement a quote submission feature.
- [ ] Users can submit:
  - Quote line
  - Who said it
  - When it was said
  - Why it was said
- [ ] Display quotes in a stylish, readable font.

---

### 6. Commendation Jar
- [ ] Implement a commendation system.
- [ ] Grid layout similar to Marshalls page.
- [ ] Each entry shows:
  - An image (Medal or Trophy)
  - Name of the person receiving commendation
  - Short reason why
- [ ] Clicking on the commendation opens a modal with:
  - Full explanation
  - Who issued the commendation
  - Date issued

---

### 7. Upcoming Events
- [ ] Implement a calendar system.
- [ ] Users can add events to specific dates and times.
- [ ] Events should display on the calendar for others to see.
- [ ] Event details should include:
  - Title
  - Date & Time
  - Description
  - Creator
