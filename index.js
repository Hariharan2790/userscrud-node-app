const express = require("express");
const app = express();
const cors = require("cors");
const mongodb = require("mongodb");
const mongoClient = mongodb.MongoClient;
const URL = "mongodb+srv://hariharan:viji123@cluster0.mlpu8.mongodb.net?retryWrites=true&w=majority";

let usersList = [];
app.use(express.json());

app.use(cors({
    origin: "*"
}));

app.get("/users", async function (req, res) {
    try {
        let connection = await mongoClient.connect(URL);
        let db = connection.db("Zenclass");
        let users = await db.collection("users").find({}).toArray();
        await connection.close();
        res.json(users);
    } catch (error) {
        console.log(error);
    }
    // res.json(usersList);
});

app.get("/user/:id", async function (req, res) {
    try {
        let connection = await mongoClient.connect(URL);
        let db = connection.db("Zenclass");
        let objId = mongodb.ObjectId(req.params.id)
        let user = await db.collection("users").findOne({ _id: objId })
        await connection.close();

        if(user){
        res.json(user)
        }else{
            res.status(401).json({message: "User not found"})
        }

    } catch (error) {
        res.status(500).json({message : "Something went wrong"})
    }




    // let user = usersList.find(obj => obj.id == req.params.id);
    // if (user) {
    //     res.json(user)
    // } else {
    //     res.status(404).json({ message: "User Not Found" })
    // }
})
app.post("/create-user", async function (req, res) {

    try {
        //Connect to the Database
        let connection = await mongoClient.connect(URL);
        //Select DB
        let db = connection.db("Zenclass")
        //Select Collection
        //Do any Operation
        await db.collection("users").insertOne(req.body)
        //Close the connection
        connection.close();
        res.json({ message: "User Added" })
    } catch (error) {

    }


    // req.body.id = usersList.length + 1;
    // usersList.push(req.body);
    // res.json({ message: "User Added!" });
});

app.put("/user/:id",async function (req,res) {
        try {
            let connection = await mongoClient.connect(URL);
            let db = connection.db("Zenclass");
            let objId = mongodb.ObjectId(req.params.id)
            await db.collection("users").findOneAndUpdate({_id:objId},{$set:req.body})
            await connection.close()
            res.json({message : "User Updated"})
        } catch (error) {
            console.log(error);
        }




    // //find the index of the object
    // let index = usersList.findIndex(obj => obj.id == req.params.id);
    // //update the object with new data
    // let keyArray = Object.keys(req.body); // ["email", "phone" ]
    // keyArray.forEach((obj) => {
    //     usersList[index][obj] = req.body[obj]
    //     //usersList[0]["email"] = req.body["email"]
    //     //usersList[0]["phone"] = req.body["phone"]
    // })

    // res.json({ message: "Edited" });

})
app.delete("/user/:id", async function (req, res) {
    try {
        let connection = await mongoClient.connect(URL);
        let db = connection.db("Zenclass");
        let objId = mongodb.ObjectId(req.params.id)
        await db.collection("users").deleteOne({_id:objId})
        await connection.close();
        res.json({message : "User Deleted"})
    } catch (error) {
        console.log(error)
    }
    
    
    // let index = usersList.findIndex(obj => obj.id == req.params.id);
    // usersList.splice(index, 1);
    // res.json({ message: "Deleted!" })
})

app.listen(process.env.PORT || 3000);

