New Age Bullshit Generator
==========================

[Live demo](https://sebpearce.com/bullshit)

Does what it says on the box :) Written in JS, using jQuery.

The main script (`main.js`) relies on two lists of words called `patterns.js`, which is a stock of sentence patterns made up of fixed words and variable words, and `vocab.js`, which contains these variable words.

For example, take this sentence pattern from `patterns.js`:

`This life is nothing short of a ing nOf of adj nMass`

Here there are 4 variable words: `ing`, `nOf`, `adj` and `nMass`.

The script looks inside `vocab.js` for those 4 words. In the case of `ing` (a present participle), it might choose "flowering" or "unveiling." For `nMass` (a mass noun), it might choose "consciousness," "growth" or "stardust."

It then fills each heading and paragraph of the page with a certain number of sentence patterns. Paragraphs get three sentences each, for instance, while each heading gets one.

It avoids duplicate sentences by making a copy of the entire pattern array found in `patterns.js` at the start and removing each sentence as it is used.

The pretty picture comes from [placeimg.com](https://placeimg.com), which generates a random image each time something visits its URL.
