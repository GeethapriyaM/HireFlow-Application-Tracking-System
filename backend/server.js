const express =require("express");
const app=express();
app.use(express.json())
app.get("/",function(req,res) {
     res.send("HireFlow Backend is Running");
});
app.listen(500,function(){
    console.log("Server running on the Port");
});
