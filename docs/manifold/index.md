---
layout: false
title: MANIFOLD — Procedural Mathematical Surfaces
description: An immersive WebGL procedural geometry and topology study by MatNoble. Exploring Möbius strips, Klein bottles, Enneper minimal surfaces, and strange attractors.
head:
  - - meta
    - name: keywords
      content: Three.js, WebGL, Manifold, Topology, Differential Geometry, Procedural Surfaces, MatNoble, Creative Coding
  - - script
    - type: application/ld+json
    - |
      {
        "@context": "https://schema.org",
        "@type": "WebApplication",
        "name": "MANIFOLD — Procedural Mathematical Surfaces",
        "url": "https://matnoble.top/manifold/",
        "author": {
          "@type": "Person",
          "name": "MatNoble",
          "url": "https://matnoble.top/about"
        },
        "applicationCategory": "MultimediaApplication",
        "operatingSystem": "All",
        "browserRequirements": "Requires WebGL 2.0 and JavaScript",
        "description": "An immersive WebGL procedural geometry, mathematical art, and creative coding study by MatNoble."
      }
---

<script setup>
import { defineAsyncComponent } from 'vue';
const Math3DLab = defineAsyncComponent(() => import('./components/Math3DLab.vue'));
</script>

<ClientOnly>
  <Math3DLab />
</ClientOnly>
