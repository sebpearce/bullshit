<?php
/*
 * main.php
 *
 * Author: Mark Hazlewood
 *
 * Ported from:
 * New Age Bullshit Generator
 * © 2014-15 Seb Pearce (sebpearce.com)
 *
 * Licensed under the MIT License.
 *
 */

 include 'patterns.php';
 include 'vocab.php';

class Bullshit
{
   public $sentencePool = array();

   function __construct()
   {
       $this->initializeSentencePool();
   }

   private function initializeSentencePool()
   {
      unset($this->sentencePool);
      $this->sentencePool = Patterns::$sentencePatterns;
   }

   private function removeSentenceFromPool($topic, $el)
   {
      if ($el > -1)
      {
         array_splice($this->sentencePool[$topic], $el, 1);
      }
   }

   private function retrieveRandomWordOfType($type)
   {
      $rand = rand(0, count(Vocab::$bullshitWords[$type])-1);
      return Vocab::$bullshitWords[$type][$rand];
   }

   private function generateSentence($topic)
   {
      $patternNumber = rand(0, count($this->sentencePool)-1);
      $pattern = $this->sentencePool[$topic][$patternNumber];

      // insert a space before . , ; ? so we can split the string into an array
      $pattern = preg_replace('/([\.,;\?])/', ' $1', $pattern);
      $pattern = explode(" ", $pattern);

      // remove the pattern from the sentence pool so it can't be re-used
      $this->removeSentenceFromPool($topic, $patternNumber);

      // remove the topic from the sentence pool if there are no sentences left
      // for that particular topic
      if (count($this->sentencePool[$topic]) == 0)
      {
         array_splice($this->sentencePool, $topic, 1);
      }

      $result = '';
      foreach ($pattern as $x)
      {
        // if word matches one of the placeholder words (e.g. nPerson),
        // replace it with a random instance of its type (e.g. warrior)
        if (array_key_exists($x, Vocab::$bullshitWords))
        {
           $replacement = $this->retrieveRandomWordOfType($x);

          $result .= $replacement;
        }
        else
        {
          $result .= $x;
        }
        $result .= ' ';
      }

      // replace 'a [vowel]' with 'an [vowel]'
      // I added a \W before the [Aa] because one time I got
      // 'Dogman is the antithesis of knowledge' :)
      $result = preg_replace("/(^|\W)([Aa]) ([aeiou])/", ' $1$2n $3', $result);

      $result = trim($result);
      $result = ucfirst($result);

      // remove spaces before commas/periods/semicolons
      $result = preg_replace("/ ([,\.;\?])/", '$1', $result);
      // take care of prefixes (delete the space after the hyphen)
      $result = preg_replace("/- /", '-', $result);
      // add space after question marks if they're mid-sentence
      $result = preg_replace("/\?(\w)/", '? $1', $result);

      return $result;
   }

   public function generateText($numerOfSentences, $sentenceTopic)
   {
      $fullText = "";
      for ($i = 0; $i <= $numerOfSentences; $i++)
      {
         $fullText .= $this->generateSentence($sentenceTopic);

         // if the topic has been deleted, pick another topic
         if (!isset($this->sentencePool[$sentenceTopic]))
         {
           $sentenceTopic = rand(0, count($this->sentencePool) - 1);
         }
      }

      // insert a space between sentences (after periods and question marks)
      $fullText = preg_replace("/([\.\?])(\w)/", '$1 $2', $fullText);

      return $fullText;
   }
}

 ?>
