const express = require ('express');
const shortid = require('shortid');
const mongo = require("mongodb").MongoClient;
const validUrl = require("valid-url");



const app=express();
app.use(express.static("public"));

app.get("/",(req,res)=>{


})

  
app.get('/new/*',(req,res)=>{
    
    const parameter=req.params[0];
    const shrt=shortid.generate();

    if (validUrl.isUri(parameter)) {
      mongo.connect("mongodb://localhost:27017/", function(err, client) {
        if (err) throw err;
        let db = client.db("fccurl");
        let urls = db.collection("urls");
        urls.insertOne({ _id: shrt, originalUrl: parameter });
        const object = { original_url: parameter, short_url: `${req.hostname}/${shrt}` };
      res.send(object);
        client.close();
        res.end();
      });
    } else {
      res.send({
        error:
          "Wrong url format, make sure you have a valid protocol and real site."
      });
      res.end();
    }

});

app.get('/:str',(req,res)=>{
 const parameter = req.params.str;
 
    mongo.connect("mongodb://localhost:27017/", function(err, client) {
      if (err) throw err;
      let db = client.db("fccurl");
      let urls = db.collection("urls");
      
      
      urls
        .find({ _id: parameter })
        .project({ _id: 0 })
        .toArray(function(err, results) {
          if (err) throw err;
        
          if (results.length==0) {
             
                res.send({
                  error:
                    "This url does not exist on the database."
                });
          } else {
              res.redirect(results[0].originalUrl);
          }

        
          client.close();
          
        });
    });

})

app.listen(3000);