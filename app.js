//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/wikiDB", {useNewUrlParser:true})

const articlesSchema= {
    title: String,
    content: String
  };
  const Article = mongoose.model("Article", articlesSchema);


///////////////   requsest reagrding all the articles ////////////



  app.route("/articles")


    .get(function(req,res){
    Article.find(function(err, foundArticles){
      res.send(foundArticles);
                });
        })


    .post(function(req,res){
        console.log(req.body.title);
        console.log(req.body.content);
    
        const newArticle= new Article({
            title:req.body.title,
            content:req.body.content
        });
        newArticle.save(function(err){
            if(!err){
                res.send("successfully added new article to the db")
            }
        });
    })

    .delete(function(req,res){
        Article.deleteMany(function(err){
            if(!err){
                res.send("successfully deleted all items")
            }
            else{
                res.send(err);
            }
        });
    });



    ///////////////   requsest reagrding specific article ////////////


app.route("/articles/:articletitle")    

.get(function(req,res){
    Article.findOne({title: req.params.articletitle}, function(err,foundArticle){
        if (foundArticle){
            res.send(foundArticle);
        }
        else{
            res.send("No articles found by this name");
        }
    })
})

.put(function(req,res){
    Article.updateOne(
        {title:req.params.articletitle}, 
        {$set:{title: req.body.title,
        content: req.body.content}},
        {overwrite:true}, 
        function(err){
            if(!err){
                res.send("successfully updated the article")
            }
            else{
                res.send(err);
            }
    })
})

.patch(function(req,res){
    Article.updateOne(
        {title:req.params.articletitle},
        {$set: req.body},
        function(err){
            if(!err){
                res.send("successfully patched the file ie update only one field")
            }
            else{
                res.send(err);
            }
        }

    )
})

.delete(function(req,res){
    Article.deleteOne(
        {title:req.params.articletitle},
        function(err){
            if(!err){
                res.send("successfully eleted that specific article")
            }
            else{
                res.send(err);
            }
        }
    )
});


app.listen(3000, function() {
  console.log("Server started on port 3000");
});