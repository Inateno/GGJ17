define( [ "DREAM_ENGINE", "config", "Bubble", "scoreAPI", "DE.Popups", "levelGenerator" ],
function( DE, config, Bubble, scoreAPI, Popups, levelGenerator )
{
  var _gameOverWindow = undefined;
  
  scoreAPI.init( "http://dreamirl.com/jams/ggj17/meowaves/" );
  
  var screen = new DE.GameScreen( "Game", {
    camera: [ config.screen_w, config.screen_h, 0, 0, {} ]
    
    , initialize: function()
    {
      Popups.init();
      var bubbles = [];
      for ( var i = 0; i < 150; ++i )
      {
        bubbles.push( new Bubble() );
        bubbles[ i ].on( "available", function()
        {
          bubbles.push( this );
        } );
      }
      
      _gameOverWindow = makeGameOverScreen();
      var emitter = new DE.GameObject( {
        "x": 20, "y": config.screen_h / 2 - 100 >> 0
        ,renderer: new DE.RectRenderer( { width: 50, height: 200, fillColor: "0xD0D000" } )
      } );
      emitter.generateBubble = function()
      {
        // TODO remove this if possible
        if ( !bubbles.length )
          return;
        bubbles[ 0 ].onInScreen(
          this.getPos()
          , this.getRotation()
          , 1
        );
        bubbles.shift();
      };
      emitter.previousPos = 0;
      
      var cat = new DE.GameObject( {
        "x": 400
        ,"y": 0
        ,renderer: new DE.CircleRenderer( { radius: 35, fillColor: "0xCC0C0C" } )
        ,collider: new DE.CircleCollider( 40 )
      } );
      cat.boxCollider = new DE.FixedBoxCollider( 60, 60 );
      cat.boxCollider.gameObject = cat;
      cat.forceY = 0; cat.mass = 6;
      cat.makePhysic = function()
      {
        this.collide = false;
        this.blockCollide = false;
        
        if ( !this.isDead )
        {
          if ( screen.scene.objectsByTag.block )
          {
            for ( var i = 0, b; b = screen.scene.objectsByTag.block[ i ]; ++i )
            {
              if ( DE.CollisionSystem.fixedBoxCollision( this.boxCollider, b.collider ) )
              {
                this.blockCollide = true;
                break;
              }
            }
          }
          
          for ( var i = 0, b; b = screen.scene.objectsByTag.bubbles[ i ]; ++i )
          {
            if ( b.position.x < 200 || b.position.x > 400 )
              continue;
            // else if ( ( !this.yDest || this.yDest > b.position.y )
            else if ( DE.CollisionSystem.circleCollision( this.collider, b.collider ) )
            {
              this.collide = true;
              this.yDest = b.position.y;
              // this.position.y = b.position.y - 25;
              if ( this.position.y - this.yDest > 10 )
              {
                this.moveData.done = true;
                this.forceY = -4;
              }
              else if ( this.forceY >= 0 )
                this.moveTo( { y: this.yDest - 35 }, 100 );
            }
          }
        }
        
        
        if ( !this.collide || this.forceY < 0 )
        {
          this.yDest = undefined;
          if ( this.forceY > config.maxForceY )
            this.forceY = config.maxForceY;
          
          y = this.mass * this.forceY * config.coefAirFriction >> 0
          this.forceY += Math.abs( this.forceY * this.mass ) > config.maxAttractionForce ? 0 : config.attractionForce;
          this.forceY = ( this.forceY * 1000 >> 0 ) / 1000;
          this.position.y += y;
        }
        else
        {
          this.forceY = 0;
        }
        
        if ( this.position.y > 760 || this.blockCollide )
        {
          if ( !this.isDead )
          {
            this.forceY = -6;
            this.isDead = true;
            this.collider.enable = false;
            config.oldMaxForceY = config.maxForceY;
            config.maxForceY = 10;
            this.addAutomatism( "yolorotation", "rotate", { value1: 0.2 } );
            setTimeout( gameOver, 700 );
          }
          else
          {
            config.maxForceY = config.oldMaxForceY;
            this.collider.enable = true;
            this.removeAutomatism( "makePhysic" );
            this.removeAutomatism( "yolorotation" );
            this.isDead = false;
          }
        }
      };
      
      var startText = new DE.GameObject( {
        "x": config.screen_w * 0.5 >> 0
        ,"y": 200
        ,"zindex": 100
        ,"renderer": new DE.TextRenderer( "3", { fillColor: "white", fontSize: 100 } )
      } );
      
      var PI = Math.PI;
      var cursor = new DE.GameObject( { x: 100, y: 200 } );
      this.scene.add( cursor );
      this.camera.onMouseMove = function( pos )
      {
        if ( pos.x < 70 )
          pos.x = 70;
        cursor.moveTo( pos, 500 );
      };
      emitter.lookAtCursor = function(){ this.lookAt( cursor.getPos() ); };
      emitter.addAutomatism( "lookAtCursor" );
      
      emitter.addAutomatism( "generateBubble", "generateBubble", { interval: 200/*70*/ } );
      this.cat = cat;
      this.emitter = emitter;
      
      var currentLevel = new DE.GameObject( {
        x: config.screen_w - 300
        ,y: 40
        ,zindex: 50
        ,renderer: new DE.TextRenderer( "Level: 0", { fillColor: "white" } )
      } );
      currentLevel.bounceScale = function()
      {
        if ( this.scale.x < 1 )
          this.scaleTo( 1.5, 500 );
        else
          this.scaleTo( 0.7, 500 );
      }
      
      var counter = new DE.Ticker( {
        x: config.screen_w - 100
        ,y: 40
        ,zindex: 50
        ,mode: "counter"
        ,textRender: {
          fillColor : "white"
          ,fontSize : 40
          ,textAlign: "right"
          ,width: 500
        }
      } );
      var generator = levelGenerator( this.scene, counter );
      this.scene.add( counter, emitter, bubbles, cat, startText, _gameOverWindow, generator, currentLevel );
      this.counter = counter;
      
      generator.on( "changeLevel", function( level )
      {
        currentLevel.renderer.text = "Level: " + level;
        // anim de ouf
        if ( level >= 10 )
          currentLevel.addAutomatism( "bounceScale", "bounceScale", { interval: 500 } );
        else if ( currentLevel.automatism[ "bounceScale" ] )
          currentLevel.removeAutomatism( "bounceScale" );
        
        if ( level > 7 )
          level = 7;
        var color = ( parseInt( "F", 16 ) - ( level * 2 ) ).toString( 16 ).toUpperCase();
        
        console.log( color );
        currentLevel.renderer.style.fill = "#FF" + color + "" + color + "" + color + "" + color;
      } );
      
      this.on( "show", function( self, args )
      {
        generator.currentLevel = 0;
        generator.trigger( "changeLevel", 0 );
        _gameOverWindow.enable = false;
        startText.renderer.text = "3...";
        startText.position.z = 0;
        startText.position.setRotation( 0 );
        startText.alpha = 1;
        startText.enable = true;
        startText.removeAutomatism( "rotate" );
        startText.moveData.done = true;
        
        setTimeout( function(){ startText.renderer.text = "2..";}, 1000 );
        setTimeout( function(){ startText.renderer.text = "1";}, 2000 );
        setTimeout( function()
        {
          setTimeout( function()
          {
            startText.moveTo( { z: 20 }, 4000 );
            startText.addAutomatism( "rotate", "rotate", { value1: 0.2 } );
            startText.fadeOut( 2000 );
          }, 1000 );
          startText.renderer.text = "Surf!";
        }, 3000 );
        cat.position.y = -100;
        cat.moveData.done = true;
        counter.reset();
        setTimeout( function()
        {
          cat.addAutomatism( "makePhysic" );
        }, 4000 );
        // gameOver();
      } );
      this.on( "hide", function()
      {
        counter.pause();
      } );
    }
  } );

  function gameOver()
  {
    var score = screen.counter.time / 10 >> 0;
    console.log( score );
    
    screen.counter.pause();
    _gameOverWindow.position.y = -500;
    _gameOverWindow.score.renderer.text = score;
    _gameOverWindow.enable = true;
    _gameOverWindow.leaderBtn.enable = false;
    
    for ( var i = 0; i < screen.scene.objectsByTag.block.length; ++i )
      screen.scene.objectsByTag.block[ i ].fadeOut( 500 );
    
    _gameOverWindow.moveTo( { y: config.screen_h / 2 + 25 >> 0 }, 400, function()
    {
      _gameOverWindow.moveTo( { y: config.screen_h / 2 - 20 >> 0 }, 100, function()
      {
        _gameOverWindow.moveTo( { y: config.screen_h / 2 + 20 >> 0 }, 300, function()
        {
          _gameOverWindow.moveTo( { y: config.screen_h / 2 >> 0 }, 500, function()
          {
            if ( !DE.SaveSystem.get( "bestScore" ) || DE.SaveSystem.get( "bestScore" ) < score )
            {
              _gameOverWindow.leaderBtn.scale.set( 0.1, 0.1 );
              _gameOverWindow.leaderBtn.fadeIn( 100, true );
              _gameOverWindow.leaderBtn.scaleTo( 1.6, 300 );
              _gameOverWindow.leaderBtn.addAutomatism( "yolorotate", "rotate", { value1: 0.4 } );
              setTimeout( function(){
                _gameOverWindow.leaderBtn.scaleTo( 1, 80 );
                _gameOverWindow.leaderBtn.removeAutomatism( "yolorotate" );
                _gameOverWindow.leaderBtn.position.setRotation( 0 );
              }, 310 );
              
              DE.SaveSystem.save( "bestScore", score );
            }
            
            for ( var i = 0; i < screen.scene.objectsByTag.block.length; ++i )
              screen.scene.objectsByTag.block[ i ].askToKill();
          } );
        } );
      } );
    } );
  }
  
  function makeGameOverScreen()
  {
    var obj = new DE.GameObject( {
      "x": config.screen_w * 0.5 >> 0
      ,"y": -510
      ,"zindex": 200
      ,"renderer": new DE.RectRenderer( { fillColor: "0x442244", width: 600, height: 420, radius: 20 } )
    } );
    
    var replayBtn = new DE.Button(
      { x: 170, y: 140 }, {
        spriteRenderer: { spriteName: "btn-replay", scale: 1 }
        ,collider: { width: 130, height: 130 }
        ,sound: "click"
      }, {
        onMouseClick: function( mouse, propagation )
        {
          screen.trigger( "show" );
        }
    } );
    
    var quitBtn = new DE.Button(
      { x: -170, y: 140 }, {
        spriteRenderer: { spriteName: "btn-nop", scale: 1 }
        ,collider: { width: 130, height: 130 }
        ,sound: "click"
      }, {
        onMouseClick: function( mouse, propagation )
        {
          screen.trigger( "changeScreen", "Menu" );
        }
    } );
    
    var soundBtn = new DE.Button(
      { x: 0, y: 140 }, {
        spriteRenderer: { spriteName: "btn-sound_on", scale: 1 }
        ,collider: { width: 130, height: 130 }
        ,sound: "click"
      }, {
        onMouseClick: function( mouse, propagation )
        {
          alert( "Sound is required" );
        }
    } );
    
    var leaderBtn = new DE.Button(
      { x: 0, y: 0 }, {
        spriteRenderer: { spriteName: "btn-leaderboard", scale: 0.6 }
        ,collider: { width: 80, height: 80 }
        ,sound: "click"
      }, {
        onMouseClick: function( mouse, propagation )
        {
          var nick = prompt( "Your name ?" ).replace( / /gi, "" ).toLowerCase();
          console.log( nick )
          if ( nick.length >= 3 )
          {
            console.log( "nick is " + nick );
            scoreAPI.send( screen.counter.time || 1, nick, function()
            {
              scoreAPI.get( function( nicks, scores )
              {
                var string = "<h1>Leaderboard</h1>";
                for ( var i = 0; i < nicks.length; ++i )
                  string += "<div>" + nicks[ i ] + ": " + scores[ i ] + "</div>";
                Popups.create( string );
              } );
            } );
          }
          else
            alert( "At least 3 characters without spaces." );
        }
    } );
    
    var txt = new DE.GameObject( {
      "y": -150, renderer: new DE.TextRenderer( "Too bad", { fillColor: "white", fontSize: 50 } )
    } );
    
    var score = new DE.GameObject( {
      "y": -80, renderer: new DE.TextRenderer( "score", { fillColor: "white", fontSize: 40, width: 500 } )
    } );
    
    obj.add( quitBtn, replayBtn, score, txt, soundBtn, leaderBtn );
    obj.score = score;
    obj.leaderBtn = leaderBtn;
    return obj;
  }
  
  window.screenGame = screen;
  return screen;
} );