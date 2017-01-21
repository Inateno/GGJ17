define( [ "DREAM_ENGINE", "config", "DE.Popups", "scoreAPI" ],
function( DE, config, Popups, scoreAPI )
{
  var screen = new DE.GameScreen( "Menu", {
    camera: [ config.screen_w, config.screen_h, 0, 0, {} ]
    
    , initialize: function()
    {
      var self = this;
      
      var buttons = {
        play: new DE.GameObject( {
          x: config.screen_w / 2 >> 0, y: config.screen_h - 350
          ,renderer: new DE.TextRenderer( "Play", { fillColor: "white" } )
          ,collider: new DE.FixedBoxCollider( 200, 50 )
        } )
        ,scores: new DE.GameObject( {
          x: config.screen_w / 2 >> 0, y: config.screen_h - 250
          ,renderer: new DE.TextRenderer( "Scores", { fillColor: "white" } )
          ,collider: new DE.FixedBoxCollider( 200, 50 )
        } )
      };
      
      buttons.scores.onMouseUp = function()
      {
        scoreAPI.get( function( nicks, scores )
        {
          var string = "<h1>Leaderboard</h1>";
          for ( var i = 0; i < nicks.length; ++i )
            string += "<div>" + nicks[ i ] + ": " + scores[ i ] + "</div>";
          Popups.create( string );
        } );
      }
      buttons.play.onMouseUp = function(){ self.trigger( "changeScreen", "Game" ); }
      
      var logo = new DE.GameObject( {
        x: config.screen_w / 2 >> 0, y: 200
        ,renderer: new DE.TextRenderer( "Yolo cat", { fontSize: 70, fillColor: "white" } )
      } );
      this.addButtons( buttons );
      this.add( logo );
      
      this.on( "show", function( self, args )
      {
      } );
      this.on( "hide", function()
      {
      } );
    }
  } );
  
  return screen;
} );