import {useState, useEffect} from "react";
import Note from "./components/Note";
import noteService from "./services/notes";
import Notification from "./components/Notification";

const App = () => {
    const [notes, setNotes] = useState([]);
    const [newNote, setNewNote] = useState('a new note...');
    const [showAll, setShowAll] = useState(true);
    const [errorMessage, setErrorMessage] = useState(null);

    const notesToShow = showAll ? notes : notes.filter(note => note.important);

    const hook = () => {
        // console.log(`effect`);
        const promise = noteService.getAll();
        promise.then(initialNotes => {
            // console.log(`promise fulfilled`);
            setNotes(initialNotes);
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
        noteService.create(noteObject)
            .then(returnedNote => {
                // console.log(res);
                setNotes(notes.concat(returnedNote));
                setNewNote('');
            })
    };

    const toggleImportance = (id) => {
        // Update USING POST Request, not as good as PATCH IMO
        const note = notes.find(note => note.id === id);
        const changedNote = {...note, important: !note.important}
        noteService.update(id, changedNote)
            .then(returnedNote => {
                // console.log(returnedNote);
                console.log(`note ${id} importance set to ${returnedNote.important}`);
                setNotes(notes.map( note => note.id===id ? returnedNote : note));
            })
            .catch( error => {
                setErrorMessage(`Note "${note.content}" already deleted from server`);
                setTimeout(() => {setErrorMessage(null)}, 5000);
                setNotes(notes.filter(note => note.id !== id));
            });
    };

    const handleNoteChange = (event) => {
        // console.log('input value changed', event.target); //The target in this case is the input field
        setNewNote(event.target.value)
    };
    return (
        <>
            <h1>Notes</h1>
            <Notification message={errorMessage}/>
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
