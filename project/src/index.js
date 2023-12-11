console.log(fxhash)
console.log(fxrand())

const sp = new URLSearchParams(window.location.search);
console.log(sp);

// this is how to define parameters
$fx.params([
  {
    id: "valueSound",
    name: "Sonido valor",
    type: "number",
    default: 1,
    options: {
      min: 0,
      max: 10,
      step: 1,
    },
  }
 ]);

// this is how features can be defined
$fx.features({
  "A random feature": Math.floor($fx.rand() * 10),
  "A random boolean": $fx.rand() > 0.5,
  "A random string": ["A", "B", "C", "D"].at(Math.floor($fx.rand()*4)),
  "Feature from params, its a number": $fx.getParam("number_id"),
})

// log the parameters, for debugging purposes, artists won't have to do that
console.log("Current param values:")
// Raw deserialize param values 
console.log($fx.getRawParams())
// Added addtional transformation to the parameter for easier usage
// e.g. color.hex.rgba, color.obj.rgba.r, color.arr.rgb[0] 
console.log($fx.getParams())

// how to read a single raw parameter
console.log("Single raw value:")
console.log($fx.getRawParam("color_id"));
// how to read a single transformed parameter
console.log("Single transformed value:")
console.log($fx.getParam("color_id"));


