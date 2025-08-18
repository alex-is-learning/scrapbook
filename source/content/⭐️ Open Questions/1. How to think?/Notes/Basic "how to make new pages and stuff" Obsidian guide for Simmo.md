# 1. Creating new notes
## 1a. Press control + N to make a new page  
- Pretty self-explanatory 
- Will create a new .md file, which you'll be able to see in the left hand sidebar
	- *(You had press command + P ("command palette") and type "show file explorer" to make it appear if it's not there)*
## 1b. Write in that note  
- Write some stuff in the new note
- Use markdown formatting
# 2. Making sure those notes are findable
## 2a. Create links to the new note wherever you want (e.g., home page)  
- Use command + O and then type the name of a file to open it via "enter"
	- (Or, control/command + enter to open in a new tab)
- Then, use `[[double square brackets]]` notation to create a link to your new file
- E.g., if your new file is called "Essay Number 1", you could navigate to your home page and write `[[Essay Number 1]]`
## 2b. Ensure new page lives in the "content" folder
- By default, when you make a new file, it gets plonked in the "parent" folder, that is, the very "top" one
- But, you need to drag the file into the folder called `content`
- Just do this with your mouse innit
- (via the file navigator on the left hand side)
# 3. Pushing the files to Github
## 3a. Install the git plugin
- This will involve setting up the git third party plugin, 
- Control/command + `,` opens settings, and from there you can navigate to "Third-Party Plugins", 
- search for the git plugin, install and enable it (there is an "install" button that then becomes an "enable" button)
## 3b. Sync via the git plugin
- Use the command palette (control + P) 
- Use the command called "git: commit-and-sync")  
- It will take ~3 minutes to publish the changes. You should test your website in an incognito browser to make sure you're not loading a cached version (that won't show the new changes)