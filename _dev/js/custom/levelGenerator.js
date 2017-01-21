define( [ "DREAM_ENGINE", "config" ],
function( DE, config )
{
  function instantiateGenerator( scene, ticker )
  {
    var gen = new DE.GameObject();
    gen.checkTime = checkTime;
    gen.generate = generate;
    gen.scene = scene;
    gen.addAutomatism( "checkTime", "checkTime", { interval: 1000 } );
    gen.ticker = ticker;
    gen.currentLevel = 0;
    return gen;
  }
  
  var _lastSpawn = Date.now();
  var _lastSpawnPos = {};
  function checkTime()
  {
    if ( !this.ticker.running )
      return;
    
    var survivedTime = this.ticker.time;
    var level = null;
    for ( var i in config.generatorDelays )
    {
      if ( config.generatorDelays[ i ].min < survivedTime
        && config.generatorDelays[ i ].max > survivedTime )
      {
        level = i;
        break;
      }
    }
    
    if ( level === null )
      return;
    
    var minSpawnDelay = config.blocksLevels[ level ].delay;
    if ( Date.now() > _lastSpawn + minSpawnDelay )
    {
      this.generate( level );
    }
    
    if ( level != this.currentLevel )
    {
      this.trigger( "changeLevel", level );
      this.currentLevel = level;
    }
  }
  
  function generate( level )
  {
    _lastSpawn = Date.now();
    var block = new DE.GameObject( {
      tag: "block"
      ,zindex: 9
      ,x: 1300
      ,y: 50 + Math.random() * 600 >> 0
      ,renderer: new DE.RectRenderer( { fillColor: "0xFDECBA", width: 40, height: 70 + level * 10 } )
      ,collider: new DE.FixedBoxCollider( 40, 70 + level * 10 )
    } );
    block.addAutomatism( "translateX", "translateX", { value1: -2.5 } );
    block.checkDeath = function()
    {
      if ( this.position.x < -60 )
        this.askToKill();
    };
    
    this.scene.add( block );
  }
  
  return instantiateGenerator;
} );