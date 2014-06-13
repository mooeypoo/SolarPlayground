# SolarPlayground
### A Web-Based, Open-Source, Extendible Platform for Creating Custom Solar System Simulations
#### By Moriel Schottlender

This project is created as a graduate project. It is still being built, and is definitely **not ready for use yet**.

Feel free to make suggestions by [posting them in an issue](https://github.com/mooeypoo/SolarPlayground/issues).

For a quick demo (http://moriel.smarterthanthat.com/apps/SolarPlayground/)[click here].

### Introduction

The movement and behaviour of celestial bodies in our solar system and our universe have always been a source of awe and inspiration, driving human curiosity and fuelling technological progress. The desire to learn about the way our universe behaves led to the development of solar system simulators that allow amateur and professional astronomers to explore these systems from the comfort of their own computers. This also allowed for theoretical experimentation, like simulation of complex celestial systems or testing the route of a theoretical spacecraft.

### The Problem

There is a clear lack in the availability of a freely available system that allows for simulating custom celestial scenarios. The ability to learn by visualizing and being able to interact with a realistic simulation of some celestial system should be available to the public and, perhaps more importantly, to journalists and science outreach advocates who wish to explain new discoveries visually.

The aim of this project is to develop a web-based open source platform for simulating custom-made interactive solar systems scenarios.

### Proposed Solution

SolarPlayground should adhere to the following initial principles:

* Provide a basic framework for creating solar system simulations
* Allow for the design and creation of different user-defined scenarios’ that define the simulation and its behaviour
* Allow for the interaction with the simulation by slowing or speeding its movement in time, changing viewing angles and zoom
* Create the system in a manner that allows future improvements to the simulation properties, scenario creation and interaction aspects

### Technology used:

* Client-side Object Oriented Javascript as the main simulation engine, cross-platform
* Optional ability to add server-side calculation assistance with python
External resources used:
* Libraries
  * [jQuery](http://jquery.com/) Small feature-rich Javascript library handling HTML DOM elements
  * [OOjs](http://www.mediawiki.org/wiki/OOjs) A Javascript library for working with object-oriented design; created and maintained by the Wikimedia Foundation.
  * (Optional) [OOJS-UI](http://www.mediawiki.org/wiki/OOjs_UI) A Javascript library for UI functionality, based on OOJS; created and maintained by the Wikimdia Foundation.
* Development tools
  * [Grunt](http://gruntjs.com/) JavaScript task runner; used for code validation, test, and production of distribution-ready files.
  * [QUnit](http://qunitjs.com/) JavaScript unit testing framework.

### Influence
* Code structure, design patterns and OO-principles influenced heavily from [Wikimedia Foundation VisualEditor](http://www.mediawiki.org/wiki/VisualEditor).
* Calculations are based on NASA JPL planetary position database

### Project Development Timeline:
* Week 1-3:
  * Preparing the development system; defining grunt tasks, test environment, etc.
  * Researching solutions to Kepler’s equation and Lagrangian Mechanics and choosing which of these to use for producing simulation results.
  * Week 4: Creating the basic system of javascript objects necessary for the simulator
  * Define scenario reader (read json files and produce scenario definitions)
  * Define scenario runner (set up an animation controller)
  * Define system controller (set up an object the user can easily embed on a web page and interact with scenarios through an API)
* Week 5: Creating unit tests
  * Unit tests for calculation results
  * Unit tests for scenario reader
* Week 6: Creating a basic UI
  * Stop / Play buttons
  * Display scenario information
* Week 7: Create camera movements
  * Tilt / Yaw
  * Zoom in/out
  * Tentative: Add a series of camera movements to scenario configuration
* Week 8-12+
  * Cleaning up the code and creating final unit tests
  * Documentation
  * Creating and testing more example scenarios

### Evaluating your Solution

The project is designed to produce a starting point to the platform, where it can grow and expand later. The interactive features of a simulation are less important than the production of a solid infrastructure that can be extended and expanded.

At the end of the semester, SolarPlayground should be able to demonstrate:

1. Reading information from an example scenario definition and simulate it
2. Pass all unit tests
3. Provide an initial API for users to embed scenarios in html pages
4. Provide a solid development environment for open source distribution by including grunt files, README, validation, and basic development documentation

### Competitive Analysis

There are several commercially and freely available solar system simulators. However, these lack a couple of basic functionalities that this current project aims to add. Overall, the existing systems are
divided to two main categories:

1. Software for simulating solar system; simplistic versions available online for free
2. Software for simulating custom or complex solar systems; available as commercial and proprietary software that is mostly used by educational institutions

The currently existing systems are either commercially available (and are fairly expensive) or are freely available in the form of simplistic simulations of our solar system without allowing the creation
of custom systems.

SolarPlayground can answer this need and allow astronomers, students and science outreach activists to create simulations and demonstrations of custom solar systems.

