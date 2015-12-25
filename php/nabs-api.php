<?php
/*
 * nabs-api.php
 *
 * Author: Mark Hazlewood
 * © 2015 Mark Hazlewood (mhazlewood.org)
 *
 * Licensed under the MIT License.
 *
 */

   include 'main.php';

   // Expose some bullshit via JSON
   $bs = new Bullshit();
   $mainTopic = rand(0, count($bs->sentencePool)-1);

   // Testing this with a Hipchat integration, which likes this format
   $text = array
   (
      "color" => "green",
      "message" => $bs->generateText(1, $mainTopic),
      "notify" => false,
      "message_format" => "text"
   );

   // Output bullshit as JSON
   header('Content-type: application/json');
   echo json_encode($text);
?>
