export default function Static3DClub() {
  return (
    <div className="w-full h-[600px] bg-gradient-to-b from-sky-100 to-blue-50 rounded-xl overflow-hidden shadow-2xl relative flex items-center justify-center perspective-1000">
      
      {/* 3D Club Container */}
      <div className="relative transform-gpu" style={{ 
        transform: 'rotateX(45deg) rotateY(-25deg)',
        transformStyle: 'preserve-3d'
      }}>
        
        {/* Floor */}
        <div 
          className="absolute bg-gray-200 border border-gray-300"
          style={{
            width: '400px',
            height: '300px',
            transform: 'translateZ(0px)',
            background: 'linear-gradient(45deg, #f3f4f6 25%, #e5e7eb 25%, #e5e7eb 50%, #f3f4f6 50%, #f3f4f6 75%, #e5e7eb 75%)',
            backgroundSize: '20px 20px'
          }}
        />
        
        {/* Back Wall */}
        <div 
          className="absolute bg-white border-2 border-gray-300"
          style={{
            width: '400px',
            height: '120px',
            transform: 'translateY(-120px) translateZ(0px) rotateX(90deg)',
            transformOrigin: 'bottom'
          }}
        >
          {/* Logo on back wall */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-orange-500 font-bold text-lg">
            KINETIC KIDS
          </div>
        </div>
        
        {/* Left Wall */}
        <div 
          className="absolute bg-gray-50 border-2 border-gray-300"
          style={{
            width: '300px',
            height: '120px',
            transform: 'translateY(-120px) rotateY(90deg) translateZ(0px)',
            transformOrigin: 'bottom left'
          }}
        />
        
        {/* Right Wall */}
        <div 
          className="absolute bg-gray-50 border-2 border-gray-300"
          style={{
            width: '300px',
            height: '120px',
            transform: 'translateY(-120px) translateX(400px) rotateY(90deg) translateZ(0px)',
            transformOrigin: 'bottom right'
          }}
        />
        
        {/* Front Wall Left */}
        <div 
          className="absolute bg-gray-50 border-2 border-gray-300"
          style={{
            width: '120px',
            height: '120px',
            transform: 'translateY(-120px) translateZ(300px) rotateX(90deg)',
            transformOrigin: 'bottom'
          }}
        />
        
        {/* Front Wall Right */}
        <div 
          className="absolute bg-gray-50 border-2 border-gray-300"
          style={{
            width: '120px',
            height: '120px',
            transform: 'translateY(-120px) translateX(280px) translateZ(300px) rotateX(90deg)',
            transformOrigin: 'bottom'
          }}
        />
        
        {/* Reception Desk */}
        <div 
          className="absolute bg-blue-600"
          style={{
            width: '80px',
            height: '50px',
            transform: 'translateX(300px) translateY(-25px) translateZ(220px)',
          }}
        >
          {/* Desk Top */}
          <div 
            className="absolute bg-blue-700 border border-blue-800"
            style={{
              width: '80px',
              height: '50px',
              transform: 'translateY(-8px) rotateX(90deg)',
              transformOrigin: 'top'
            }}
          />
          {/* Logo on desk */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white text-xs font-bold">
            LOGO
          </div>
        </div>
        
        {/* Roller Zone - Ramp 1 */}
        <div 
          className="absolute bg-green-500"
          style={{
            width: '100px',
            height: '40px',
            transform: 'translateX(50px) translateY(-15px) translateZ(80px) rotateZ(10deg)',
          }}
        >
          <div 
            className="absolute bg-green-600 border border-green-700"
            style={{
              width: '100px',
              height: '40px',
              transform: 'translateY(-3px) rotateX(80deg)',
              transformOrigin: 'top'
            }}
          />
        </div>
        
        {/* Roller Zone - Ramp 2 */}
        <div 
          className="absolute bg-blue-500"
          style={{
            width: '80px',
            height: '30px',
            transform: 'translateX(170px) translateY(-12px) translateZ(120px) rotateZ(-8deg)',
          }}
        >
          <div 
            className="absolute bg-blue-600 border border-blue-700"
            style={{
              width: '80px',
              height: '30px',
              transform: 'translateY(-3px) rotateX(75deg)',
              transformOrigin: 'top'
            }}
          />
        </div>
        
        {/* Skate Park - Big Ramp */}
        <div 
          className="absolute bg-red-500"
          style={{
            width: '120px',
            height: '60px',
            transform: 'translateX(250px) translateY(-30px) translateZ(50px)',
          }}
        >
          <div 
            className="absolute bg-red-600 border border-red-700 rounded-t-full"
            style={{
              width: '120px',
              height: '60px',
              transform: 'translateY(-15px) rotateX(70deg)',
              transformOrigin: 'top'
            }}
          />
        </div>
        
        {/* Fun Box */}
        <div 
          className="absolute bg-purple-500"
          style={{
            width: '70px',
            height: '40px',
            transform: 'translateX(280px) translateY(-20px) translateZ(150px)',
          }}
        >
          <div 
            className="absolute bg-purple-600 border border-purple-700"
            style={{
              width: '70px',
              height: '40px',
              transform: 'translateY(-8px) rotateX(90deg)',
              transformOrigin: 'top'
            }}
          />
        </div>
        
        {/* Rail */}
        <div 
          className="absolute bg-gray-600"
          style={{
            width: '4px',
            height: '80px',
            transform: 'translateX(200px) translateY(-15px) translateZ(200px) rotateZ(90deg)',
          }}
        />
        
        {/* Rail Support 1 */}
        <div 
          className="absolute bg-gray-500"
          style={{
            width: '6px',
            height: '15px',
            transform: 'translateX(170px) translateY(-7px) translateZ(200px)',
          }}
        />
        
        {/* Rail Support 2 */}
        <div 
          className="absolute bg-gray-500"
          style={{
            width: '6px',
            height: '15px',
            transform: 'translateX(230px) translateY(-7px) translateZ(200px)',
          }}
        />
        
        {/* Mini Ramp in Roller Zone */}
        <div 
          className="absolute bg-orange-500 rounded-t-full"
          style={{
            width: '60px',
            height: '30px',
            transform: 'translateX(80px) translateY(-15px) translateZ(180px)',
          }}
        >
          <div 
            className="absolute bg-orange-600 border border-orange-700 rounded-t-full"
            style={{
              width: '60px',
              height: '30px',
              transform: 'translateY(-8px) rotateX(80deg)',
              transformOrigin: 'top'
            }}
          />
        </div>
        
      </div>
      
      {/* Labels */}
      <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-lg text-sm">
        <div className="font-semibold text-gray-800 mb-2">🏢 3D План клуба</div>
        <div className="text-xs text-gray-600 space-y-1">
          <div>🟢 Зона роликов</div>
          <div>🔴 Скейт-парк</div>
          <div>🟣 Препятствия</div>
          <div>🔵 Стойка админа</div>
        </div>
      </div>
      
      <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-lg text-sm">
        <div className="font-semibold text-gray-800 text-center">KINETIC KIDS</div>
        <div className="text-xs text-gray-600 text-center">Открытие май 2026</div>
      </div>
      
    </div>
  );
}