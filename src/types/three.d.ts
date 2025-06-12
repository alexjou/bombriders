import { ReactThreeFiber } from '@react-three/fiber';

// Este arquivo declara tipos para os elementos JSX do Three.js utilizados no projeto

declare global {
  namespace JSX {
    interface IntrinsicElements {
      /**
       * Elemento mesh do Three.js
       */
      mesh: ReactThreeFiber.Object3DNode<THREE.Mesh, typeof THREE.Mesh>;

      /**
       * Elemento planeGeometry do Three.js
       */
      planeGeometry: ReactThreeFiber.BufferGeometryNode<THREE.PlaneGeometry, typeof THREE.PlaneGeometry>;

      /**
       * Elemento boxGeometry do Three.js
       */
      boxGeometry: ReactThreeFiber.BufferGeometryNode<THREE.BoxGeometry, typeof THREE.BoxGeometry>;

      /**
       * Elemento sphereGeometry do Three.js
       */
      sphereGeometry: ReactThreeFiber.BufferGeometryNode<THREE.SphereGeometry, typeof THREE.SphereGeometry>;

      /**
       * Elemento meshStandardMaterial do Three.js
       */
      meshStandardMaterial: ReactThreeFiber.MaterialNode<THREE.MeshStandardMaterial, typeof THREE.MeshStandardMaterial>;

      /**
       * Elemento meshBasicMaterial do Three.js
       */
      meshBasicMaterial: ReactThreeFiber.MaterialNode<THREE.MeshBasicMaterial, typeof THREE.MeshBasicMaterial>;

      /**
       * Elemento ambientLight do Three.js
       */
      ambientLight: ReactThreeFiber.LightNode<THREE.AmbientLight, typeof THREE.AmbientLight>;

      /**
       * Elemento directionalLight do Three.js
       */
      directionalLight: ReactThreeFiber.LightNode<THREE.DirectionalLight, typeof THREE.DirectionalLight>;

      /**
       * Elemento spotLight do Three.js
       */
      spotLight: ReactThreeFiber.LightNode<THREE.SpotLight, typeof THREE.SpotLight>;

      /**
       * Elemento pointLight do Three.js
       */
      pointLight: ReactThreeFiber.LightNode<THREE.PointLight, typeof THREE.PointLight>;

      /**
       * Elemento group do Three.js
       */
      group: ReactThreeFiber.Object3DNode<THREE.Group, typeof THREE.Group>;

      /**
       * Elemento gridHelper do Three.js
       */
      gridHelper: ReactThreeFiber.Object3DNode<THREE.GridHelper, typeof THREE.GridHelper>;

      /**
       * Elemento axesHelper do Three.js
       */
      axesHelper: ReactThreeFiber.Object3DNode<THREE.AxesHelper, typeof THREE.AxesHelper>;
    }
  }
}
