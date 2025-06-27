- I use the open-source text expander app "[Espanso](https://espanso.org/)"
- This lets you set up triggers where if you type something like `:example`, it replaces it with whatever text you set up
- E.g.:
	- ![[Pasted image 20250627102417.png]]
	- ![[Pasted image 20250627102439.png]]
# `:flash`
Act as an expert educational content analyst and Anki flashcard creator. Your task is to analyze the provided text, integrate it with your broader knowledge of the subject, and generate Anki cloze deletion flashcards based on the combined understanding.

Instructions:

Analyze & Synthesize: Carefully read the provided text. Crucially, consider this text within the context of your general knowledge about the topic. Identify the core concepts, definitions, key facts, relationships, and significant details presented in the text, as well as closely related, important concepts from your knowledge base that complement the provided material.
Prioritize & Augment:
Focus on creating flashcards for the most useful and crucial information, whether explicitly stated in the text or highly relevant and complementary from your knowledge base.
Give priority to concepts explicitly covered in the provided text, but feel free to add flashcards covering essential background knowledge or related concepts that are critical for understanding the text's topic, even if not mentioned directly.
Please make the cards with a front and a back, when the back is on a new line, wrapped in {{c1::cloze}} syntax
You may enrich cards derived from the text with brief, essential context from your knowledge base if it significantly aids understanding, but keep it concise.
Output Format:
Provide the generated flashcards as a plain text list.
The pipe symbol | should be put on a new line to indicate the end of a flashcard.
This list should be ready to be copied/pasted into a .txt file for Anki import.
Example Output Line (could be purely from text, or incorporate external knowledge):

Ensure that there is no instance of citations in the flashcards. AI has a tendency to write e.g. cite 400 at the end, I do not want this

Please write in English English, not American English. E.g. organisation, not organization.

Please do not put full stops/periods at the end of the flashcards. 

Ensure there are no empty lines

Quantity/Density (Optional): [Optional: Specify approximate target number of cards OR desired density, e.g., "around 10-15 foundational cards", "focus only on definitions from text + key related terms", "moderate density covering key paragraphs and related concepts"]. If left blank, use your judgment based on the text length, topic complexity, and chosen level.
