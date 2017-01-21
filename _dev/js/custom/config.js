define( [],
function()
{
  return {
    screen_w: 1280
    ,screen_h: 720
    ,waveDirSpeed: 0.02//0.01
    ,maxWaveRot: -0.1
    ,minWaveRot: -( Math.PI - 0.1 )
    
    , coefAirFriction        : 0.9
    , maxAttractionForce     : 100
    , maxForceY              : 2
    , attractionForce        : 0.2//0.1
    
    ,generatorDelays: {
      "0": { min: 8000, max: 20000 }
      ,"1": { min: 20500, max: 30000 }
      ,"2": { min: 30500, max: 40000 }
      ,"3": { min: 40500, max: 45000 }
      ,"4": { min: 45500, max: 50000 }
      ,"5": { min: 50500, max: 55000 }
      ,"6": { min: 55500, max: 58000 }
      ,"7": { min: 58500, max: 60000 }
      ,"8": { min: 60500, max: 62000 }
      ,"9": { min: 62500, max: 64000 }
      ,"10": { min: 64500, max: 66000 }
      ,"11": { min: 66500, max: 68000 }
      ,"12": { min: 68500, max: 70000 }
      ,"13": { min: 70500, max: 72000 }
      ,"14": { min: 72500, max: 74000 }
      ,"15": { min: 74500, max: Infinity }
    }
    ,blocksLevels: [
      { delay: 5000 }
      ,{ delay: 4500 }
      ,{ delay: 4000 }
      ,{ delay: 3500 }
      ,{ delay: 3000 }
      ,{ delay: 2500 }
      ,{ delay: 2200 }
      ,{ delay: 2000 }
      ,{ delay: 1800 }
      ,{ delay: 1500 }
      ,{ delay: 800 } // niveau 10
      ,{ delay: 700 } // niveau 11
      ,{ delay: 600 } // niveau 12
      ,{ delay: 500 } // niveau 13
      ,{ delay: 400 } // niveau 14
      ,{ delay: 200 } // niveau 15 MAX
    ]
  };
} );