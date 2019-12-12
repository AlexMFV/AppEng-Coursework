## Modules Used

- express
- ejs
- pg
- express-session
- js-sha256

##How to build:

1- Install all the dependencies with "npm install"
2- Install the database with "npm run setup"
3- Run the project with "npm start" on the root directory

###Extra (OPTIONAL):
  - IF dummy data is necessary use the command "npm run dummy"
  - IF the database needs to be deleted use "npm run deletedb"

## Key Features:

- Create a document that allows the user to enter and edit Textual Points
- Organize Textual Points in Tree Hierarchy
- Save the document (Local Storage)
- Apply different levels of Textual Points
- Indent/De-Indent Textuals Points
- Shortcuts (See "?" button in the website)
- Delete the whole document
- Save Indicator (Shows the user if the file has been saved or not)
- Force Save the document (if the file wasn't saved)
- If the user is logged in:
  - Create/Edit/Save Multiple documents
  - Rename documents
  - Delete documents permanently
  - Update documents anywhere (Server-Side Storage)


## How to use:

- Textual Points:
  - With the caret (mouse) in the line(s) that will be changed, use a shortcut or use the ComboBox with the Levels and press the Apply button next to it, to change the Textual Point Level

- Indentations:
  - Indent with "Tab" or press the ">" button
  - DeIndente with "Shift+Tab" or press the "<" button

- Force Save:
  - It's a manual save, can also be achieved with "Ctrl+S"

- Login
  - Some features are only available after the user logins, to create an account use the login button (Login and Register are on the same page)
  - When an account is created the user is prompted to insert a name for the file, after that the user can start writing.
  - "New Doc" prompts the user with a name and creates a new document on the database.
  - "Delete Doc" deletes the current document from the database permanently
  - "Rename Doc" allows the user to rename the document

- ? button
  - This button is where all the shortcuts and Informations are.

## Design and Implementation Rationale

  - The UI is simple so that the app can be as responsive as possible, though this might be changed later.
  - A Login was implemented so that the user could have a simple account where he could store all the files in one place and if he uses another device all the files are in the same place.
  - All the passwords are hashed using SHA256 encryption.
  - For most of the features there are buttons to execute them but there is also shortcuts.

## Unfinished/Future Work

  - Improvements to the UI
  - Improvements to the database security
  - Improvements to the Textual Points (The way they are written)
  - Add Rich Text Editing
  - File Encryption
  - Allow multiple files in local Storage
  - "Mind Map" of the documents
  - Allow the user to add preset text (Current date/time, current epoch, Math Formulas, etc)
  - Organize Textual Points with drag n drop.
  - Collaborative Editing
  - Revision Control
  - Different Page Stylings (A3, A4, Portrait, Landscape)
  - Page System (like MS Word)
  - Text import/export
  - Write with MarkDown
