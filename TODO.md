# TODO for Photos Page Update

## Task: Add pre-loaded photos from assets and remove delete button for them

### Steps:
1. **Select Photos**: Choose relevant photos from tourapp/src/assets to add as pre-loaded images. Based on the directory listing, select images like krishna-janmabhumi.webp, prem-mandir-hero.jpg, karti-mandir.jpeg, etc. (exclude non-image files like .apk).

2. **Modify Photos.tsx**:
   - Add a state or constant for pre-loaded photos.
   - Update the files state to include pre-loaded photos on component mount.
   - Modify the rendering logic to conditionally show the delete button only for user-uploaded photos (not pre-loaded ones).
   - Ensure pre-loaded photos are displayed in the grid alongside user-uploaded ones.

3. **Test Changes**:
   - Verify that pre-loaded photos are displayed.
   - Confirm delete button is hidden for pre-loaded photos.
   - Ensure user-uploaded photos still have the delete button.

### Files to Edit:
- tourapp/src/pages/Photos.tsx

### Notes:
- Pre-loaded photos should be treated as non-deletable.
- Use import statements or require for images in React.
