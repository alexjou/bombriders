// Arquivo ambiente global para componentes @react-three/fiber e @react-three/drei
// Isso resolve o problema de TypeScript não conseguir inferir JSX.IntrinsicElements

import { Object3DNode, BufferGeometryNode, MaterialNode } from '@react-three/fiber';
import {
  Mesh, MeshStandardMaterial, MeshBasicMaterial,
  AmbientLight, DirectionalLight, PointLight,
  Group, BoxGeometry, PlaneGeometry
} from 'three';

declare global {
  namespace JSX {
    interface IntrinsicElements {
      // Nodes do Three.js
      ambientLight: Object3DNode<AmbientLight, typeof AmbientLight>;
      directionalLight: Object3DNode<DirectionalLight, typeof DirectionalLight>;
      pointLight: Object3DNode<PointLight, typeof PointLight>;
      group: Object3DNode<Group, typeof Group>;
      mesh: Object3DNode<Mesh, typeof Mesh>;

      // Buffer Geometries
      boxGeometry: BufferGeometryNode<BoxGeometry, typeof BoxGeometry>;
      planeGeometry: BufferGeometryNode<PlaneGeometry, typeof PlaneGeometry>;

      // Materials
      meshStandardMaterial: MaterialNode<MeshStandardMaterial, typeof MeshStandardMaterial>;
      meshBasicMaterial: MaterialNode<MeshBasicMaterial, typeof MeshBasicMaterial>;

      // Drei components
      plane: any;
      orthographicCamera: any;
      orbitControls: any;
      gridHelper: any;
    }
  }
}

// Isso permite que importemos esse arquivo como um módulo
export { };
