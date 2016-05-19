'use strict';

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

  copyArrayOfArrays: function copyArrayOfArrays(arr) {
    var result = [];
    for (var i = 0; i < arr.length; i++) {
      result[i] = arr[i].slice();
    }
    return result;
  },

  capitalizeFirstLetter: function capitalizeFirstLetter(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  },

  randomInt: function randomInt(max) {
    return Math.floor(Math.random() * (max + 1));
  }

};

// The generator in all its quantum glory
var bs = {

  sentencePool: [],

  initializeSentencePool: function initializeSentencePool() {
    this.sentencePool = [];
    this.sentencePool = kit.copyArrayOfArrays(this.sentencePatterns);
  },

  removeSentenceFromPool: function removeSentenceFromPool(topic, el) {
    if (el > -1) {
      this.sentencePool[topic].splice(el, 1);
    }
  },

  retrieveRandomWordOfType: function retrieveRandomWordOfType(type) {
    var rand = kit.randomInt(this.bullshitWords[type].length - 1);
    return this.bullshitWords[type][rand];
  },

  cleanSentence: function cleanSentence(sentence) {
    var result;

    // replace 'a [vowel]' with 'an [vowel]'
    // I added a \W before the [Aa] because one time I got
    // 'Dogman is the antithesis of knowledge' :)
    result = sentence.replace(/(^|\W)([Aa]) ([aeiou])/g, '$1$2n $3');

    result = result.trim();
    result = kit.capitalizeFirstLetter(result);

    // remove spaces before commas/periods/semicolons
    result = result.replace(/ ([,\.;\?])/g, '$1');
    // take care of prefixes (delete the space after the hyphen)
    result = result.replace(/- /g, '-');
    // add space after question marks if they're mid-sentence
    result = result.replace(/\?(\w)/g, '? $1');

    return result;
  },

  generateSentence: function generateSentence(topic) {

    var patternNumber = kit.randomInt(this.sentencePool[topic].length - 1);
    var pattern = this.sentencePool[topic][patternNumber];

    if (typeof pattern == 'undefined') {
      console.log('ran out of pattern ' + patternNumber);
    }

    // insert a space before . , ; ? so we can split the string into an array
    var pattern = pattern.replace(/([\.,;\?])/g, ' $1');
    var pattern = pattern.split(' ');

    // remove the pattern from the sentence pool so it can't be re-used
    this.removeSentenceFromPool(topic, patternNumber);

    // remove the topic from the sentence pool if there are no sentences left
    // for that particular topic
    if (this.sentencePool[topic].length === 0) {
      this.sentencePool.splice(topic, 1);
    }

    var result = '';
    for (var x in pattern) {
      // if word matches one of the placeholder words (e.g. nPerson),
      // replace it with a random instance of its type (e.g. warrior)
      if (this.bullshitWords.hasOwnProperty(pattern[x])) {
        result += this.retrieveRandomWordOfType(pattern[x]);
      } else {
        result += pattern[x];
      }
      result += ' ';
    }

    result = this.cleanSentence(result);

    return result;
  },

  insertSpaceBetweenSentences: function insertSpaceBetweenSentences(fullText) {
    // insert a space between sentences (after periods and question marks)
    return fullText.replace(/([\.\?])(\w)/g, '$1 $2');
  },

  generateText: function generateText(numberOfSentences, sentenceTopic) {
    var fullText = '';
    for (var i = 0; i < numberOfSentences; i++) {
      fullText += this.generateSentence(sentenceTopic);
      // if the topic has been deleted, pick another topic
      if (typeof this.sentencePool[sentenceTopic] == 'undefined') {
        sentenceTopic = kit.randomInt(this.sentencePool.length - 1);
      }
    }

    fullText = this.insertSpaceBetweenSentences(fullText);

    return fullText;
  }

};

$(' .topbar button ').hover(function () {
  $(this).removeClass('glowjump');
});

// Page interaction
$(' .topbar button ').click(function () {

  $(' .page-flash ').show(1, function () {

    // generate random topic
    var sentenceTopic = 0;

    $(' #main-heading ').text(bs.generateText(1, sentenceTopic));
    $(' #sub-heading ').text(bs.generateText(2, sentenceTopic));
    sentenceTopic = kit.randomInt(bs.sentencePool.length - 2);
    $(' #third-heading ').text(bs.generateText(1, sentenceTopic));
    $(' p ').each(function (i) {
      sentenceTopic = kit.randomInt(bs.sentencePool.length - 1);
      $(this).text(bs.generateText(3, sentenceTopic));
    });
    sentenceTopic = kit.randomInt(bs.sentencePool.length - 1);
    $(' #quote ').text(bs.generateText(1, sentenceTopic));

    // change image
    $(' #nature-image ').fadeTo(1, 0, function () {
      $(this).attr('src', 'http://placeimg.com/640/480/nature?' + Math.floor(Math.random() * 100)).bind('onreadystatechange load', function () {
        if (this.complete) $(this).fadeTo(1000, 1);
      });
    });
  }).fadeOut(1000);

  bs.initializeSentencePool();
});