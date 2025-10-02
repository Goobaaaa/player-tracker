# Project Specification Document

## Prompt
The current project is defined as a **"Template"**.  

A "Template" is:
- A container that a user can create, give a custom name, and assign a custom logo.
- A restricted space that only certain users (with permissions) can access.
- Users without access should not see the template in navigation, and if they try to visit it directly, they should see an "ACCESS DENIED" page.

The project must evolve to support:
1. A homepage ("USMS Homepage") that all users can see and access.
2. Role-based permissions (Admins vs. Marshalls).
3. A dropdown navigation that shows only templates the user has permission for.
4. User creation and permission assignment via the homepage.

Your task is to implement the features described below in the To-Do list.

---

## To-Do List

### 1. Template System (Core Definition)
- [ ] Ensure all existing work is structured as a "Template".
- [ ] Allow users to:
  - [ ] Create a template.
  - [ ] Name the template.
  - [ ] Upload/select a logo for the template.
  - [ ] Assign user accounts to have access to the template.
- [ ] Restrict access:
  - [ ] Users without access should not see the template in the dropdown.
  - [ ] Users without access who attempt to access a restricted template should see the "ACCESS DENIED" page.

#### Access Denied Page
- [ ] Background: light red.
- [ ] Centered exclamation mark.
- [ ] Bold heading: `"ACCESS DENIED"`.
- [ ] Subtext:  
  `"You are attempting to access a restricted document, please contact the person in charge of this document or the system administrator if you are seeing this in error."`

---

### 2. USMS Homepage
- [ ] After login, redirect users here.
- [ ] Display:
  - [ ] USMS Logo centered on page.
  - [ ] Introductory text:  
    `"This is the United States Marshall Service Homepage, this website is used to track and record on-going and concluded investigations by the Marshall Service. This page is developed and maintained by Silas Marshall with the San Andreas State Troopers. If you have any questions/concerns or suggestions, please direct them to Silas Marshall (email: gooba)."`
- [ ] Left-hand navigation menu with links:
  - [ ] Homepage
  - [ ] Marshalls
  - [ ] Fleet
  - [ ] Marshall Chatroom
  - [ ] Marshall Media
  - [ ] Quote Wall
  - [ ] Commendation Jar
  - [ ] Upcoming Events

---

### 3. Navigation / Dropdown Menu
- [ ] Top-left dropdown menu.
  - [ ] Default option: `"USMS Homepage"`.
  - [ ] List all active templates.
    - [ ] Only include templates the logged-in user has permission to access.
    - [ ] Selecting a template redirects to that template’s page with all project features.

---

### 4. User & Permissions Management
- [ ] On the homepage, add ability to create/manage users.
- [ ] Add permissions system:
  - [ ] Assign user access to templates.
  - [ ] Role system:
    - [ ] **Admin** → Full site access.
    - [ ] **Marshall** → Template access only (requires permission).
- [ ] Ensure all users can access the USMS Homepage without error.
