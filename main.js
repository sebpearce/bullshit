/*
 * main.js
 * 
 * New Age Bullshit Generator
 * © 2014 Seb Pearce (sebpearce.com)
 * Licensed under the MIT License.
 * 
 */

// deepCopy function taken from:
// http://james.padolsey.com/javascript/deep-copying-of-objects-and-arrays/
function deepCopy(obj) {
    if (Object.prototype.toString.call(obj) === '[object Array]') {
        var out = [], i = 0, len = obj.length;
        for ( ; i < len; i++ ) {
            out[i] = arguments.callee(obj[i]);
        }
        return out;
    }
    if (typeof obj === 'object') {
        var out = {}, i;
        for ( i in obj ) {
            out[i] = arguments.callee(obj[i]);
        }
        return out;
    }
    return obj;
}

function removeSentence(topic, element) {

  if (element > -1) {
    sentencePatternsClone[topic].splice(element, 1);
  }

}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function randomInt(max) {
    return Math.floor(Math.random()*(max+1));
}


function retrieveRandomWordOfType(type) {

  // find how long the array of words is for given type
  var max = type.length - 1;

  // get a random number to represent a word in the array
  var rand = randomInt(max);

  var result = type[rand];

  // type.splice(rand,1); 
  // console.log(type);

  return result;

}

function generateSentence(topic) {

  var length = sentencePatternsClone[topic].length;

  // generate random sentence pattern
  var patternNumber = randomInt(length - 1);

  // console.log('sentencePatternsClone[' + topic + '].length = ' + (patternNumber+1));

  var pattern = sentencePatternsClone[topic][patternNumber];


  if (typeof pattern == 'undefined') {
    console.log('ran out.');
    return ":( ";
  }

  var pattern = pattern.replace(/([\.,;\?])/g,' $1');
  var pattern = pattern.split(' ');

  // remove the pattern from the sentence array so it isn't re-used
  removeSentence(topic, patternNumber);

  // console.log('sentencePatternsClone.length is now ' + sentencePatternsClone.length);
  if (sentencePatternsClone[topic].length == 0) {
    sentencePatternsClone.splice(topic, 1);
    // console.log('topic removed!');
    // console.log('sentencePatternsClone.length is now ' + sentencePatternsClone.length);
  }

  var result = "";

  for (var x in pattern) {

    switch (pattern[x]) {
      case 'nCosmos': result += retrieveRandomWordOfType(nCosmos);
      break;
      case 'nPerson': result += retrieveRandomWordOfType(nPerson);
      break;
      case 'nPersonPlural': result += retrieveRandomWordOfType(nPersonPlural);
      break;
      case 'nMass': result += retrieveRandomWordOfType(nMass);
      break;
      case 'nMassBad': result += retrieveRandomWordOfType(nMassBad);
      break;
      case 'nPath': result += retrieveRandomWordOfType(nPath);
      break;
      case 'nOurPlural': result += retrieveRandomWordOfType(nOurPlural);
      break;
      case 'nOf': result += retrieveRandomWordOfType(nOf);
      break;
      case 'ing': result += retrieveRandomWordOfType(ing);
      break;
      case 'adj': result += retrieveRandomWordOfType(adj);
      break;
      case 'adjBig': result += retrieveRandomWordOfType(adjBig);
      break;
      case 'adjWith': result += retrieveRandomWordOfType(adjWith);
      break;
      case 'adjPrefix': result += retrieveRandomWordOfType(adjPrefix);
      break;
      case 'vtMass': result += retrieveRandomWordOfType(vtMass);
      break;
      case 'vtPerson': result += retrieveRandomWordOfType(vtPerson);
      break;
      case 'vtDestroy': result += retrieveRandomWordOfType(vtDestroy);
      break;
      case 'viPerson': result += retrieveRandomWordOfType(viPerson);
      break;
      case 'nTheXOf': result += retrieveRandomWordOfType(nTheXOf);
      break;
      case 'ppPerson': result += retrieveRandomWordOfType(ppPerson);
      break;
      case 'ppThingPrep': result += retrieveRandomWordOfType(ppThingPrep);
      break;
      case 'fixedAdvP': result += retrieveRandomWordOfType(fixedAdvP);
      break;
      case 'fixedAdvPPlace': result += retrieveRandomWordOfType(fixedAdvPPlace);
      break;
      case 'fixedNP': result += retrieveRandomWordOfType(fixedNP);
      break;      
      case 'nSubject': result += retrieveRandomWordOfType(nSubject);
      break;
      case 'vOpenUp': result += retrieveRandomWordOfType(vOpenUp);
      break;      
      case 'vTraverse': result += retrieveRandomWordOfType(vTraverse);
      break;
      default: result += pattern[x];
    }

    result += ' ';
  }

  result = result.trim();
  result = capitalizeFirstLetter(result);

  if (result.charAt(result.length-1) != '?') {
    result += '. ';
  } else {
    result += ' ';
  }

  // remove spaces before commas/periods/semicolons
  result = result.replace(/ ([,\.;\?])/g,'$1');

  return result;
}

function generateText(numberOfSentences, sentenceTopic) {

  var fullText = "";

  for (var i = 0; i < numberOfSentences; i++) {

    fullText += generateSentence(sentenceTopic);

    // in case the topic got deleted
    if (typeof sentencePatternsClone[sentenceTopic] == 'undefined') {
      sentenceTopic = randomInt(sentencePatternsClone.length - 1);
      // console.log('topic reset to ' + sentenceTopic);
    }

  } 

  // replace 'a [vowel]' with 'an [vowel]'
  // I added a \W before the [Aa] because one time I got
  // "Dogman is the antithesis of knowledge" :)
  fullText = fullText.replace(/(^|\W)([Aa]) ([aeiou])/g,'$1$2n $3');

  // take care of prefixes (delete the space after the hyphen)
  fullText = fullText.replace(/- /g,'-');

  return fullText;

}

$('.topbar button').click(function(){

  sentencePatternsClone = deepCopy(sentencePatterns);

  // generate random topic
  var sentenceTopic = 0;

  $('h1').text(generateText(1, sentenceTopic));

  $('h2').text(generateText(2, sentenceTopic));

  sentenceTopic = randomInt(sentencePatternsClone.length - 2);

  $('h3').text(generateText(1, sentenceTopic));

  $('p').each(function( i ) {
    sentenceTopic = randomInt(sentencePatternsClone.length - 1);
    $(this).text(generateText(3, sentenceTopic));
  });

  sentenceTopic = randomInt(sentencePatternsClone.length - 1);

  $('blockquote').text(generateText(1, sentenceTopic));

  // change image
  $('img').attr('src', 'http://placeimg.com/640/480/nature?' + 
    Math.floor(Math.random() * 100));

});


$(document).ready(function() {

});






