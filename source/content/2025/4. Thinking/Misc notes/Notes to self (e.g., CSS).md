---
draft: true
---
- "Draft" frontmatter should prevent this from being published?
- Want an easy place to store my CSS so I can quickly access it via Obsidian
# Custom Text Colours
Wrap text in a `<span>` with the appropriate class to change its colour.
# Red Font
<span class="text-red">This text will be red.</span>
CSS: .text-red { color: #D83C3C; }
# Blue Font
<span class="text-blue">This text will be blue.</span>
CSS: .text-blue { color: #3C78D8; }
## Green Font
<span class="text-green">This text will be green.</span>
CSS: .text-green { color: #3E9B4F; }
# Dialogue Styling

This collection of styles allows you to format conversations or dialogues within your notes.

### Dialogue Container

This class wraps the entire conversation, giving it a border and consistent spacing.

**Example HTML:**
```html
<div class="dialogue-container">
  <!-- All dialogue entries go inside here -->
</div>
````

**Reference CSS:**

```
.dialogue-container {
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 16px;
  margin-top: 2em;
  margin-bottom: 2em;
  font-family: sans-serif;
  max-width: 700px;
  margin-left: auto;
  margin-right: auto;
}
```

### Dialogue Entry & Speakers

Use these classes for individual lines of dialogue. `.speaker-left` and `.speaker-right` provide alternating backgrounds, and `.speaker-name` formats the speaker's name.

**Example HTML:**

```
<div class="dialogue-container">
  <div class="dialogue-entry speaker-left">
    <span class="speaker-name">Alex</span>
    This is a line from the speaker on the left.
  </div>
  <div class="dialogue-entry speaker-right">
    <span class="speaker-name">Socrates</span>
    And this is a line from the speaker on the right.
  </div>
</div>
```

**Reference CSS:**

```
.dialogue-entry {
  margin-bottom: 12px;
  padding: 12px;
  border-radius: 6px;
  line-height: 1.6;
}

.speaker-left {
  background-color: #f1f1f1;
}

.speaker-right {
  background-color: #e7f3fe;
}

.speaker-name {
  display: block;
  font-weight: bold;
  margin-bottom: 6px;
  color: #333;
}
```

### Dialogue Commentary

For italicised, out-of-character comments or narrative descriptions within a dialogue.

**Example HTML:**

```
<div class="dialogue-commentary">
  Socrates adjusts his robe, deep in thought.
</div>
```

**Reference CSS:**

```
.dialogue-commentary {
  background-color: #FFF5F5;
  border-left: 3px solid #E57373;
  padding: 12px;
  margin: 12px 0;
  font-style: italic;
  color: #555;
  font-size: 0.9em;
}
```

# Utility Classes

### Side-by-Side Images

Use the `.image-row` class on a `div` to force embedded images or elements onto a single line.

**Example HTML:**

```
<div class="image-row">
  ![[image1.png]]
  ![[image2.png]]
</div>
```

**Reference CSS:**

```
.image-row {
  display: flex !important;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  gap: 15px;
  margin-top: 1.5em;
  margin-bottom: 1.5em;
}

.image-row img {
  border-radius: 5px;
  box-shadow: 0 4px 8px rgba(0,0,0,0.05);
}
```


# Global Styles

### Force Code Block Wrapping

This style is applied automatically to all code blocks in your vault to prevent horizontal scrolling. There is no need to add a class.

**Reference CSS:**

```
pre {
  white-space: pre-wrap;
  word-break: break-word;
}
```