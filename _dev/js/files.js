/**
* THIS IS: a sample to show you how to work with require for your project and include DreamEngine (for require ofc)
*
* @ContributorsList
* @Inateno / http://inateno.com / http://dreamirl.com
*
***
* @constructor
* main.js
- load all customs files
add your files here but DON'T call any parts of DreamEngine directly

-- problem with require.js ? give a look on api doc --> http://requirejs.org/docs/api.html#jsfiles

write here config for your files, your html have to call the DreamEngine file

   /\
  /  \    be sure to take DreamEngine-require version
 / !! \   engine call you file named "main"
/______\  check your main is in the same folder than DreamEngine-require lib

and have fun ^_^ hope you'll enjoy it !
**/
require.config( {
  paths: {
    "DREAM_ENGINE": "DreamEngine-min-require"
    // DATAS
    , "DE.imagesDatas" : "datas/imagesDatas"
    , "DE.inputsList"  : "datas/inputsList"
    , "DE.audiosList"  : "datas/audiosList"
    , "DE.dictionary"  : "datas/dictionary"
    
    ,"gameLoop"       : "custom/gameLoop"
    ,"Game"           : "custom/Game"
    ,"main"           : "main"
    ,"config"         : "custom/config"
    ,"Bubble"         : "custom/Bubble"
    ,"levelGenerator" : "custom/levelGenerator"
    
    // DE GameScreens
    ,"screens.menus"   : "custom/screens/menus"
    ,"screens.game"    : "custom/screens/game"
    
    ,"DE.GameScreen"        : "custom/plugins/GameScreen"
    ,"DE.GameScreensManager": "custom/plugins/GameScreensManager"
    
    ,"DE.Ticker": "custom/plugins/Ticker"
    ,"DE.Button": "custom/plugins/Button"
    ,"DE.Popups": "custom/plugins/Popups"
    ,"scoreAPI": "custom/plugins/scoreAPI"
  }
  , "urlArgs": "r=" + Date.now() // will be destroy when grunted
} );

// this will not be compiled by grunt, just for dev
require( [ "DREAM_ENGINE" ] );