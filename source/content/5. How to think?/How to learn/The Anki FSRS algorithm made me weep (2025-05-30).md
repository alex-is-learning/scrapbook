- https://www.alexislearning.me/blog/2025-05-30-anki-algorithm/

## (Ok not really but you know what I mean)

I love anki with all my heart. I think flashcards and memorisation are incredibly underrated tools. I guess most people think that memorisation is inelegant or ineffective (the idea of brute force learning), and/or cumbersome (e.g. having to make a load of paper flashcards and then remembering to review them, and eventually throwing them away).

Anki is incredible because, as Michael Nielsen says in his literally life-changing blog post “[Augmenting Long-Term Memory](https://augmentingcognition.com/ltm.html)”, it makes memory a choice. All you have to do is make a flashcard (there is, admittedly, the meta-skill of making _good_ flashcards, but let’s ignore that for now), and Anki will store it in the cloud for you, and figure out when you should see it again. If, when you see it again tomorrow, you can still remember the info, you’ll see it again in 3 days, then 7, etc. This is where “spaced” in “spaced repetition software” comes from.

But anki has a problem, and it’s one that, in the standard “normalisation of deviance” way, I was pretty much blind to, because I’d adjusted to it. It’s cumbersome as hell. For the past few weeks, since really going hard at learning again, I’ve had an average of 200 flashcards to review per day, which is kind of a lot. And, now that I think about it, for like 95% of the flashcards of the day, I can remember them fine. There’s a fair amount of redundancy, basically, of being shown stuff which is totally “grokked” by me now, partly because of the active learning I did when making the flashcards, partly because I’ve already seen the flashcards enough, etc.

Anyway, all this to say that, it turns out someone made a much better spacing algorithm, and I totally missed the memo. Lucky for me, I have great friends who share things with me (seriously, the amount of awesome stuff I’ve been put onto by the suggestions of friends is mad). So today I set up the new algorithm (which has actually been added to the anki distribution because it’s so popular, but hasn’t been made into the default algorithm yet), and, drum-roll please:

> The number of flashcards I was meant to review today instantly dropped from 150 to 7

Are you KIDDING ME!!!

And, re: “normalisation of deviance” - as soon as I saw the drop, it felt incredibly obvious to me that this is how things should be. I don’t need to see 150 flashcards today - for 95% of them (or more), I’ll easily remember the answers. They might be about AI safety, or Heidegger, or John Boyd, or the nuclear safety effective altruism cause area, and I’ve done my learning well, and I don’t need reminders at anywhere near the rate that vanilla anki gives them.

So that’s the post. It’s mad that I was just like “I guess this is the way things are, I guess 150 flashcards a day is correct”, and then as soon as this number was dramatically reduced, I was like “why the hell have I not thought to investigate this before”.

I like the idea of doing a “ridiculousness audit”, where you intentionally spot things in your life that are silly and inefficient, but that you’ve just adjusted to. There’s probably a bunch of stuff in my own learning workflows that are like this… this feels like it could be a cool thing to do with friends, somehow. Shadow them for a day or a week. I guess this is what body doubling is?

Anyway, that’s enough writing for today. Goodbye job, you could have been great, but I’m sure the one I actually land will be great.

And Anki – I love you, but your default algorithm is inefficient as hell.

## Quick excursus on Vim

Man, it feels so good to be writing this with Vim. It’s funny, it took me maybe 2 weeks of pain (each day less painful than the last, but a definite feeling of clunkiness every day), and now it feels totally fluent (the basic commands at least)

```
gg to go to the top of the page
I to insert at the start, A at the end 
Search with / and ?
diw and di" and dw and cw and dd and D and etc for deleting stuff
A key thing was swapping the caps lock and escape keys on my macbook and my arch
linux thinkpad. Easily reaching the escape key because it's the caps lock key
now is a huge improvement. 
```

I just love the nerdy aesthetic too. I really love making new blog posts for this website by using the command line, editing a new blog post with vim, publishing with git. I love that you have to use a command line command to change the brightness of this laptop. It feels so cool and nerdy to learn all these little commands and make them make sense by talking to AI about e.g. “ok so `sudo pacman -Qe` is the command I use to see the packages that I’ve installed so I can remember the name of the screen brightness package, but why `-Qe`, what does that mean?”, and there’s always a logical explanation that just makes sense. It feels very elegant, once you get your head around it and get over the initial hump.

Ok anyway! Bye bye