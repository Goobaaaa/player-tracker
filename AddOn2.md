# Website Feature Expansion

## Refined Prompt  

We are adding new features to the website. Below are the requested features and their intended functions:  

### 1. Search Bar Improvements  
- Modify the search bar so that:  
  - Typing a query displays live results in a **dropdown menu**.  
  - Pressing **Enter** opens a dedicated **search results page** listing all matching results.  

### 2. Login Screen Update  
- Change the login method from **email + password** to **username + password**.  

### 3. Incidents Page  
- Add a new page called **"Incidents"**.  
- Each incident should store and display:  
  - Title  
  - Date/Time of Incident  
  - Suspects involved  
  - Officers involved  
  - Other individuals involved  
  - Detailed description (body text)  
  - Ability to upload and attach media files (images, documents, videos).  

### 4. Homepage Asset Value Calculation  
- Ensure that the **Total Asset Value** correctly sums up the asset values of all suspects to reflect their total net worth.  

### 5. Suspects Page – Weapons Tab  
- On the **Suspects** page, in the player modal window:  
  - Add a new tab **"Weapons"**, placed next to **"Vehicles"**.  
  - Weapons tab should store:  
    - Gun Name  
    - Serial Number  
    - Ballistics Reference  
    - Status (Dropdown options:  
      - Green – Seized  
      - Red – Not Seized)  

### 6. OCRTextFinder Page  
- Add a new page called **OCRTextFinder**.  
- This page should:  
  - Allow users to upload an image.  
  - Extract and display the text from the image.  
  - Provide the extracted text in a copyable format.  

---

## To-Do List for Programming AI  

### Search Bar  
- [ ] Implement live dropdown search results.  
- [ ] Add functionality for Enter key → opens results page.  

### Login Screen  
- [ ] Replace email field with username field.  
- [ ] Update authentication logic to accept username + password.  

### Incidents Page  
- [ ] Create new "Incidents" page.  
- [ ] Add form fields: Title, Date/Time, Suspects, Officers, Others, Description.  
- [ ] Add media upload (support for images/documents/videos).  
- [ ] Store incident data in database and display in list/detail view.  

### Homepage  
- [ ] Fix "Total Asset Value" calculation logic to properly sum suspect asset values.  

### Suspects Page – Weapons Tab  
- [ ] Add "Weapons" tab next to "Vehicles".  
- [ ] Add form inputs: Gun Name, Serial Number, Ballistics Reference.  
- [ ] Add dropdown for Status (Green = Seized, Red = Not Seized).  
- [ ] Ensure data persistence and proper display.  

### OCRTextFinder Page  
- [ ] Create OCRTextFinder page.  
- [ ] Implement image upload functionality.  
- [ ] Integrate OCR to extract text from image.  
- [ ] Display extracted text in a copyable format.  
