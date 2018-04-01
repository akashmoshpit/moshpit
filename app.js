const express = require('express');

const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const passport = require('passport');
const mongoose = require('mongoose');
const config = require('./config/database');

//connecting to Database mongoose
mongoose.connect(config.database);

mongoose.connection.on("connected", () =>{
	console.log("connected to database"+config.database	);
});


mongoose.connection.on("error", (err) =>{
	console.log("database not connected"+err	);
});
/*Express object created*/
const app = express();
/* Users page redirect to routes to furthur call functions*/
const users = require('./routes/users');
/* Port to run on server*/
const port = 3000;
/*CORS middleware*/
app.use(cors());
/*body parse*/
app.use(bodyParser.json());

// Passport middleware 
app.use(passport.initialize());
app.use(passport.session());

require('./config/passport')(passport);

app.use("/users",users);

/*route*/
app.get("/" , (req,res)=>{

res.send("here we go");
} );

app.listen(port,()=>{

	console.log("Server started on port 3000");
});