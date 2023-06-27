//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose")
const _ = require("lodash");

const app = express();
const port = process.env.PORT || 3000;

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mailto:mongoose.connect("mongodb+srv://supriya:supriya@cluster0.6s5eym2.mongodb.net/todoListsDB").then(()=>{
   console.log("database connected")
});

const itemsSchema = {
  name: String
};

const listSchema = {
  name: String,
  items: [itemsSchema]
}

const Item = mongoose.model("Item", itemsSchema);

const List = mongoose.model("List", listSchema);

const item1 = new Item({
  name: "Welcome to your todolist"
});

const item2 = new Item({
  name: "Hit the + button to add new item"
});

const item3 = new Item({
  name: "<-- Hit this to delete an item."
});

const defaultItems = [item1, item2, item3];

app.get("/", function(req, res) {

  Item.find().then((foundItems) => {
    // if (foundItems.length ===0){ 
    //   Item.insertMany(defaultItems).then(function () {
    //   mongoose.connection.close();   
    //     console.log("Successfully Inserted Default items");
    //   }).catch(function (err) {
    //     console.log(err);
    //   });
      
    // }else{
      console.log(foundItems)
      res.render("list.ejs", {listTitle: "Today", newListItems: foundItems});
    // } 
    // res.redirect("/") 
     })
  });

app.post("/", function(req, res){

  const itemName = req.body.newItem;
  const listName = req.body.list;

  const item = new Item({
    name: itemName
  })

  if(listName==="Today"){
    item.save();
    res.redirect("/");
  }else {
    List.findOne({name: listName}).then((foundList) => {
      foundList.items.push(item);
      foundList.save();
      res.redirect("/"+listName)
    }).catch(function (err) {
      console.log(err);
    });
  }
});

app.post("/delete", function(req,res){
  const chekedItemId = req.body.checkbox;
  const listName =req.body.listName;

  if (listName === "Today"){
    Item.findByIdAndRemove(chekedItemId).then(function () {  
      console.log("Deleted Successfully");
    })
    .catch(function (err) {
      console.log(err);
    })
    res.redirect("/")
  }else{
    List.findOneAndUpdate({name: listName}, {$pull: {items: {_id:chekedItemId}}}).then((foundList) => {
     res.redirect("/"+listName);
    }).catch(function (err) {
      console.log(err);
    });
  } 
});

app.get("/:customListName", function(req,res){
  const customListName = _.capitalize(req.params.customListName);

  List.findOne({name: customListName}).then((foundList) => {
    if (!foundList){ 
      //Create a new List
      const list = new List({
        name: customListName,
        items: defaultItems
      }); 
      list.save();
      res.redirect("/"+customListName);
    }else{
      //Show an existing list
      res.render("list.ejs", {listTitle: foundList.name, newListItems: foundList.items})
    }
  }).catch(function (err) {
    console.log(err); 
  });
    
});

app.get("/about", function(req, res){
  res.render("about");
});

app.listen(port, function() {
  console.log("Server started on port 3000");
});
