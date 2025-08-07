 - See also [[Setting up Quartz if you already have an Obsidian setup]]
# 1. Folder structure
- ![[How does a Quartz + Obsidian vault differ from a normal Obsidian vault?.webp]]
- Difference 1 is that folder structure matters more
- If you want a note to appear on your (front-end) website, you need to make sure it lives in the "content" subfolder
- This is also the case for images!
- My "content" folder looks like this:
	- ![[How does a Quartz + Obsidian vault differ from a normal Obsidian vault? 1.webp]]
# 2. Website home-page
- The home page's file name is index.md
- I can't remember if this is by default, or if I did this → I recommend setting the title and alias to "Home Page", so it's easier to get to via Command + O
- ![[How does a Quartz + Obsidian vault differ from a normal Obsidian vault?-1.webp]]
	- (It seems that that are multiple files called index, so searching for "index" doesn't reliably get you to your home page, whereas if you set the alias to "Home Page", you will reliably get there via Command + O)
![[How does a Quartz + Obsidian vault differ from a normal Obsidian vault?-2.webp]]
# 3. If you change the folder names, your old links will break
- This one is slightly annoying
- If I have a file in a folder called "Open Questions", and I share the URL with a friend, but I then change that folder to be called "⭐️Open Questions", the URL will now be different, and the old link will no longer work
# 4. Changing the aesthetic is trickier
- Styling is done via CSS 
- In your Quartz folder, there's the folder:
	- source → quartz → styles
- This is where the CSS lives
	- ![[How does a Quartz + Obsidian vault differ from a normal Obsidian vault? 2.webp]]
- You can set up custom CSS → I recommend vibe coding here! 
- E.g., I set up red font, 
	- e.g. see [[What "This is Water" means to me (WIP)]]
- And I set up dialogue formatting, 
	- e.g. see [[Gemini Socrates - part-time vs full-time work]]