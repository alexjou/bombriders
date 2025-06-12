// Extensão de tipos para @react-three/fiber com suporte para componentes com primeira letra maiúscula
import { ReactThreeFiber } from '@react-three/fiber';
import * as THREE from 'three';

declare global {
  namespace JSX {
    interface IntrinsicElements {
      // Definições específicas necessárias para o GameBoard.tsx
      ambientLight: ReactThreeFiber.LightNode<THREE.AmbientLight, typeof THREE.AmbientLight>;
      directionalLight: ReactThreeFiber.LightNode<THREE.DirectionalLight, typeof THREE.DirectionalLight>;
      meshStandardMaterial: ReactThreeFiber.MaterialNode<THREE.MeshStandardMaterial, typeof THREE.MeshStandardMaterial>;

      // Aliases com letra maiúscula
      AmbientLight: ReactThreeFiber.LightNode<THREE.AmbientLight, typeof THREE.AmbientLight>;
      DirectionalLight: ReactThreeFiber.LightNode<THREE.DirectionalLight, typeof THREE.DirectionalLight>;
      MeshStandardMaterial: ReactThreeFiber.MaterialNode<THREE.MeshStandardMaterial, typeof THREE.MeshStandardMaterial>;

      // Outros componentes possivelmente necessários
      Plane: any;
      OrthographicCamera: any;
      OrbitControls: any;
    }
  }
}
