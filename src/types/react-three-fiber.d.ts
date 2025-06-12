import { ReactThreeFiber } from '@react-three/fiber';

declare global {
  namespace JSX {
    interface IntrinsicElements {
      mesh: ReactThreeFiber.Object3DNode<THREE.Mesh, typeof THREE.Mesh>;
      planeGeometry: ReactThreeFiber.BufferGeometryNode<THREE.PlaneGeometry, typeof THREE.PlaneGeometry>;
      boxGeometry: ReactThreeFiber.BufferGeometryNode<THREE.BoxGeometry, typeof THREE.BoxGeometry>;
      sphereGeometry: ReactThreeFiber.BufferGeometryNode<THREE.SphereGeometry, typeof THREE.SphereGeometry>;
      meshStandardMaterial: ReactThreeFiber.MaterialNode<THREE.MeshStandardMaterial, typeof THREE.MeshStandardMaterial>;
      meshBasicMaterial: ReactThreeFiber.MaterialNode<THREE.MeshBasicMaterial, typeof THREE.MeshBasicMaterial>;
      ambientLight: ReactThreeFiber.LightNode<THREE.AmbientLight, typeof THREE.AmbientLight>;
      directionalLight: ReactThreeFiber.LightNode<THREE.DirectionalLight, typeof THREE.DirectionalLight>;
      pointLight: ReactThreeFiber.LightNode<THREE.PointLight, typeof THREE.PointLight>;
      group: ReactThreeFiber.Object3DNode<THREE.Group, typeof THREE.Group>;
      gridHelper: ReactThreeFiber.Object3DNode<THREE.GridHelper, typeof THREE.GridHelper>;
      // Adicione aliases com a primeira letra maiúscula para compatibilidade
      ambientLight: ReactThreeFiber.LightNode<THREE.AmbientLight, typeof THREE.AmbientLight>;
      directionalLight: ReactThreeFiber.LightNode<THREE.DirectionalLight, typeof THREE.DirectionalLight>;
      meshStandardMaterial: ReactThreeFiber.MaterialNode<THREE.MeshStandardMaterial, typeof THREE.MeshStandardMaterial>;
    }
  }
}
