import {useState, useEffect} from "react";
import Note from "./components/Note";
import axios from "axios";

const App = () => {
    const [notes, setNotes] = useState([]);
    const [newNote, setNewNote] = useState('a new note...');
    const [showAll, setShowAll] = useState(true);

    const notesToShow = showAll ? notes : notes.filter(note => note.important);

    const hook = () => {
        console.log(`effect`);
        const promise = axios.get('http://localhost:3002/notes');
        promise.then(res => {
            console.log(`promise fulfilled`);
            setNotes(res.data);
        })
    };
    useEffect(hook, []); //By default effects run after every completed render.
    console.log(`render ${notes.length} notes`);

    const addNote = (event) => {
        // The event parameter is the event that triggers the call to the event handler function:
        event.preventDefault(); //Prevents the default action of submitting the form.
        console.log('button clicked', event.target); //The target in this case is the form that we have defined in our component.
        const noteObject = {
            id: notes.length + 1,
            content: newNote,
            date: new Date().toISOString(),
            important: Math.random() < 0.5
        }
        setNotes(notes.concat(noteObject));
    };

    const handleNoteChange = (event) => {
        console.log('input value changed', event.target); //The target in this case is the input field
        setNewNote(event.target.value)
    };
    return (
        <>
            <h1>Notes</h1>
            <button onClick={() => setShowAll(!showAll)}>show {showAll ? 'important' : 'all'}</button>
            <ul>
                {notesToShow.map(note => <Note key={note.id} note={note}/>)}
            </ul>
            <form onSubmit={addNote}>
                <input value={newNote} onChange={handleNoteChange}/>
                <button type={"submit"}>save</button>
            </form>
        </>);
}

export default App;
