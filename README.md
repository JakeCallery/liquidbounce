# liquidbounce
Basic rigid body sim demo with leapmotion controls
![image](https://github.com/JakeCallery/liquidbounce/assets/1918511/b5a39d2c-88bd-486d-9a22-5ee31ca9ab0a)
![image](https://github.com/JakeCallery/liquidbounce/assets/1918511/4f76699c-4756-469a-9e3b-32b2b725e4b9)

# Premise:
Wanted to play around with the canvas object, and build up my math libraries a bit
more. There was a big focus on page performance and improving my vector math
library. I also wanted to play around with the leapmotion controller.
The end result of this will be a multiple player version where it drives a physical device
(art installation) where multiple people can stand around a large box with neoprene
stretched over top an ball bearings sitting on top. A person would move their finger "in"
and servos will pull the neoprene down causing a "gravity well" where the bearings will
roll towards. Various pieces of the hardware and software are working, but its not all
put together yet.

# Tech Features:
- Custom object pool library to keep the garbage collector at bay
- Custom Vector Math library
- Focus on page performance and canvas speed
- Custom basic 2D rigidbody solver
