// Theme, nav, contact form, and Three.js animated background
(function () {
  // Set year
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Mobile nav
  const toggle = document.getElementById("nav-toggle");
  const nav = document.getElementById("primary-navigation");
  if (toggle && nav) {
    toggle.addEventListener("click", () => {
      const open = nav.classList.toggle("open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
  }

  // Theme toggle
  const themeToggle = document.getElementById("theme-toggle");
  const preferDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const saved = localStorage.getItem("theme");
  if (saved)
    document.documentElement.classList.toggle("light", saved === "light");
  else document.documentElement.classList.toggle("light", !preferDark);
  function setTheme(isLight) {
    document.documentElement.classList.toggle("light", isLight);
    localStorage.setItem("theme", isLight ? "light" : "dark");
    if (themeToggle)
      themeToggle.innerHTML = isLight
        ? '<i class="fa-solid fa-sun"></i>'
        : '<i class="fa-solid fa-moon"></i>';
  }
  if (themeToggle) {
    themeToggle.addEventListener("click", () =>
      setTheme(!document.documentElement.classList.contains("light"))
    );
    // initialize icon
    setTheme(document.documentElement.classList.contains("light"));
  }

  // Smooth scrolling
  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener("click", (e) => {
      const href = a.getAttribute("href");
      if (!href || href === "#") return;
      const target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });

  // contact form removed

  // Reveal on scroll
  const revealEls = Array.from(
    document.querySelectorAll(".section .container, .card, .skill-group")
  );
  const ro = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) entry.target.classList.add("in-view");
      });
    },
    { threshold: 0.15 }
  );
  revealEls.forEach((el) => ro.observe(el));

  // Nav active + indicator
  const navEl = document.getElementById("primary-navigation");
  const indicator = navEl ? navEl.querySelector(".nav-indicator") : null;
  const links = Array.from(document.querySelectorAll('.main-nav a[href^="#"]'));
  const sections = links
    .map((a) => document.querySelector(a.getAttribute("href")))
    .filter(Boolean);
  function setActiveLink() {
    const y = window.scrollY + window.innerHeight * 0.35;
    let activeIndex = 0;
    sections.forEach((sec, i) => {
      const top = sec.offsetTop;
      if (y >= top) activeIndex = i;
    });
    links.forEach((a, i) => a.classList.toggle("active", i === activeIndex));
    if (indicator && navEl) {
      const active = links[activeIndex];
      const rect = active.getBoundingClientRect();
      const parentRect = navEl.getBoundingClientRect();
      indicator.style.width = rect.width + "px";
      indicator.style.left = rect.left - parentRect.left + "px";
    }
  }
  setActiveLink();
  window.addEventListener("scroll", setActiveLink, { passive: true });
  window.addEventListener("resize", setActiveLink);

  // Header progress bar (keep header always visible)
  const header = document.querySelector(".site-header");
  const progress = document.querySelector(".scroll-progress");
  let lastY = window.scrollY;
  function onScroll() {
    const y = window.scrollY;
    if (header) header.style.transform = "translateY(0)";
    lastY = y;
    const h = document.documentElement;
    const max = h.scrollHeight - h.clientHeight;
    const ratio = max > 0 ? y / max : 0;
    if (progress) progress.style.transform = `scaleX(${ratio})`;
  }
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  // Button hover spotlight
  document.querySelectorAll(".btn").forEach((btn) => {
    btn.addEventListener("mousemove", (e) => {
      const r = btn.getBoundingClientRect();
      btn.style.setProperty(
        "--mx",
        ((e.clientX - r.left) / r.width) * 100 + "%"
      );
      btn.style.setProperty(
        "--my",
        ((e.clientY - r.top) / r.height) * 100 + "%"
      );
    });
  });

  // 3D tilt for cards
  document.querySelectorAll(".card").forEach((card) => {
    card.addEventListener("mousemove", (e) => {
      const r = card.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width;
      const y = (e.clientY - r.top) / r.height;
      const rx = (y - 0.5) * -8;
      const ry = (x - 0.5) * 12;
      card.style.transform = `perspective(800px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-4px)`;
    });
    card.addEventListener("mouseleave", () => {
      card.style.transform = "";
    });
  });
})();

// Three.js animated background (galaxy + parallax)
(function () {
  const canvasContainer = document.createElement("div");
  canvasContainer.id = "three-bg";
  canvasContainer.style.position = "fixed";
  canvasContainer.style.inset = "0";
  canvasContainer.style.zIndex = "0";
  canvasContainer.style.pointerEvents = "none";
  document.body.prepend(canvasContainer);

  // Load THREE from CDN dynamically
  const script = document.createElement("script");
  script.src = "https://unpkg.com/three@0.161.0/build/three.min.js";
  script.onload = init;
  document.head.appendChild(script);

  function init() {
    if (!window.THREE) return;
    const {
      Scene,
      PerspectiveCamera,
      WebGLRenderer,
      BufferGeometry,
      BufferAttribute,
      PointsMaterial,
      Points,
      Group,
      IcosahedronGeometry,
      MeshBasicMaterial,
      Mesh,
      PlaneGeometry,
      MathUtils,
      LineBasicMaterial,
      LineSegments,
    } = THREE;

    const scene = new Scene();
    const camera = new PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.z = 60;

    const renderer = new WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0);
    canvasContainer.appendChild(renderer.domElement);

    // Galaxy particles
    const particleCount = window.innerWidth < 600 ? 1700 : 4200;
    const positions = new Float32Array(particleCount * 3);
    const range = 160;
    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      const r = Math.random() * range;
      const angle = Math.random() * Math.PI * 2;
      positions[i3] = Math.cos(angle) * r;
      positions[i3 + 1] = (Math.random() - 0.5) * range * 0.4;
      positions[i3 + 2] = Math.sin(angle) * r;
    }
    const geometry = new BufferGeometry();
    geometry.setAttribute("position", new BufferAttribute(positions, 3));
    const material = new PointsMaterial({
      color: 0xffffff,
      size: 0.08,
      sizeAttenuation: true,
      transparent: true,
      opacity: 0.85,
      depthWrite: false,
    });
    const starField = new Points(geometry, material);

    const group = new Group();
    group.add(starField);
    scene.add(group);

    // Wireframe centerpiece
    const icoGeo = new IcosahedronGeometry(18, 0);
    const wireMat = new MeshBasicMaterial({
      color: 0x7c3aed,
      wireframe: true,
      transparent: true,
      opacity: 0.22,
    });
    const wireMesh = new Mesh(icoGeo, wireMat);
    wireMesh.position.z = -20;
    scene.add(wireMesh);

    // Soft glow planes
    const addGlow = (hex, opacity, pos) => {
      const glowGeo = new PlaneGeometry(200, 200);
      const glowMat = new MeshBasicMaterial({
        color: hex,
        transparent: true,
        opacity,
      });
      const mesh = new Mesh(glowGeo, glowMat);
      mesh.position.set(pos.x, pos.y, pos.z);
      scene.add(mesh);
    };
    addGlow(0x22d3ee, 0.06, { x: -60, y: 40, z: -80 });
    addGlow(0x7c3aed, 0.06, { x: 70, y: -20, z: -90 });
    addGlow(0xf59e0b, 0.04, { x: 0, y: -50, z: -70 });

    // Constellation lines
    const lineMaterial = new LineBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.12,
    });
    const lineGeometry = new BufferGeometry();
    const maxLines = 8000;
    const linePositions = new Float32Array(maxLines * 6);
    lineGeometry.setAttribute(
      "position",
      new BufferAttribute(linePositions, 3)
    );
    const linesMesh = new LineSegments(lineGeometry, lineMaterial);
    linesMesh.frustumCulled = false;
    scene.add(linesMesh);

    // Interactions
    let targetX = 0,
      targetY = 0,
      scrollY = 0;
    window.addEventListener("mousemove", (e) => {
      const nx = (e.clientX / window.innerWidth) * 2 - 1;
      const ny = (e.clientY / window.innerHeight) * 2 - 1;
      targetX = nx;
      targetY = ny;
    });
    window.addEventListener(
      "scroll",
      () => {
        scrollY = window.scrollY || window.pageYOffset;
      },
      { passive: true }
    );

    window.addEventListener("resize", () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    });

    const prefersReduced =
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const clock = new THREE.Clock();
    function animate() {
      const delta = clock.getDelta();
      if (!prefersReduced) {
        group.rotation.y += (targetX * 0.2 - group.rotation.y) * 0.05;
        group.rotation.x += (targetY * -0.1 - group.rotation.x) * 0.05;
        starField.rotation.y += delta * 0.02;
        wireMesh.rotation.x += 0.12 * delta;
        wireMesh.rotation.y += 0.18 * delta;
        const parallax = Math.min(scrollY / 2000, 1);
        group.position.z = MathUtils.lerp(0, -20, parallax);
        camera.position.y = MathUtils.lerp(0, -8, parallax);
      }

      // Update constellation lines (sampled)
      const pts = geometry.getAttribute("position").array;
      const threshold = 10;
      let ptr = 0;
      const step = Math.max(1, Math.floor(particleCount / 360));
      for (let i = 0; i < particleCount; i += step) {
        const ix = pts[i * 3],
          iy = pts[i * 3 + 1],
          iz = pts[i * 3 + 2];
        for (let j = i + step; j < particleCount; j += step * 2) {
          const jx = pts[j * 3],
            jy = pts[j * 3 + 1],
            jz = pts[j * 3 + 2];
          const dx = ix - jx,
            dy = iy - jy,
            dz = iz - jz;
          const d2 = dx * dx + dy * dy + dz * dz;
          if (d2 < threshold * threshold) {
            if (ptr + 6 >= linePositions.length) break;
            linePositions[ptr++] = ix;
            linePositions[ptr++] = iy;
            linePositions[ptr++] = iz;
            linePositions[ptr++] = jx;
            linePositions[ptr++] = jy;
            linePositions[ptr++] = jz;
          }
        }
        if (ptr + 6 >= linePositions.length) break;
      }
      for (let k = ptr; k < linePositions.length; k++) linePositions[k] = 0;
      lineGeometry.attributes.position.needsUpdate = true;

      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    }
    animate();
  }
})();
