/**
* Author
 @Inateno / http://inateno.com / http://dreamirl.com

* ContributorsList
 @Inateno

***
simple Game class declaration example
**/
define( [
  "config", "DREAM_ENGINE"
  , "screens.menus", "screens.game"
],
function(
  config, DE
  , screen_menus, screen_game
)
{
  var Game = {};
  
  Game.render  = null;
  Game.scene  = null;
  
  // init
  Game.init = function()
  {
    console.log( "game init" );
    DE.CONFIG.DEBUG = 0;
    DE.CONFIG.DEBUG_LEVEL = 2;
    Game.render = new DE.Render( "render", { fullScreen: "ratioStretch", width: config.screen_w, height: config.screen_h, backgroundColor: "0x222222" } );
    Game.render.init();
    
    DE.start();
  }
  
  Game.start = function()
  {
    // scene
    console.log( "game starto!!" );
    var screens = [
      screen_menus
      , screen_game
    ];
    var manager = new DE.GameScreensManager( Game.render, screens );
    manager.changeScreen( "Menu" );
    
    DE.trigger( "logged" );
    DE.AudioManager.mute();
    setTimeout( function(){ DE.States.down( "isLoading" ); }, 500 );
    
    
    
    // Game.scene = new DE.Scene( "Test" );
    
    // // camera
    // Game.camera = new DE.Camera( config.screen_w, config.screen_h, 0, 0, {
    //   'name': "Test zoom 100%", 'backgroundColor': "rgb(50,50,80)"
    // } );
    // Game.camera.scene = Game.scene;
    
    // Game.render.add( Game.camera );
    
    
    // setTimeout( function() {
    //   DE.States.down( "isLoading" );
    // }, 500 );
  };
  
  return Game;
} );