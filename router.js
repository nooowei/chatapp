const express = require("express");
const router = express.Router();
const path = require('path');

// //serve static asset if in production
// if(process.env.NODE_ENV === 'production'){
//   console.log("Production environment. Serving static asset from client/build.");
//   // Set static folder
//   app.use(express.static('client/build'));
//
//   // server will serve up index.html in the build folder if in production
//   app.get('*', (req, res) => {
//     res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
//   })
// }
//
// router.get("/", (req, res) => {
//   res.send({ response: "Server is up and running." }).status(200);
// });



router.get("/", (req, res) => {
  res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
});



module.exports = router;
