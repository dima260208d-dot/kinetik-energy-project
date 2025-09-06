import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Box, Text, Environment } from '@react-three/drei';
import * as THREE from 'three';

function SkateArea() {
  return (
    <group position={[-3, -2.5, 0]}>
      {/* Основание скейт-парка */}
      <Box args={[8, 0.2, 10]} position={[0, 0, 0]}>
        <meshStandardMaterial color="#4b4b4b" />
      </Box>
      
      {/* Рампы */}
      <group>
        {/* Квартер-пайп слева */}
        <mesh position={[-3, 0.75, -2]} rotation={[0, 0, -Math.PI/2]}>
          <cylinderGeometry args={[1.5, 1.5, 6, 32, 1, false, 0, Math.PI/2]} />
          <meshStandardMaterial color="#ea580c" side={THREE.DoubleSide} />
        </mesh>
        
        {/* Центральная рампа */}
        <Box args={[3, 1, 4]} position={[0, 0.5, 0]} rotation={[0, 0, 0]}>
          <meshStandardMaterial color="#14b8a6" />
        </Box>
        
        {/* Мини-рампа справа */}
        <mesh position={[3, 0.5, 2]} rotation={[0, Math.PI/2, 0]}>
          <cylinderGeometry args={[1, 1, 3, 32, 1, false, 0, Math.PI]} />
          <meshStandardMaterial color="#8b5cf6" side={THREE.DoubleSide} />
        </mesh>
      </group>
      
      {/* Препятствия */}
      <group>
        <Box args={[2, 0.3, 0.3]} position={[-1, 0.25, 3]}>
          <meshStandardMaterial color="#fbbf24" />
        </Box>
        <Box args={[1.5, 0.4, 0.4]} position={[2, 0.3, -3]}>
          <meshStandardMaterial color="#f59e0b" />
        </Box>
      </group>
    </group>
  );
}

function CafeArea() {
  return (
    <group position={[5, -2.5, 0]}>
      {/* Пол кафе */}
      <Box args={[6, 0.1, 8]} position={[0, 0, 0]}>
        <meshStandardMaterial color="#d4d4d8" />
      </Box>
      
      {/* Столы */}
      <group>
        {[
          [-1.5, 0.4, -2],
          [1.5, 0.4, -2],
          [-1.5, 0.4, 1],
          [1.5, 0.4, 1]
        ].map((pos, idx) => (
          <group key={idx} position={pos}>
            <Box args={[1.2, 0.05, 1.2]} position={[0, 0, 0]}>
              <meshStandardMaterial color="#ea580c" />
            </Box>
            <Box args={[0.1, 0.4, 0.1]} position={[0.4, -0.2, 0.4]}>
              <meshStandardMaterial color="#71717a" />
            </Box>
            <Box args={[0.1, 0.4, 0.1]} position={[-0.4, -0.2, 0.4]}>
              <meshStandardMaterial color="#71717a" />
            </Box>
            <Box args={[0.1, 0.4, 0.1]} position={[0.4, -0.2, -0.4]}>
              <meshStandardMaterial color="#71717a" />
            </Box>
            <Box args={[0.1, 0.4, 0.1]} position={[-0.4, -0.2, -0.4]}>
              <meshStandardMaterial color="#71717a" />
            </Box>
          </group>
        ))}
      </group>
      
      {/* Барная стойка */}
      <Box args={[4, 0.8, 0.8]} position={[0, 0.4, 3.5]}>
        <meshStandardMaterial color="#3f3f46" />
      </Box>
    </group>
  );
}

function ClubInterior() {
  return (
    <group>
      {/* Пол */}
      <Box args={[20, 0.1, 20]} position={[0, -2.5, 0]}>
        <meshStandardMaterial color="#27272a" />
      </Box>
      
      {/* Стены */}
      <group>
        <Box args={[20, 8, 0.2]} position={[0, 1.5, -10]}>
          <meshStandardMaterial color="#e4e4e7" />
        </Box>
        <Box args={[20, 8, 0.2]} position={[0, 1.5, 10]}>
          <meshStandardMaterial color="#e4e4e7" transparent opacity={0.3} />
        </Box>
        <Box args={[0.2, 8, 20]} position={[-10, 1.5, 0]}>
          <meshStandardMaterial color="#e4e4e7" />
        </Box>
        <Box args={[0.2, 8, 20]} position={[10, 1.5, 0]}>
          <meshStandardMaterial color="#e4e4e7" transparent opacity={0.3} />
        </Box>
      </group>
      
      {/* Потолочные балки */}
      <group position={[0, 5, 0]}>
        {[-6, -3, 0, 3, 6].map((x, idx) => (
          <Box key={idx} args={[0.3, 0.3, 20]} position={[x, 0, 0]}>
            <meshStandardMaterial color="#18181b" />
          </Box>
        ))}
        {[-6, -3, 0, 3, 6].map((z, idx) => (
          <Box key={`z${idx}`} args={[20, 0.3, 0.3]} position={[0, 0, z]}>
            <meshStandardMaterial color="#18181b" />
          </Box>
        ))}
      </group>
      
      {/* Окна */}
      <group>
        {[-7, -3.5, 0, 3.5, 7].map((x, idx) => (
          <Box key={idx} args={[2.5, 4, 0.1]} position={[x, 2, -9.9]}>
            <meshStandardMaterial color="#60a5fa" transparent opacity={0.3} />
          </Box>
        ))}
      </group>
      
      {/* Логотип на стене */}
      <Text
        position={[0, 3, -9.8]}
        fontSize={1.2}
        color="#ea580c"
        anchorX="center"
        anchorY="middle"
      >
        KINETIC KIDS
      </Text>
      
      <SkateArea />
      <CafeArea />
      
      {/* Раздевалки */}
      <group position={[0, -2.5, 7]}>
        <Box args={[3, 3, 0.1]} position={[-3, 1.5, 0]}>
          <meshStandardMaterial color="#14b8a6" />
        </Box>
        <Box args={[3, 3, 0.1]} position={[3, 1.5, 0]}>
          <meshStandardMaterial color="#ea580c" />
        </Box>
      </group>
    </group>
  );
}

export default function Club3DModel() {
  return (
    <div className="w-full h-[600px] bg-gray-100 rounded-lg overflow-hidden">
      <Canvas
        camera={{ position: [15, 10, 15], fov: 50 }}
        shadows
      >
        <Suspense fallback={null}>
          <ambientLight intensity={0.5} />
          <directionalLight 
            position={[10, 10, 5]} 
            intensity={1} 
            castShadow
            shadow-mapSize={[2048, 2048]}
          />
          <pointLight position={[-10, 10, -10]} intensity={0.5} />
          
          <ClubInterior />
          
          <OrbitControls 
            enablePan={true}
            enableZoom={true}
            enableRotate={true}
            minDistance={5}
            maxDistance={50}
            maxPolarAngle={Math.PI / 2}
          />
          
          <Environment preset="city" />
        </Suspense>
      </Canvas>
      
      <div className="absolute bottom-4 left-4 bg-white/90 p-3 rounded-lg shadow-lg">
        <p className="text-sm font-semibold text-gray-800 mb-1">Управление:</p>
        <p className="text-xs text-gray-600">🖱️ Левая кнопка - вращение</p>
        <p className="text-xs text-gray-600">🖱️ Правая кнопка - перемещение</p>
        <p className="text-xs text-gray-600">🔄 Колесико - масштаб</p>
      </div>
    </div>
  );
}