import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';


const app = express();
const prisma  = new PrismaClient();

app.use(express.json());
app.use(cors())

app.get("/api/notes", async (req, res) =>{
    const notes = await prisma.note.findMany();

    res.json(notes)
})

app.post("/api/notes", async(req, res) => {
    const {title, content} = req.body;
    if(!title || !content){
        return res.status(400).send("required params ar misssing");
    }
    try{
        const note = await prisma.note.create({
            data: {title, content}
        })
        res.json(note);
    }catch(error){
        res.status(500).send("Oops something went Wrong!");
    }
    
})

app.put("/api/notes/:id", async(req,res) => {
    const {title, content} = req.body;
    const id = parseInt(req.params.id);
    if(!title || !content){
        return res 
        .status(400)
        .send("Required params are missing!");
    }
    if(!id || isNaN(id)){
        return res
        .status(400)
        .send("Id must be valid number");
    }

    try{
        const updatedNote = 
        await prisma.note.update({
            where: { id},
            data: {title, content}
        })
        res.json(updatedNote)
    }catch(error){
        res.status(500)
        .send("Oops Something went Wrong!");
    }
})

app.delete("/api/notes/:id", async(req, res) => {
    const id = parseInt(req.params.id);
    if(!id || isNaN(id)){
        return res
        .status(400)
        .send("Id must be valid integer")
    }

    try{
        await prisma.note.delete({
            where: {id},
        })
        res.status(204).send();
    }catch(error){
        return res 
        .status(500).send("Oops Something Went Wrong!");
        
    }
})

app.listen(5000, () => {
    console.log("running on localhost: 5000")
})