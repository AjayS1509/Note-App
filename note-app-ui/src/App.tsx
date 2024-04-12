import { useEffect, useState } from "react";
import "./App.css"

type Note = {
  id: Number;
  title: string;
  content: string;
}

const App = () => {
  const [notes, setNotes] = useState<Note[]>([])

  const [title, setTitle] = useState("");
  const [content, setContent] = useState('')
  const [selectNote, setSelectedNote] = useState<Note | null>(null);

  useEffect(() => {
    const fetchNotes = async () => {
      try{
        const response =  await fetch(`http://localhost:5000/api/notes`)
        const notes: Note[] = await response.json();
        setNotes(notes)
      }catch(e){ 
        //
        console.log(e)
      }
    }
    fetchNotes();
  },[])

  const handleNoteClick = (note: Note) => {
    setSelectedNote(note);
    setTitle(note.title);
    setContent(note.content);
  }

  const handleAddNote = async (
    event: React.FormEvent
  ) => {
    event.preventDefault();
    try{
      const response = await fetch(
        "http://localhost:5000/api/notes",{
          method: "POST",
          headers:{
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            title,content
          })
        }
      )
      const newNote = await response.json();
    setNotes([newNote, ...notes]);
    setTitle("");
    setContent("");
    }catch(e){
      console.error(e)
    }

    
  };

  const handleUpdateNote = async (event:React.FormEvent) => {
    event.preventDefault();
    if(!selectNote){
      return;
    }

    // const updatedNote: Note ={
    //   id: selectNote.id,
    //   title: title,
    //   content: content,
    // }
    try{
      //
      const response = await fetch(
        `http://localhost:5000/api/notes/${selectNote.id}`,{
          method: "PUT",
          headers:{
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            title,content
          })
        }
      )
      const updatedNote = await response.json();
      const updatedNotesList = notes.map((note) => note.id === selectNote.id ? updatedNote : note)
      setNotes(updatedNotesList)
      setTitle("");
      setContent("")
      setSelectedNote(null)
    }catch(e){
      console.error(e)
    }
    
  }

  const handleCancel = () => {
    setTitle("");
    setContent("")
    setSelectedNote(null);
  }

  const deleteNote = async (event: React.MouseEvent, noteId: Number) => {
    event.stopPropagation();
    try{
      await fetch(`http://localhost:5000/api/notes/${noteId}`,{
        method:"DELETE",

      })
      const updatedNotes = notes.filter(
        (note) => note.id !== noteId)
      setNotes(updatedNotes);
    }catch(e){
      console.error(e)
    }
  }
  
 
  return (
    <div className="app-container">
      <form action="" className="note-form" onSubmit={(event) => selectNote ? handleUpdateNote(event) :handleAddNote(event)}>
        <input type="text" required placeholder="title" value={title} onChange={(e) => setTitle(e.target.value)}/>
        <textarea name="" id="" rows={10} placeholder="Content" value={content} onChange={(e) => setContent(e.target.value)}></textarea>
        {selectNote ? (
          <div className="edit-buttons">
            <button type="submit">Save</button>
            <button onClick={handleCancel}>Cancel</button>
          </div>
        ): (
          <button type="submit">
          Add Note
        </button>
        )}
        
      </form>
      <div className="note-grid">
        {notes.map((note,i) => (
          <div className='note-item' key={i} onClick={() => handleNoteClick(note)}>
            <div className="notes-header">
            <button onClick={(e) => deleteNote(e, note.id)}>x</button>
            </div>
            <h2>{note.title}</h2>
            <p>{note.content}</p>
          </div>
        ))}
        
      </div>
    </div>
  )
}

export default App;