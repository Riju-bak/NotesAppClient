import {useState, useEffect} from "react";
import Note from "./components/Note";
import noteService from "./services/notes";
import Notification from "./components/Notification";
import loginService from "./services/login";
import LoginForm from "./components/LoginForm";
import NotesForm from "./components/NotesForm";
import NotesView from "./components/NotesView";

const App = () => {
    const [notes, setNotes] = useState([]);
    const [newNote, setNewNote] = useState('a new note...');
    const [showAll, setShowAll] = useState(true);
    const [errorMessage, setErrorMessage] = useState(null);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [user, setUser] = useState(null);

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

    useEffect(() => {
        const loggedUserJSON = window.localStorage.getItem('loggedNoteappUser');
        if (loggedUserJSON) {
            const user = JSON.parse(loggedUserJSON);
            setUser(user);
            noteService.setToken(user.token);
        }
    }, []);

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
                setNotes(notes.map(note => note.id === id ? returnedNote : note));
            })
            .catch(error => {
                setErrorMessage(`Note "${note.content}" already deleted from server`);
                setTimeout(() => {
                    setErrorMessage(null)
                }, 5000);
                setNotes(notes.filter(note => note.id !== id));
            });
    };

    const handleNoteChange = (event) => {
        // console.log('input value changed', event.target); //The target in this case is the input field
        setNewNote(event.target.value)
    };

    const handleLogin = async (event) => {
        event.preventDefault(); //Prevents the default action of submitting the form.
        //console.log(`logging in with ${username} and ${password}`);
        const credentials = {
            username: username,
            password: password
        };
        try {
            const user = await loginService.login(credentials);
            window.localStorage.setItem('loggedNoteappUser', JSON.stringify(user));
            setUser(user);
            noteService.setToken(user.token);
            setUsername("");
            setPassword("");
        } catch (e) {
            setErrorMessage('Invalid username or password');
            setTimeout(() => {
                setErrorMessage(null)
            }, 5000);
        }
    };

    const handleLogout = async () => {
        window.localStorage.removeItem('loggedNoteappUser');
        setUser(null);
    }

    const loginForm = () => {
        return (
            <LoginForm onSubmit={handleLogin} value={username} onChange={({target}) => {
                setUsername(target.value)
            }} value1={password} onChange1={({target}) => {
                setPassword(target.value)
            }}/>
        );
    };


    const notesForm = () => {
        return (
            <NotesForm onSubmit={addNote} value={newNote} onChange={handleNoteChange}/>
        );
    };

    const notesView = () => {
        return (
            <div>
                <button onClick={handleLogout}>Logout</button>
                <NotesView user={user} onClick={() => setShowAll(!showAll)} showAll={showAll} notesToShow={notesToShow}
                           callbackfn={note =>
                               <Note key={note.id}
                                     note={note}
                                     toggleImportance={
                                         () => {
                                             toggleImportance(note.id)
                                         }
                                     }
                               />} notesForm={notesForm()}/>
            </div>
        )
    }

    return (
        <>
            <h1>Notes</h1>
            <Notification message={errorMessage}/>
            {user === null ? loginForm() : notesView()}
        </>);
}

export default App;
