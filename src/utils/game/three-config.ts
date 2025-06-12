import { extend } from '@react-three/fiber';
import * as THREE from 'three';

// Registra os componentes de material
const MaterialsToRegister = {
  MeshStandardMaterial: THREE.MeshStandardMaterial,
  MeshBasicMaterial: THREE.MeshBasicMaterial,
};

// Registra os componentes de geometria
const GeometriesToRegister = {
  PlaneGeometry: THREE.PlaneGeometry,
  BoxGeometry: THREE.BoxGeometry,
  SphereGeometry: THREE.SphereGeometry,
};

// Registra os componentes de luz
const LightsToRegister = {
  AmbientLight: THREE.AmbientLight,
  DirectionalLight: THREE.DirectionalLight,
  PointLight: THREE.PointLight,
};

// Registra os componentes de helper
const HelpersToRegister = {
  GridHelper: THREE.GridHelper,
  AxesHelper: THREE.AxesHelper,
};

// Registra outros objetos 3D
const OtherObjectsToRegister = {
  Group: THREE.Group,
  Mesh: THREE.Mesh,
};

// Exporta uma função para registrar todos os componentes Three.js necessários
export function registerThreeComponents() {
  // Registra todos os objetos definidos acima
  extend({
    ...MaterialsToRegister,
    ...GeometriesToRegister,
    ...LightsToRegister,
    ...HelpersToRegister,
    ...OtherObjectsToRegister
  });
}
