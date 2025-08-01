---
permalink: how-to-create-obsidian-quartz-website
created: 2025-08-01
---
- 2025-08-01
# Why an Obsidian-based website?
- I shared this guide with a friend and he was like "why not Wix or Wordpress? They have free tiers"
- The point, for me, is that with this setup, you just use Obsidian as normal, and hit "publish" periodically
	- So, if you're already a fan of Obsidian, it's the environment you already like, but as a website
- At the time of writing (2025-08-01), this "website" has 144 different pages - I imagine this'd be a pain in Wordpress etc
- And I can interconnect them etc
# Option 1 - pay for Obsidian Publish
- You can pay `$10` / month for [Obsidian Publish](https://obsidian.md/publish) (`$8` / month if annual)
- I checked my bank account to see how much this cashed out to in GBP + VAT and it was £7.77/month for monthly non-annual
- Example sites [1](https://lab.marconoris.com/now), [2](https://arkadiuszlenkiewicz.pl/Witaj+w+%C5%9Bwiecie+zarz%C4%85dzania+informacj%C4%85), [3](https://mister-chad.com/welcome)
## Pros and cons
- Pros ✅
	- No tools required other than Obsidian
	- Good guides ("[Set up Obsidian Publish](https://help.obsidian.md/publish/setup)" and "[Introduction to Obsidian Publish](https://help.obsidian.md/publish)")
	- Support the Obsidian team
- Cons ❌ 
	- Cost
# Option 2 - use Obsidian + Quartz (free)
- *This is what I do*
- Pros ✅ 
	- No cost at all 
- Cons ❌
	- More setup cost (need Github, need to use Git via the terminal, need to connect your terminal to your Github account)
		- Approx time required → 15 mins - 2 hours, depending on if you've used Github before
		- Stuff than you could totally do with the help of AI - nothing advanced at all. True "101"-level stuff
		- Note - actually, you may not need to worry about the terminal & Git at all, step 4 of the guide is "(4) Download the repository with GitHub desktop" 
	- Ongoing cost → you upload your files to Github (via "git push"), so there's more of a chance of error (e.g. you have to ensure your files are in the =="content" folder==)
		- [Here's a Loom explaining what I mean](https://www.loom.com/share/93481b06e97140af9ca4f57452f3a83f)
		- E.g., I just published this page, and then realised that I forgot to add this page to the correct folder, so now I need to drag it into the folder and republish. It's a little niggle than you mostly remember to do and sometimes forget. Vs in Obsidian Publish, this isn't a thing you need to remember. But then again, maybe it's worth it to save the £80-£95/year that it costs to use Obsidian Publish, ymmv!
## Guide
- I followed this guide by Defender of Basic: "[Host your Obsidian notebook on GitHub Pages for free](https://dev.to/defenderofbasic/host-your-obsidian-notebook-on-github-pages-for-free-8l1)"