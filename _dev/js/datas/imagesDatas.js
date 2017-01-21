/**
* @ContributorsList
* @Inateno / http://inateno.com / http://dreamirl.com
*
***
*
* @singleton
* imagesList
this is the imagesList will be available in the project.
Please declare in the same way than this example.
To load image as default just set "load" to true.
Otherwhise you can load/add images when you want, load images by calling the DREAM_ENGINE.ImageManager.pushImage function

- [ name, url, extension, 
parameters: load:Bool, totalFrame:Int, totalLine:Int, eachAnim:Int (ms), isAnimated:Bool, isReversed:Bool
] -

All parameters are optionnal but at least an empty object need to be set
**/
define( [ 'DE.CONFIG' ],
function( CONFIG )
{
  var datas = {
    // avalaible images sizes (engine will load optimisest images depends on user resolution)
    screenSizes: [
      { "w": 1280, "h": 720, "path": "" }
    ]
    
    // index of the used screen size during game conception
    , conceptionSizeIndex: 0
    
    // images folder name 
    , baseUrl: "img/"
    
    // usage name, real name (can contain subpath), extension, parameters
    , pools: {
      main: [
        [ "bubble", "bubble.png", { "totalFrame": 1, "totalLine": 1, "eachAnim": 100, "isAnimated":false, "isReversed": false } ]
        ,[ "btn-nop", "ui/nop.png", { "totalFrame": 3, "totalLine": 1 } ]
        ,[ "btn-replay", "ui/replay.png", { "totalFrame": 3, "totalLine": 1 } ]
        ,[ "btn-sound_on", "ui/sound_on.png", { "totalFrame": 3, "totalLine": 1 } ]
        ,[ "btn-sound_off", "ui/sound_off.png", { "totalFrame": 3, "totalLine": 1 } ]
        ,[ "btn-leaderboard", "ui/leaderboard.png", { "totalFrame": 3, "totalLine": 1 } ]
      ]
    }
  };
  
  CONFIG.debug.log( "imagesDatas loaded", 3 );
  return datas;
} );