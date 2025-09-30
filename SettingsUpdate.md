# Settings Page Expansion

## Description
Expand and improve the **Settings Page** to include more application, user management, and database management features.

## Requirements

### Application Settings
- Add an **"Update" button** under/near the *Application Name* field to allow saving changes.  
- Allow **image upload** to update the application logo.  
- Add **theme switching** with options: Light, Dark, Colourblind.  
  - Implement this as a **slider/toggle** for real-time changes.  

### User Management
- Implement **"Add User"** functionality.  
- Fields required when adding a user:
  - Display Name
  - Username
  - Password
  - Roles
  - Profile Picture
  - Permissions
- Remove all **2FA setup** options (not needed for now).  

### Database Management
- Enable **"Backup Now"** button → generates backup of site data.  
- Enable **Restore option** → ingest a backup and restore site to that version.  
- Add **export functionality** to export all data as:
  - PDF  
  - CSV  

## To-Do List

- [ ] **Application Settings**
  - [ ] Add "Update" button for Application Name field.
  - [ ] Implement image upload for application logo.
  - [ ] Add theme toggle/slider with options: Light, Dark, Colourblind.

- [ ] **User Management**
  - [ ] Implement "Add User" functionality.
  - [ ] Collect fields: Display Name, Username, Password, Roles, Profile Picture, Permissions.
  - [ ] Remove all 2FA setup options.

- [ ] **Database Management**
  - [ ] Enable "Backup Now" button to generate site data backup.
  - [ ] Enable restore option to ingest and roll back to a previous backup.
  - [ ] Add export functionality for all data in both PDF and CSV formats.
