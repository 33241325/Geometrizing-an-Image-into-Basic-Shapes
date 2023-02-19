# Geometrizing-an-Image-into-Basic-Shapes
This is a program where you can import an image and then process it to simplify it into basic shapes.

There are a lot of rough edges that can still be worked on and polished
Some issues include:
  1. The black box around the canvas wouldn't show if the image is wider than it
  2. There is currently no possible way to resize the window without removing the image on the canvas
  3. In order for the shape density slider to properly update, the previous image must be cleared first beforehand
  4. The CSS is not very great so it might not work properly in some window sizes
  5. The are some artifacts if the image uploaded has some transparency or has some dark areas, blur will solve this to an extent
  6. This should technically work with any shape drawn on the canvas, but this has not been thouroughly tested
  7. The program is not very optimized, so 100 shapes per row is all it can do without severely lagging
  8. There is a lack of option to control density in the x and y axis seperately
  9. There was issues where images would be larger than the div they are contained it, it's somewhat fixed but there might be some visual bugs
  10. And then some

Now, unto the features

The upload image button lets you update an image and place it in the black box on the left.
The excecute button (Don't ask) is the bread and butter of the program, it reads the rbg values of the pixels in the image, converts it into a matrix,
and then spits it out as a bunch of colors. It is also affected by the sliders at the buttom of the screen.
The clear button will clear the canvas and also reset the matrix so it is an empty array. This is a band-aid solution to solve the issue of the program not working.
The sliders affects the shapes shown on the right. Blur radius affects the kernel size of the gaussian blur, and sigma affects the standard deviation of the blur.
tl;dr: bigger number = more blur.
Shape density affects how many shapes are displayed per row and column of pixels. As mentioned before, you need to clear the previous image for this to update.
Finally, the shape size affects how big the shapes are on the canvas.

Aside from fixing the issues above, there are some things which I wish to improve.
I would prefer if the gaussian blur would apply before I affect the sampling with the shape density, to prevent artifacts while still minimizing blur,
but it really slows the the program. Will need to optimize more on that.
Making it more visually appealing would also be nice, right now it's just blocks of greys and blacks with a dash of bright orange.
More optimization would be nice as well as the ability to read and write data.
Storing the pixels matrix is possible currently, albeit it's a bit scuffed.
The matrix should show up in the console whenever an image is processed, but there's nowhere to currently input that data back into the system.
The code is also an obfuscated mess, will need to clean it up.
There's also a lot of redundancy I haven't cleaned from when I was testing it.

Aside from that, use this however you want to.

XOXO
