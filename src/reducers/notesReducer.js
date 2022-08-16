const notesReducer = (state = [], action) => {
    switch(action.type){
        case 'NEW_NOTE':
            return state.concat(action.data);
        case 'TOGGLE_IMPORTANCE':
            const id = action.data.id;
            const noteToChange = state.find(n => n.id === id);
            const changedNote = {...noteToChange, important: !noteToChange.important};
            return state.map(note => (note.id === changedNote.id) ? changedNote : note);
        default:
            return state;
    }
}

export default notesReducer;