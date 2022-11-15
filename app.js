const express = require('express')
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');

const app = express()
const port = 3000
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(express.static("public"));

mongoose.connect('mongodb://127.0.0.1:27017/wikiDB');

const articlesSchema = new mongoose.Schema({
    title: String,
    content: String
})

const articles = mongoose.model('article',articlesSchema);


app.route('/articles')
.get((req, res) => {
    articles.find(function(err,findarticles){
        if(!err){
            res.send(findarticles);
        } else {
            res.send(err);
        }
    })
  })
.post((req, res) =>{

    const newArticles = new articles({
        title:req.body.title,
        content:req.body.body
    });

    newArticles.save(function(err){
        if(!err){
            res.send("성공적으로 저장되었습니다.")
        } else{
            res.send(err);
        }
    })
})
.delete((req, res) =>{
    articles.deleteMany(function(err){
        if(!err){
            res.send("성공적으로 삭제되었습니다.");
        } else{
            res.send(err);
        }
    })
});

app.route('/articles/:articlesTitle')
    .get((req, res) => {
        articles.find({ title: req.params.articlesTitle }, function(err,foundArticle){
            if(foundArticle){
                res.send(foundArticle);
            }else{
                res.send("일치하는 기사를 찾을수 없습니다.");
            }
        })
    })

    .put((req,res) =>{
        articles.findOneAndUpdate(
            {title: req.params.articlesTitle},
            {title: req.body.title, content: req.body.body},
            function(err){
                if(!err){
                    res.send("성공적으로 업데이트 되었습니다.")
                }else{
                    res.send("매치된 항목이 존재하지않습니다.")
                }
            }
        )
    })

    .patch((req, res) => {
        articles.findOneAndUpdate(
            {title: req.params.articlesTitle},
            {$set: req.body},
            function(err){
                if(!err){
                    res.send("성공적으로 업데이트 되었습니다.")
                } else{
                    res.send(err)
                }
            })
    })

    .delete((req, res) =>{
        articles.findOneAndDelete(
            {title: req.params.articlesTitle},
            function(err){
                if(!err){
                    res.send("성공적으로 삭제되었습니다.")
                }
            }
        )
    })

  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
  })