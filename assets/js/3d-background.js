// 3D Background with Rotating Computer
class ThreeDBackground {
  constructor() {
    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.computer = null;
    this.animationId = null;
    
    this.init();
  }

  init() {
    // Create scene
    this.scene = new THREE.Scene();
    
    // Create camera
    this.camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    this.camera.position.z = 5;
    
    // Create renderer
    this.renderer = new THREE.WebGLRenderer({ 
      alpha: true,
      antialias: true 
    });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setClearColor(0x000000, 0.1);
    
    // Add to DOM
    const container = document.getElementById('3d-background');
    if (container) {
      container.appendChild(this.renderer.domElement);
    }
    
    // Create computer model
    this.createComputer();
    
    // Add lighting
    this.addLighting();
    
    // Start animation
    this.animate();
    
    // Handle window resize
    window.addEventListener('resize', () => this.onWindowResize());
  }

  createComputer() {
    // Create a group for the computer
    this.computer = new THREE.Group();
    
    // Monitor (screen)
    const monitorGeometry = new THREE.BoxGeometry(2, 1.2, 0.1);
    const monitorMaterial = new THREE.MeshPhongMaterial({ 
      color: 0x2c3e50,
      transparent: true,
      opacity: 0.9
    });
    const monitor = new THREE.Mesh(monitorGeometry, monitorMaterial);
    monitor.position.y = 0.5;
    
    // Screen (display)
    const screenGeometry = new THREE.PlaneGeometry(1.8, 1);
    const screenMaterial = new THREE.MeshPhongMaterial({ 
      color: 0x3498db,
      emissive: 0x2980b9,
      emissiveIntensity: 0.3
    });
    const screen = new THREE.Mesh(screenGeometry, screenMaterial);
    screen.position.z = 0.06;
    monitor.add(screen);
    
    // Monitor stand
    const standGeometry = new THREE.CylinderGeometry(0.05, 0.05, 0.8);
    const standMaterial = new THREE.MeshPhongMaterial({ color: 0x34495e });
    const stand = new THREE.Mesh(standGeometry, standMaterial);
    stand.position.y = -0.9;
    
    // Base
    const baseGeometry = new THREE.BoxGeometry(0.8, 0.1, 0.6);
    const baseMaterial = new THREE.MeshPhongMaterial({ color: 0x34495e });
    const base = new THREE.Mesh(baseGeometry, baseMaterial);
    base.position.y = -1.3;
    
    // Keyboard
    const keyboardGeometry = new THREE.BoxGeometry(1.8, 0.05, 0.6);
    const keyboardMaterial = new THREE.MeshPhongMaterial({ color: 0x2c3e50 });
    const keyboard = new THREE.Mesh(keyboardGeometry, keyboardMaterial);
    keyboard.position.set(0, -1.8, 0.5);
    
    // Mouse
    const mouseGeometry = new THREE.SphereGeometry(0.15, 16, 16);
    const mouseMaterial = new THREE.MeshPhongMaterial({ color: 0x34495e });
    const mouse = new THREE.Mesh(mouseGeometry, mouseMaterial);
    mouse.position.set(1.2, -1.8, 0.5);
    mouse.scale.set(1, 0.5, 1.5);
    
    // Add all parts to computer group
    this.computer.add(monitor);
    this.computer.add(stand);
    this.computer.add(base);
    this.computer.add(keyboard);
    this.computer.add(mouse);
    
    // Position the entire computer
    this.computer.position.set(0, 0, -2);
    
    // Add to scene
    this.scene.add(this.computer);
  }

  addLighting() {
    // Ambient light
    const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
    this.scene.add(ambientLight);
    
    // Directional light
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 5, 5);
    this.scene.add(directionalLight);
    
    // Point light for glow effect
    const pointLight = new THREE.PointLight(0x3498db, 0.5, 10);
    pointLight.position.set(0, 0, 2);
    this.scene.add(pointLight);
  }

  animate() {
    this.animationId = requestAnimationFrame(() => this.animate());
    
    // Rotate the computer
    if (this.computer) {
      this.computer.rotation.y += 0.01;
      this.computer.rotation.x = Math.sin(Date.now() * 0.001) * 0.1;
    }
    
    this.renderer.render(this.scene, this.camera);
  }

  onWindowResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  destroy() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
    if (this.renderer) {
      this.renderer.dispose();
    }
  }
}

// Initialize 3D background when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  // Load Three.js from CDN if not already loaded
  if (typeof THREE === 'undefined') {
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js';
    script.onload = () => {
      new ThreeDBackground();
    };
    document.head.appendChild(script);
  } else {
    new ThreeDBackground();
  }
});
