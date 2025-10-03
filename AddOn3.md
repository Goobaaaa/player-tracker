# Project Fixes and Enhancements

We need to apply several fixes and improvements across the **Incidents page**, **Weapons modal**, and **OCR section** of the project. Afterward, we’ll run a full error check and rebuild the project.  

---

## Incidents Page  
1. **Status Colors:**  
   - Update status labels with the following colors:  
     - **Open** → Green  
     - **Under Investigation** → Orange  
     - **Closed** → Red  

2. **Dropdown Fix:**  
   - Ensure dropdown menus have a solid background (not transparent) so text doesn’t clip through.  

3. **View Button:**  
   - Add a **“View”** button for each incident entry.  
   - Clicking it should open the full incident details.  

4. **Suspects, Officers, and Other Individuals Fields:**  
   - **Suspects:** Auto-populate from the `/suspects` page (dynamic updates if more suspects are added).  
   - **Officers:** Allow free-text entry. Typing a name and pressing **Enter** should add them to the list (support multiple entries).  
   - **Other Individuals:** Support multiple entries by pressing **Enter** (list grows dynamically).  

5. **Edit Button:**  
   - Ensure the **Edit** button works properly on the `/Incidents` page so incidents can be modified.  

---

## Weapons Modal (Player Modal Window)  
1. When a weapon is added and confirmed, the modal should **close automatically** instead of staying open.  

---

## OCR Section  
1. Fix the OCR functionality so it actually reads text from uploaded images.  
2. Ensure it outputs real text content instead of random/incorrect data.  

---

## Final Steps  
1. Perform a full **error check** across the project.  
2. Rebuild the project to apply all changes and confirm stability.  

---

# To-Do List  

- [ ] Update status colors on the Incidents page.  
- [ ] Fix dropdown backgrounds so they are not transparent.  
- [ ] Add a **View** button to incidents for detail viewing.  
- [ ] Implement suspects auto-population from `/suspects`.  
- [ ] Implement free-text entry for officers with “Enter” to add.  
- [ ] Implement multi-entry for “Other Individuals” with “Enter” to add.  
- [ ] Ensure **Edit** button on `/Incidents` works properly.  
- [ ] Fix Weapons modal so it closes after adding a weapon.  
- [ ] Fix OCR to properly read text from uploaded images.  
- [ ] Run a full error check across the project.  
- [ ] Rebuild the project and confirm all fixes are applied.  
