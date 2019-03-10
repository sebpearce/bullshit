"use strict";

/*
 * main.js
 *
 * New Age Bullshit Generator
 * © 2014-15 Seb Pearce (sebpearce.com)
 * Licensed under the MIT License.
 *
 * TODO:
 *
 * Fix things like "This is the vision behind our 100% zero-point energy,
 * zero-point energy karma bracelets."
 *
 * bs.generateSentence() should do 1 thing only (generate a sentence),
 * not pull patterns out of use.
 */

// Toolkit of useful functions
var kit = {
  copyArrayOfArrays: function(arr) {
    var result = [];
    for (var i = 0; i < arr.length; i++) {
      result[i] = arr[i].slice();
    }
    return result;
  },

  capitalizeFirstLetter: function(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  },

  randomInt: function(max) {
    return Math.floor(Math.random() * (max + 1));
  },

  replaceAWithAn: function(sentence) {
    // replace 'a [vowel]' with 'an [vowel]'
    // I added a \W before the [Aa] because one time I got
    // 'Dogman is the antithesis of knowledge' :)
    return sentence.replace(/(^|\W)([Aa]) ([aeiou])/g, "$1$2n $3");
  },

  removeSpacesBeforePunctuation: function(sentence) {
    // remove spaces before commas/periods/semicolons
    return sentence.replace(/ ([,\.;\?])/g, "$1");
  },

  deleteSpaceAfterHyphen: function(sentence) {
    // take care of prefixes (delete the space after the hyphen)
    return sentence.replace(/- /g, "-");
  },

  addSpaceAfterQuestionMarks: function(sentence) {
    // add space after question marks if they're mid-sentence
    return sentence.replace(/\?(\w)/g, "? $1");
  },

  insertSpaceBeforePunctuation: function(sentence) {
    return sentence.replace(/([\.,;\?])/g, " $1");
  },

  insertSpaceBetweenSentences: function(text) {
    // insert a space between sentences (after periods and question marks)
    return text.replace(/([\.\?])(\w)/g, "$1 $2");
  }
};

// The generator in all its quantum glory
var bs = {
  sentencePool: [],

  initializeSentencePool: function() {
    this.sentencePool = [];
    this.sentencePool = kit.copyArrayOfArrays(this.sentencePatterns);
  },

  removeSentenceFromPool: function(topic, el) {
    if (el > -1) {
      this.sentencePool[topic].splice(el, 1);
    }
  },

  retrieveRandomWordOfType: function(type) {
    var rand = kit.randomInt(this.bullshitWords[type].length - 1);
    return this.bullshitWords[type][rand];
  },

  cleanSentence: function(sentence) {
    var result;

    result = kit.replaceAWithAn(sentence);
    result = result.trim();
    result = kit.capitalizeFirstLetter(result);
    result = kit.removeSpacesBeforePunctuation(result);
    result = kit.deleteSpaceAfterHyphen(result);
    result = kit.addSpaceAfterQuestionMarks(result);

    return result;
  },

  generateSentence: function(topic) {
    var patternNumber = kit.randomInt(this.sentencePool[topic].length - 1);
    var pattern = this.sentencePool[topic][patternNumber];

    if (typeof pattern == "undefined") {
      console.log("ran out of pattern " + patternNumber);
    }

    // insert a space before . , ; ? so we can split the string into an array
    pattern = kit.insertSpaceBeforePunctuation(pattern);
    pattern = pattern.split(" ");

    // remove the pattern from the sentence pool so it can't be re-used
    this.removeSentenceFromPool(topic, patternNumber);

    // remove the topic from the sentence pool if there are no sentences left
    // for that particular topic
    if (this.sentencePool[topic].length === 0) {
      this.sentencePool.splice(topic, 1);
    }

    var result = "";
    for (var x in pattern) {
      // if word matches one of the placeholder words (e.g. nPerson),
      // replace it with a random instance of its type (e.g. warrior)
      if (this.bullshitWords.hasOwnProperty(pattern[x])) {
        result += this.retrieveRandomWordOfType(pattern[x]);
      } else {
        result += pattern[x];
      }
      result += " ";
    }

    result = this.cleanSentence(result);

    return result;
  },

  generateText: function(numberOfSentences, sentenceTopic) {
    var fullText = "";
    for (var i = 0; i < numberOfSentences; i++) {
      fullText += this.generateSentence(sentenceTopic);
      // if the topic has been deleted, pick another topic
      if (typeof this.sentencePool[sentenceTopic] == "undefined") {
        sentenceTopic = kit.randomInt(this.sentencePool.length - 1);
      }
    }

    fullText = kit.insertSpaceBetweenSentences(fullText);

    return fullText;
  }
};

$(" .topbar button ").hover(function() {
  $(this).removeClass("glowjump");
});

$("#donation-link").on("click", function(e) {
  $("#donation-modal").modal({
    fadeDuration: 100
  });
});

// Page interaction
$(" .topbar button ").click(function() {
  $(" .page-flash ")
    .show(1, function() {
      // generate random topic
      var sentenceTopic = 0;

      $(" #main-heading ").text(bs.generateText(1, sentenceTopic));
      $(" #sub-heading ").text(bs.generateText(2, sentenceTopic));
      sentenceTopic = kit.randomInt(bs.sentencePool.length - 2);
      $(" #third-heading ").text(bs.generateText(1, sentenceTopic));
      $(" .bs-paragraph ").each(function(i) {
        sentenceTopic = kit.randomInt(bs.sentencePool.length - 1);
        $(this).text(bs.generateText(3, sentenceTopic));
      });
      sentenceTopic = kit.randomInt(bs.sentencePool.length - 1);
      $(" #quote ").text(bs.generateText(1, sentenceTopic));

      // change image
      $(" #nature-image ").fadeTo(1, 0, function() {
        $(this)
          .attr(
            "src",
            "http://placeimg.com/640/480/nature?" +
              Math.floor(Math.random() * 100)
          )
          .bind("onreadystatechange load", function() {
            if (this.complete) $(this).fadeTo(1000, 1);
          });
      });

      $("#nabg-bot-paragraph").hide();
    })
    .fadeOut(1000);

  bs.initializeSentencePool();
});
