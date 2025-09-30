# Audit Log Page Implementation

## Description
Create a new page called **"Audit Log"**, positioned in the navigation menu between **Incidents** and **OCR Text Finder**.  
This page will be used to review and manage the Audit Log beyond the 5 most recent entries currently shown on the dashboard.

## Requirements
- Match the existing style and theme of the application.
- Display the complete Audit Log.
- Filtering options:
  - By Audit Type (Deleted, Added, Created, Updated, etc.)
  - By User (specific user actions)
- Ability to export the Audit Log as a CSV file.
- Update the **"Show Full Log"** button on the dashboard:
  - Redirects to the new **Audit Log** page instead of expanding in place.

## To-Do List
- [ ] Add **"Audit Log"** page to the navigation menu (between *Incidents* and *OCR Text Finder*).
- [ ] Build **Audit Log page layout** in the same style/theme as the rest of the app.
- [ ] Implement **data fetching** to display the full Audit Log.
- [ ] Add **filtering controls**:
  - [ ] By Audit Type (Deleted, Added, Created, Updated, etc.)
  - [ ] By User
- [ ] Add **CSV export functionality** for the Audit Log.
- [ ] Update the Dashboard **"Show Full Log"** button to redirect to the new Audit Log page.
