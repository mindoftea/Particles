Particles
=========

A two-dimensional collision engine for use inside DemoFrame.

Each particle is a perfect non-rotating circle. When two particles come in contact, they are repelled by a force proportional to their overlap distance, with drag.

You can see this demo live here: http://mindoftea.jit.su/demos/p. Click to apply a force upward from the red line.

## How it works:

Like Waves, Particles is an iterative DE solver at heart. At each "step" of the simulation, the forces on each particle are calculated based on its current velocity and position. Then, these forces are added into a single net-force and divided by the particle's mass to find an acceleration. Then, this acceleration is multiplied by the amount of time between steps (`dt`) and added to the point's velocity. (In other words, velocity is the integral of acceleration `dt`.) Then, this new velocity is multiplied by `dt` and added to the point's position. As the cycle repeats, it creates a complex feedback loop; force causes change in velocity, velocity causes change in position, and position and velocity cause changes in force. By finding the right set of forces, we can make the particles interact in almost any way we want.

### The Forces:

 - Gravity:
	 - A very simple force, gravity just pulls each particle downward with a magnitude proportional to the object's mass. They accelerate as they fall.
 	 - There is no air resistance.
 - Walls:
 	 - In order to keep the particles in proximity to one another, walls deflect all particles that move toward the edge of the collision area.
 	 - These walls apply a restoring force to particles that collide with them proportional to the displacement of the particle into the wall. Particles then "bounce" off of the walls, and back into the collision area.
 	 - The walls have no drag.
 - Collisions:
 	 - The core of the simulation. When two particles come in contact, they are repelled by a force proportional to their overlap distance, just like hookean springs. This ensures that they deflect off of each other.
 	 - The hookean force prevents objects which barely touch from being thrown apart by a strong force while also preventing objects which collide head on from smashing through each other, resisted only by a weak force.
 	 - The collsions have viscous harmonic damping, a slowing force proportional to the relative speed of the objects in the direction of their collision.

### Relativity:

Because the simulation is based on discrete steps, the particles effectively "jump" between positions. As the number of steps in a given frame increases, the difference in time (`dt`) between steps decreases, making the "jumps" smaller and the simulation more accurate. Unfortunately, very fast objects tend to cover large distances even in a small time. This is fine in empty space, but creates problems in collisions. When very fast-moving particles collide, they tend to "jump" into each other, overlapping across most of their area. Suddenly, these particles are compressed into each other with enormous potential energy, without having lost any kinetic energy in their collision, meaning that they have more enrgy now than when they began. When this effect becomes greater than the collision damping force, it creates a positive feedback loop of error, and the particles accelerate exponentially.

Even when this effect is subtle enough to avoid total chaos, it causes unrealistic jittering and prevents the particles from settling at the bottom of the screen. The first solution is to increase the number of steps per frame, but this has a performance toll; this simulation uses a relativistically-inspired error prevention mechanism to augment its numerical accuracy.

In special relativity, objects travelling at near the speed of light experience an increase in their effective mass, slowing their acceleration and preventing them from ever reaching the speed of light while still conserving their momentum. This simulation does a similar thing, but with a much lower "speed of light". That way, even very excited objects travel at reasonable speeds, but keep their high momentum by effectively becoming heavier.
