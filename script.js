window.onload = function () {
  const codeBackground = document.querySelector(".code-background");
  const codeSnippets = [
    "function init() {",
    "const data = [];",
    "if (isValid) {",
    "return true;",
    "class Component {",
    'import React from "react";',
    "def process():",
    "public static void main()",
    "<!-- HTML -->",
    "{ margin: 0; }",
    "npm install",
    'git commit -m "feat:"',
    "SELECT * FROM users",
    "python manage.py runserver",
    "java -jar app.jar",
    "docker-compose up",
    "kubectl apply -f",
    "async function() {",
    "try { await db.connect()",
    "export default class",
  ];

  // Create more code lines for a denser effect
  const numberOfLines = window.innerWidth <= 480 ? 30 : 100;

  for (let i = 0; i < numberOfLines; i++) {
    const line = document.createElement("div");
    line.className = "code-line";
    line.textContent =
      codeSnippets[Math.floor(Math.random() * codeSnippets.length)];
    line.style.left = `${Math.random() * 100}%`;
    line.style.animationDuration = `${Math.random() * 10 + 5}s`;
    line.style.opacity = Math.random() * 0.5 + 0.1;
    codeBackground.appendChild(line);
  }

  // Add geometric shapes
  const geoShapes = document.querySelector(".geometric-shapes");
  const numberOfShapes = window.innerWidth <= 480 ? 3 : 5;

  for (let i = 0; i < numberOfShapes; i++) {
    const shape = document.createElement("div");
    shape.className = "geo-shape";
    shape.style.width = `${Math.random() * 300 + 100}px`;
    shape.style.height = shape.style.width;
    shape.style.left = `${Math.random() * 100}%`;
    shape.style.top = `${Math.random() * 100}%`;
    shape.style.animationDuration = `${Math.random() * 10 + 10}s`;
    geoShapes.appendChild(shape);
  }
};

function showSection(sectionId) {
  const section = document.getElementById(sectionId);
  section.classList.add("active");
}

function hideSection(sectionId) {
  const section = document.getElementById(sectionId);
  section.classList.remove("active");
}
