import {useEffect, useRef, useState} from "react";
import Note from "./components/Note";
import noteService from "./services/notes";
import Notification from "./components/Notification";
import loginService from "./services/login";
import LoginForm from "./components/LoginForm";
import Togglable from "./components/Togglable";
import NoteForm from "./components/NoteForm";

const App = () => {
    const [notes, setNotes] = useState([]);
    const [showAll, setShowAll] = useState(true);
    const [errorMessage, setErrorMessage] = useState(null);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [user, setUser] = useState(null);

    //This is actually a reference to the Togglable instance that encloses
    // the NoteForm instance in our code. But we named it noteFormRef since a function present inside
    // Togglable will be used in the NoteForm instance
    const noteFormRef = useRef();

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

    const addNote = (noteObject) => {
        noteFormRef.current.toggleVisibility();
        noteService.create(noteObject)
            .then(returnedNote => {
                setNotes(notes.concat(returnedNote));
            })
            .catch(error => {
                setErrorMessage(error.response.data.error);
                setTimeout(() => {
                    setErrorMessage(null)
                }, 5000);
            });
    };

    const toggleImportanceOf = (id) => {
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
            noteService.setToken(user.token);
            setUser(user);
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
            <Togglable buttonLabel={'login'}>
                <LoginForm
                    handleSubmit={handleLogin}
                    username={username}
                    handleUsernameChange={({target}) => {setUsername(target.value)}}
                    password={password}
                    handlePasswordChange={({target}) => {
                        setPassword(target.value)
                    }}
                />
            </Togglable>
        )
    };

    const noteForm = () => {
        return (
            <Togglable buttonLabel={'new note'} ref={noteFormRef}>
                <NoteForm
                    createNote={addNote}
                />
            </Togglable>
        );
    }

    return (
        <>
            <h1>Notes</h1>
            <Notification message={errorMessage}/>
            {user === null ?
                loginForm() :
                <div>
                    <p>{user.name} logged in</p>
                    {noteForm()}
                    <div>
                        <button onClick={() => {
                            setShowAll(!showAll)
                        }}>
                            show {showAll ? 'important' : 'all'}
                        </button>
                    </div>
                    <ul>
                        {notesToShow.map(note =>
                            <Note
                                key={note.id}
                                note={note}
                                toggleImportance={() => {
                                    toggleImportanceOf(note.id)
                                }}
                            />
                        )}
                    </ul>
                </div>
            }
        </>);
}

export default App;
