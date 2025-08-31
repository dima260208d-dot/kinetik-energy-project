import { Canvas } from '@react-three/fiber';
import { OrbitControls, Text, Cylinder, RoundedBox } from '@react-three/drei';
import { useRef } from 'react';
import * as THREE from 'three';

function ClubInterior() {
  const groupRef = useRef<THREE.Group>(null);

  return (
    <group ref={groupRef}>
      {/* Пол */}
      <RoundedBox
        args={[30, 0.2, 20]}
        position={[0, -0.1, 0]}
        radius={0.1}
      >
        <meshStandardMaterial color="#e5e7eb" />
      </RoundedBox>

      {/* Стены */}
      {/* Задняя стена */}
      <RoundedBox
        args={[30, 8, 0.5]}
        position={[0, 4, -10]}
        radius={0.1}
      >
        <meshStandardMaterial color="#f3f4f6" />
      </RoundedBox>

      {/* Левая стена */}
      <RoundedBox
        args={[0.5, 8, 20]}
        position={[-15, 4, 0]}
        radius={0.1}
      >
        <meshStandardMaterial color="#f3f4f6" />
      </RoundedBox>

      {/* Правая стена */}
      <RoundedBox
        args={[0.5, 8, 20]}
        position={[15, 4, 0]}
        radius={0.1}
      >
        <meshStandardMaterial color="#f3f4f6" />
      </RoundedBox>

      {/* Передняя стена с входом */}
      <RoundedBox
        args={[8, 8, 0.5]}
        position={[-7, 4, 10]}
        radius={0.1}
      >
        <meshStandardMaterial color="#f3f4f6" />
      </RoundedBox>
      <RoundedBox
        args={[8, 8, 0.5]}
        position={[7, 4, 10]}
        radius={0.1}
      >
        <meshStandardMaterial color="#f3f4f6" />
      </RoundedBox>
      
      {/* Вход - арка */}
      <RoundedBox
        args={[6, 3, 0.3]}
        position={[0, 6, 10]}
        radius={0.1}
      >
        <meshStandardMaterial color="#f3f4f6" />
      </RoundedBox>

      {/* Логотип над входом */}
      <Text
        fontSize={0.8}
        position={[-1.5, 5.5, 10.2]}
        color="#ff6b35"
        anchorX="center"
        anchorY="middle"
      >
        KINETIC KIDS
      </Text>

      {/* Стойка администратора */}
      <group position={[8, 0, 6]}>
        {/* Основание стойки */}
        <RoundedBox
          args={[4, 3, 2]}
          position={[0, 1.5, 0]}
          radius={0.2}
        >
          <meshStandardMaterial color="#4f46e5" />
        </RoundedBox>
        
        {/* Столешница */}
        <RoundedBox
          args={[4.5, 0.2, 2.5]}
          position={[0, 3.1, 0]}
          radius={0.1}
        >
          <meshStandardMaterial color="#374151" />
        </RoundedBox>

        {/* Логотип на стойке */}
        <Text
          fontSize={0.3}
          position={[0, 2, 1.1]}
          color="#ffffff"
          anchorX="center"
          anchorY="middle"
        >
          KINETIC KIDS
        </Text>
      </group>

      {/* Зона с горками для роликов/самокатов */}
      <group position={[-8, 0, -3]}>
        {/* Горка 1 */}
        <group position={[0, 0, 0]}>
          <RoundedBox
            args={[6, 0.5, 2]}
            position={[0, 0.25, 0]}
            rotation={[0, 0, 0.2]}
            radius={0.1}
          >
            <meshStandardMaterial color="#10b981" />
          </RoundedBox>
          <RoundedBox
            args={[0.3, 2, 2]}
            position={[-3, 1, 0]}
            radius={0.05}
          >
            <meshStandardMaterial color="#059669" />
          </RoundedBox>
        </group>

        {/* Горка 2 */}
        <group position={[3, 0, 3]}>
          <RoundedBox
            args={[4, 0.5, 1.5]}
            position={[0, 0.25, 0]}
            rotation={[0, 0, -0.15]}
            radius={0.1}
          >
            <meshStandardMaterial color="#3b82f6" />
          </RoundedBox>
          <RoundedBox
            args={[0.3, 1.5, 1.5]}
            position={[2, 0.75, 0]}
            radius={0.05}
          >
            <meshStandardMaterial color="#1d4ed8" />
          </RoundedBox>
        </group>

        {/* Мини-рампа */}
        <group position={[-2, 0, 5]}>
          <Cylinder
            args={[2, 2, 0.5, 16, 1, false, 0, Math.PI]}
            position={[0, 0, 0]}
            rotation={[0, 0, Math.PI / 2]}
          >
            <meshStandardMaterial color="#f59e0b" />
          </Cylinder>
        </group>
      </group>

      {/* Скейт парк зона */}
      <group position={[5, 0, -5]}>
        {/* Большая рампа */}
        <group position={[0, 0, 0]}>
          <Cylinder
            args={[4, 4, 0.8, 16, 1, false, 0, Math.PI]}
            position={[0, 0, 0]}
            rotation={[0, 0, Math.PI / 2]}
          >
            <meshStandardMaterial color="#ef4444" />
          </Cylinder>
        </group>

        {/* Фанбокс */}
        <group position={[6, 0, 3]}>
          <RoundedBox
            args={[3, 1.5, 1]}
            position={[0, 0.75, 0]}
            radius={0.1}
          >
            <meshStandardMaterial color="#8b5cf6" />
          </RoundedBox>
          <RoundedBox
            args={[3.5, 0.3, 1.5]}
            position={[0, 1.65, 0]}
            radius={0.05}
          >
            <meshStandardMaterial color="#7c3aed" />
          </RoundedBox>
        </group>

        {/* Рейл для грайндов */}
        <group position={[3, 0, 6]}>
          <Cylinder
            args={[0.1, 0.1, 4]}
            position={[0, 1, 0]}
            rotation={[0, 0, Math.PI / 2]}
          >
            <meshStandardMaterial color="#6b7280" />
          </Cylinder>
          <RoundedBox
            args={[0.3, 1, 0.3]}
            position={[-2, 0.5, 0]}
            radius={0.05}
          >
            <meshStandardMaterial color="#4b5563" />
          </RoundedBox>
          <RoundedBox
            args={[0.3, 1, 0.3]}
            position={[2, 0.5, 0]}
            radius={0.05}
          >
            <meshStandardMaterial color="#4b5563" />
          </RoundedBox>
        </group>

        {/* Спайн рампа */}
        <group position={[-3, 0, 4]}>
          <RoundedBox
            args={[2, 2.5, 0.5]}
            position={[0, 1.25, 0]}
            rotation={[0, 0, 0.3]}
            radius={0.1}
          >
            <meshStandardMaterial color="#06b6d4" />
          </RoundedBox>
          <RoundedBox
            args={[2, 2.5, 0.5]}
            position={[0, 1.25, 0]}
            rotation={[0, 0, -0.3]}
            radius={0.1}
          >
            <meshStandardMaterial color="#0891b2" />
          </RoundedBox>
        </group>

        {/* Квотерпайп */}
        <group position={[8, 0, -2]}>
          <Cylinder
            args={[2.5, 2.5, 0.6, 16, 1, false, 0, Math.PI / 2]}
            position={[0, 0, 0]}
            rotation={[Math.PI / 2, 0, 0]}
          >
            <meshStandardMaterial color="#ec4899" />
          </Cylinder>
        </group>
      </group>

      {/* Логотипы на стенах */}
      <Text
        fontSize={0.8}
        position={[-8, 5, -9.8]}
        color="#ff6b35"
        anchorX="center"
        anchorY="middle"
      >
        KINETIC KIDS
      </Text>

      <Text
        fontSize={0.8}
        position={[8, 5, -9.8]}
        color="#ff6b35"
        anchorX="center"
        anchorY="middle"
      >
        KINETIC KIDS
      </Text>

      {/* Освещение */}
      <ambientLight intensity={0.5} />
      <pointLight position={[0, 10, 0]} intensity={1} />
      <pointLight position={[-10, 8, -5]} intensity={0.8} />
      <pointLight position={[10, 8, -5]} intensity={0.8} />
      <spotLight
        position={[0, 12, 8]}
        angle={0.3}
        penumbra={1}
        intensity={1}
        castShadow
      />
    </group>
  );
}

export default function Club3DModel() {
  return (
    <div className="w-full h-[600px] bg-gradient-to-b from-sky-100 to-blue-50 rounded-xl overflow-hidden shadow-2xl">
      <Canvas
        camera={{ position: [25, 15, 25], fov: 60 }}
        shadows
      >
        <ClubInterior />
        <OrbitControls
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          minDistance={10}
          maxDistance={50}
          maxPolarAngle={Math.PI / 2}
        />
      </Canvas>
      <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-lg">
        <div className="text-sm font-semibold text-gray-800 mb-1">🎮 Управление:</div>
        <div className="text-xs text-gray-600">
          • Поворот: левая кнопка мыши<br />
          • Масштаб: колесо мыши<br />
          • Перемещение: правая кнопка мыши
        </div>
      </div>
    </div>
  );
}