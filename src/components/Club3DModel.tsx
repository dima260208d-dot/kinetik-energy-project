import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';

function SimpleClub() {
  return (
    <group>
      {/* Пол */}
      <mesh position={[0, -0.1, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[20, 16]} />
        <meshStandardMaterial color="#e5e7eb" />
      </mesh>

      {/* Стены */}
      {/* Задняя стена */}
      <mesh position={[0, 4, -8]}>
        <boxGeometry args={[20, 8, 0.3]} />
        <meshStandardMaterial color="#f3f4f6" />
      </mesh>

      {/* Левая стена */}
      <mesh position={[-10, 4, 0]}>
        <boxGeometry args={[0.3, 8, 16]} />
        <meshStandardMaterial color="#f3f4f6" />
      </mesh>

      {/* Правая стена */}
      <mesh position={[10, 4, 0]}>
        <boxGeometry args={[0.3, 8, 16]} />
        <meshStandardMaterial color="#f3f4f6" />
      </mesh>

      {/* Передняя стена с входом */}
      <mesh position={[-6, 4, 8]}>
        <boxGeometry args={[8, 8, 0.3]} />
        <meshStandardMaterial color="#f3f4f6" />
      </mesh>
      <mesh position={[6, 4, 8]}>
        <boxGeometry args={[8, 8, 0.3]} />
        <meshStandardMaterial color="#f3f4f6" />
      </mesh>

      {/* Стойка администратора */}
      <mesh position={[7, 1.5, 5]}>
        <boxGeometry args={[3, 3, 2]} />
        <meshStandardMaterial color="#4f46e5" />
      </mesh>

      {/* Столешница */}
      <mesh position={[7, 3.2, 5]}>
        <boxGeometry args={[3.5, 0.2, 2.5]} />
        <meshStandardMaterial color="#374151" />
      </mesh>

      {/* Горки в зоне роликов */}
      {/* Горка 1 */}
      <mesh position={[-6, 1, -3]} rotation={[0, 0, 0.3]}>
        <boxGeometry args={[5, 0.5, 2]} />
        <meshStandardMaterial color="#10b981" />
      </mesh>
      
      {/* Опора горки 1 */}
      <mesh position={[-8.5, 1, -3]}>
        <boxGeometry args={[0.3, 2, 2]} />
        <meshStandardMaterial color="#059669" />
      </mesh>

      {/* Горка 2 */}
      <mesh position={[-3, 0.8, 0]} rotation={[0, 0, -0.2]}>
        <boxGeometry args={[4, 0.5, 1.5]} />
        <meshStandardMaterial color="#3b82f6" />
      </mesh>

      {/* Мини-рампа */}
      <mesh position={[-7, 1, 2]}>
        <cylinderGeometry args={[1.5, 1.5, 0.5, 16, 1, false, 0, Math.PI]} />
        <meshStandardMaterial color="#f59e0b" />
      </mesh>

      {/* Скейт-парк зона */}
      {/* Большая рампа */}
      <mesh position={[4, 2, -4]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[3, 3, 0.8, 16, 1, false, 0, Math.PI]} />
        <meshStandardMaterial color="#ef4444" />
      </mesh>

      {/* Фанбокс */}
      <mesh position={[6, 1, 0]}>
        <boxGeometry args={[2.5, 1.5, 1]} />
        <meshStandardMaterial color="#8b5cf6" />
      </mesh>

      {/* Верх фанбокса */}
      <mesh position={[6, 1.85, 0]}>
        <boxGeometry args={[3, 0.2, 1.5]} />
        <meshStandardMaterial color="#7c3aed" />
      </mesh>

      {/* Рейл */}
      <mesh position={[2, 1, 3]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.05, 0.05, 3]} />
        <meshStandardMaterial color="#6b7280" />
      </mesh>

      {/* Опоры рейла */}
      <mesh position={[0.5, 0.5, 3]}>
        <boxGeometry args={[0.2, 1, 0.2]} />
        <meshStandardMaterial color="#4b5563" />
      </mesh>
      <mesh position={[3.5, 0.5, 3]}>
        <boxGeometry args={[0.2, 1, 0.2]} />
        <meshStandardMaterial color="#4b5563" />
      </mesh>

      {/* Квотерпайп */}
      <mesh position={[8, 1.5, -2]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[2, 2, 0.6, 16, 1, false, 0, Math.PI / 2]} />
        <meshStandardMaterial color="#ec4899" />
      </mesh>

      {/* Освещение */}
      <ambientLight intensity={0.4} />
      <directionalLight position={[10, 10, 5]} intensity={1} />
      <pointLight position={[0, 8, 0]} intensity={0.8} />
    </group>
  );
}

export default function Club3DModel() {
  return (
    <div className="w-full h-[600px] bg-gradient-to-b from-sky-100 to-blue-50 rounded-xl overflow-hidden shadow-2xl relative">
      <Canvas
        camera={{ position: [15, 10, 15], fov: 60 }}
      >
        <SimpleClub />
        <OrbitControls
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          minDistance={8}
          maxDistance={30}
          maxPolarAngle={Math.PI / 2.2}
        />
      </Canvas>
      <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-lg text-sm">
        <div className="font-semibold text-gray-800 mb-1">🎮 Управление:</div>
        <div className="text-xs text-gray-600">
          • Поворот: левая кнопка мыши<br />
          • Масштаб: колесо мыши<br />
          • Перемещение: правая кнопка мыши
        </div>
      </div>
      
      <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-lg text-sm">
        <div className="font-semibold text-gray-800 mb-1">🏢 Зоны клуба:</div>
        <div className="text-xs text-gray-600">
          • 🎯 Вход и стойка админа<br />
          • 🛼 Зона роликов и горок<br />
          • 🛹 Скейт-парк с рампами
        </div>
      </div>
    </div>
  );
}