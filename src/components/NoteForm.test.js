import userEvent from "@testing-library/user-event";
import {render, screen} from "@testing-library/react";
import NoteForm from "./NoteForm";

test('<Noteform/> updates state and calls onSubmit', async () => {
    const createNote = jest.fn();
    const user = userEvent.setup();

    render(<NoteForm createNote={createNote}/>);

    let inputBox = screen.getByRole('textbox');
    const sendButton = screen.getByText('save');

    //if the form has more than one textbox getByRole() will fail
    //Therefore, it is advisable to use getByPlaceholderText for html input fields
    inputBox = screen.getByPlaceholderText('write here');

    await user.type(inputBox, 'testing a form...');
    await user.click(sendButton);

    expect(createNote.mock.calls).toHaveLength(1);

    //The first argument of the first call to the function createNote is a Note obj,
    // whose content should be 'testing a form...'
    expect(createNote.mock.calls[0][0].content).toBe('testing a form...');
})