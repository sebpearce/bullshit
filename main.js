"use strict"

/*
 * main.js
 *
 * New Age Bullshit Generator
 * © 2014–2022 Seb Pearce (sebpearce.com)
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

function capitalizeFirstLetter(str) {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

function randomInt(max) {
  return Math.floor(Math.random() * (max + 1))
}

function replaceAWithAn(sentence) {
  // replace 'a [vowel]' with 'an [vowel]'
  // I added a \W before the [Aa] because one time I got
  // 'Dogman is the antithesis of knowledge' :)
  return sentence.replace(/(^|\W)([Aa]) ([aeiou])/g, "$1$2n $3")
}

function removeSpacesBeforePunctuation(sentence) {
  // remove spaces before commas/periods/semicolons
  return sentence.replace(/ ([,\.;\?])/g, "$1")
}

function deleteSpaceAfterHyphen(sentence) {
  // take care of prefixes (delete the space after the hyphen)
  return sentence.replace(/- /g, "-")
}

function addSpaceAfterQuestionMarks(sentence) {
  // add space after question marks if they're mid-sentence
  return sentence.replace(/\?(\w)/g, "? $1")
}

function insertSpaceBeforePunctuation(sentence) {
  return sentence.replace(/([\.,;\?])/g, " $1")
}

function insertSpaceBetweenSentences(text) {
  // insert a space between sentences (after periods and question marks)
  return text.replace(/([\.\?])(\w)/g, "$1 $2")
}

// The generator in all its quantum glory
const bs = {
  sentencePool: [],

  initializeSentencePool: function () {
    // [...foo] only does shallow copies
    // but sentencePatterns is an array of arrays
    this.sentencePool = [...this.sentencePatterns.map((group) => group.slice())]
  },

  removeSentenceFromPool: function (topic, el) {
    if (el > -1) {
      this.sentencePool[topic].splice(el, 1)
    }
  },

  retrieveRandomWordOfType: function (type) {
    const rand = randomInt(this.bullshitWords[type].length - 1)
    return this.bullshitWords[type][rand]
  },

  cleanSentence: function (sentence) {
    let result = replaceAWithAn(sentence)
    result = result.trim()
    result = capitalizeFirstLetter(result)
    result = removeSpacesBeforePunctuation(result)
    result = deleteSpaceAfterHyphen(result)
    result = addSpaceAfterQuestionMarks(result)

    return result
  },

  generateSentence: function (topic) {
    const patternNumber = randomInt(this.sentencePool[topic].length - 1)
    let pattern = this.sentencePool[topic][patternNumber]

    if (typeof pattern === "undefined") {
      throw new Error("ran out of pattern " + patternNumber)
    }

    // insert a space before . , ; ? so we can split the string into an array
    pattern = insertSpaceBeforePunctuation(pattern)
    pattern = pattern.split(" ")

    // remove the pattern from the sentence pool so it can't be re-used
    this.removeSentenceFromPool(topic, patternNumber)

    // remove the topic from the sentence pool if there are no sentences left
    // for that particular topic
    if (this.sentencePool[topic].length === 0) {
      this.sentencePool.splice(topic, 1)
    }

    let result = ""
    for (let x in pattern) {
      // if word matches one of the placeholder words (e.g. nPerson),
      // replace it with a random instance of its type (e.g. warrior)
      if (this.bullshitWords.hasOwnProperty(pattern[x])) {
        result += this.retrieveRandomWordOfType(pattern[x])
      } else {
        result += pattern[x]
      }
      result += " "
    }

    result = this.cleanSentence(result)

    return result
  },

  generateText: function ({ numberOfSentences, topicIndex }) {
    let fullText = ""
    for (let i = 0; i < numberOfSentences; i++) {
      fullText += this.generateSentence(topicIndex)
      // if the topic has been deleted, pick another topic
      if (typeof this.sentencePool[topicIndex] === "undefined") {
        topicIndex = randomInt(this.sentencePool.length - 1)
      }
    }

    fullText = insertSpaceBetweenSentences(fullText)

    return fullText
  },
}

const timeouts = []

const reionizeBtn = document.querySelector(".reionize")
const pageFlash = document.querySelector(".page-flash")
const mainHeading = document.querySelector("#main-heading")
const subHeading = document.querySelector("#sub-heading")
const thirdHeading = document.querySelector("#third-heading")
const quote = document.querySelector(".quote")
const natureImage = document.querySelector(".nature-image")
const paragraphs = document.querySelectorAll(".bs-paragraph")
const allText = document.querySelectorAll(".fade-text")

function reionizeElectrons() {
  pageFlash.classList.replace("hide", "show")

  // clear existing timeouts if button is pushed while last round is animating
  timeouts.forEach((n) => window.clearTimeout(n))

  window.setTimeout(() => {
    pageFlash.classList.replace("show", "hide")
  }, 20)

  allText.forEach((t) => t.classList.replace("show", "hide"))

  bs.initializeSentencePool()

  // generate random topic
  let topicIndex = 0

  mainHeading.textContent = bs.generateText({
    numberOfSentences: 1,
    topicIndex,
  })
  subHeading.textContent = bs.generateText({
    numberOfSentences: 2,
    topicIndex,
  })

  topicIndex = randomInt(bs.sentencePool.length - 2)

  thirdHeading.textContent = bs.generateText({
    numberOfSentences: 1,
    topicIndex,
  })

  paragraphs.forEach((p) => {
    topicIndex = randomInt(bs.sentencePool.length - 1)
    p.textContent = bs.generateText({ numberOfSentences: 3, topicIndex })
  })

  topicIndex = randomInt(bs.sentencePool.length - 1)

  quote.textContent = bs.generateText({ numberOfSentences: 1, topicIndex })

  natureImage.classList.replace("show", "hide")

  const imageUrl =
    "https://placeimg.com/640/480/nature?" + Math.floor(Math.random() * 100)

  natureImage.setAttribute("src", imageUrl)

  allText.forEach((t, i) => {
    timeouts.push(
      window.setTimeout(() => {
        t.classList.replace("hide", "show")
      }, i * 250 + 250)
    )
  })
}

reionizeBtn.onclick = reionizeElectrons

natureImage.onload = () => natureImage.classList.replace("hide", "show")

// cancel the button jump if user hovers on it mid-jump
reionizeBtn.addEventListener("mouseenter", () =>
  reionizeBtn.classList.remove("glowjump")
)
