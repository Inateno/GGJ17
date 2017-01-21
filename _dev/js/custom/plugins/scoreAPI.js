define( [],
function()
{
  var _d = (Date.now()).toString();
  var scoreApi = {
    url: ""
    ,init: function( url )
    {
      this.url = url;
    }
    ,get: function( cb )
    {
      var script = document.createElement( "script" );
      script.type = "text/javascript";
      script.src = this.url + "scores.php?gs=1";
      document.body.appendChild( script );
      script.onload = function()
      {
        document.body.removeChild( script );
        if ( window.ajaxlistscores && window.ajaxlistnicks )
        {
          if ( cb )
            cb( window.ajaxlistnicks, window.ajaxlistscores );
        }
      }
    }
    
    ,send: function( score, nickname, cb )
    {
      var script = document.createElement( "script" );
      script.type = "text/javascript";
      script.src = this.url + "scores.php?rs=" + score + "&d=" + _d + score.toString() + score.toString().length
        + "&n=" + nickname;
      document.body.appendChild( script );
      script.onload = function()
      {
        if ( window.ajaxsuccess !== undefined )
        {
          if ( window.ajaxsuccess )
          {
            if ( cb )
              cb();
            // alert( "Your score is saved online yay" );
          }
          else
            alert( "An error occurred from client" );
        }
        else
        {
          alert( "An error occurred on server" );
        }
        document.body.removeChild( script );
      }
    }
  };
  
  return scoreApi;
} );