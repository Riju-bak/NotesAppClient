import {useState, useEffect} from "react";
import Note from "./components/Note";
import axios from "axios";

const App = () => {
    const [notes, setNotes] = useState([]);
    const [newNote, setNewNote] = useState('a new note...');
    const [showAll, setShowAll] = useState(true);

    const notesToShow = showAll ? notes : notes.filter(note => note.important);

    const hook = () => {
        // console.log(`effect`);
        const promise = axios.get('http://localhost:3002/notes');
        promise.then(res => {
            // console.log(`promise fulfilled`);
            setNotes(res.data);
        })
    };
    useEffect(hook, []); //By default effects run after every completed render.
    // // console.log(`render ${notes.length} notes`);

    const addNote = (event) => {
        // The event parameter is the event that triggers the call to the event handler function:
        event.preventDefault(); //Prevents the default action of submitting the form.
        // console.log('button clicked', event.target); //The target in this case is the form that we have defined in our component.
        const noteObject = {
            content: newNote,
            date: new Date().toISOString(),
            important: Math.random() < 0.5
        }
        axios.post('http://localhost:3002/notes', noteObject)
            .then(res => {
                // console.log(res);
                setNotes(notes.concat(res.data));
                setNewNote('');
            })
    };

    const toggleImportance = (id) => {
        // USING PATCH Request, better than POST IMO
        const url = `http://localhost:3002/notes/${id}`;
        const note = notes.find(note => note.id === id);
        axios.patch(url, {important: !note.important})
            .then(res => {
                console.log(res);
                console.log(`note ${id} importance set to ${res.data.important}`);
                setNotes(notes.map( note => note.id===id ? res.data : note));
            });
    };

    const handleNoteChange = (event) => {
        // console.log('input value changed', event.target); //The target in this case is the input field
        setNewNote(event.target.value)
    };
    return (
        <>
            <h1>Notes</h1>
            <button onClick={() => setShowAll(!showAll)}>show {showAll ? 'important' : 'all'}</button>
            <ul>
                {notesToShow.map(note =>
                    <Note key={note.id}
                          note={note}
                          toggleImportance={
                              () => {
                                  toggleImportance(note.id)
                              }
                          }
                    />)}
            </ul>
            <form onSubmit={addNote}>
                <input value={newNote} onChange={handleNoteChange}/>
                <button type={"submit"}>save</button>
            </form>
        </>);
}

export default App;
