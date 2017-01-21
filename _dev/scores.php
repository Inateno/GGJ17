<?php
  
  $tojson = false;
  if ( !empty( $_GET[ 'tojson' ] ) )
  {
    $tojson = true;
  }
  
  // register score
  $filecontent = file_get_contents( 'scores.txt' );
  $scoresRaw = explode( " ", $filecontent );
  $scores = [];
  $nicks = [];
  foreach ( $scoresRaw as $s )
  {
    $current = explode( "-", $s );
    $scores[] = $current[ 1 ];
    $nicks[] = $current[ 0 ];
  }
  if ( $_GET[ 'rs' ] != "" )
  {
    // client code: ?rs=score&d=Date.now()+score+score.toString().length
    $data = htmlentities( $_GET[ 'd' ] );
    $nick = htmlentities( $_GET[ 'n' ] );
    // $sentScore = htmlentities( $_GET[ 'rs' ] );
    $scoreLength = substr( $data, -1 );
    if ( $scoreLength == 0 || $scoreLength > 8 )
    {
      echo "/* hackernoob somewhere ?? */var ajaxsuccess=false;";
      exit();
    }
    $data = substr( $data, 0, -1 );
    $score = substr( $data, -$scoreLength, $scoreLength );
    $data = substr( $data, 0, -$scoreLength );
    
    // $data is now time (Date.now()) from client
    if ( is_nan( $data ) || is_nan( $score )
        || $data / 1000 < 1485019572/*21/01/2017*/ || $data / 1000 > 1555019572/* april 2019 */ )
    {
      echo "/* woooo dat fail -> hackernoob somewhere maybe mmh ?? ".($data/1000)." */var ajaxsuccess=false;";
      exit();
    }
    $nick = substr( preg_replace( "#[^a-zA-Z0-9_]#is", "",  $nick ), 0, 20 );
    
    $position = 0;
    foreach ( $scores as $key => $value )
    {
      if ( $value < $score )
        break;
      $position++;
    }
    array_splice( $scores, $position, 0, $score );
    array_splice( $nicks, $position, 0, $nick );
    
    $newContent = "";
    
    foreach ( $nicks as $key => $value )
    {
      $newContent .= $value ."-". $scores[ $key ] ." ";
    }
    // make txt and put
    file_put_contents( 'scores.txt', substr( $newContent, 0, -1 ) );
    if ( $tojson )
      echo '{"ajaxsuccess":true}';
    else
      echo "var ajaxsuccess = true;";
  }
  else
  {
    if ( $_GET[ 'gs' ] )
    {
      if ( $tojson )
        echo '{ "ajaxlistscores":['. implode( ",", $scores ) .'],';
      else
        echo "var ajaxlistscores = [". implode( ",", $scores ) ."];";
      
      if ( $tojson )
        $strnicks = '"ajaxlistnicks":[';
      else
        $strnicks = "var ajaxlistnicks = [";
      foreach ( $nicks as $key => $value)
      {
        $strnicks .= '"'. $value .'"';
        if ( $key < count( $nicks ) - 1 )
          $strnicks .= ",";
      }
      echo $strnicks ."]";
      if ( $tojson )
        echo '}';
    }
    else
    {
      ?>
        <html>
          <head>
            <title>Constellations High Scores</title>
          </head>
          <body>
            <h2>Constellations High Scores</h2>
            <p>
              <a href="http://inateno.com/games/constellations">Link to the game</a>
              <br />
              <a href="http://dreamirl.com">My other games on Dreamirl</a>
            </p>
            <ul>
              <?php
                foreach ($scores as $key => $value) {
                  echo "<li>". $nicks[ $key ] ." - ". $value ."</li>";
                }
              ?>
            </ul>
          </body>
        </html>
      <?php
    }
  }
?>