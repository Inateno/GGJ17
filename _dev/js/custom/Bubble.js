define( [ 'config', 'DREAM_ENGINE' ],
function( config, DE )
{
  var _bubble_w = 50;
  function Bubble()
  {
    DE.GameObject.call( this, {
      "x": 300
      ,"y": config.screen_h / 2 >> 0
      ,"zindex": 1
      ,"tag": "bubbles"
      //DE.CircleRenderer( { radius: 25, fillColor: "0x0000DD" } )
      ,"collider": new DE.CircleCollider( 25 )
    } );
    
    this.bubbleSprite = new DE.GameObject( {
      "renderer": new DE.SpriteRenderer( { spriteName: "bubble" } )
    } );
    this.previousScaleDir = 1;
    this.addAutomatism( "rotate", "rotate", { value1: Math.random() * 0.04 + 0.03 } );
    this.bubbleSprite.addAutomatism( "scaleUp", "scaleTo", {
      value1: 1.1
      ,value2: Math.random() * 400 + 400 >> 0, persistent: false
    } );
    this.addAutomatism( "changeScale", "changeScale", { interval: 800 } );
    this.add( this.bubbleSprite );
    
    this.addAutomatism( "move" );
  }
  
  Bubble.prototype = Object.create( DE.GameObject.prototype );
  Bubble.prototype.constructor = Bubble;
  Bubble.prototype.supr        = DE.GameObject.prototype;
  
  Bubble.prototype.changeScale = function()
  {
    this.previousScaleDir = -this.previousScaleDir;
    this.bubbleSprite.addAutomatism( "scaleUp", "scaleTo", {
      value1: 1 + ( Math.random() * 0.15 * this.previousScaleDir )
      , value2: Math.random() * 400 + 400 >> 0
      , persistent: false
    } );
  };
  
  Bubble.prototype.onOutScreen = function()
  {
    this.enable = false;
    this.position.x = -_bubble_w;
    this.trigger( "available" );
  };
  
  Bubble.prototype.onInScreen = function( pos, rot, dir )
  {
    this.enable = true;
    this.position.setPosition( pos );
    this.position.setRotation( rot );
    this.currentRot = rot;
    this.rotDir = dir;
  };
  
  Bubble.prototype.move = function()
  {
    if ( this.position.x > config.screen_w + _bubble_w )
      return this.onOutScreen();
    
    this.translateY( 4 );
    this.position.setRotation( this.currentRot + ( config.waveDirSpeed * this.rotDir ) );
    this.currentRot = this.position.rotation;
    
    if ( this.currentRot > config.maxWaveRot || this.currentRot < config.minWaveRot )
      this.rotDir = -this.rotDir;
  };
  
  return Bubble;
} );
