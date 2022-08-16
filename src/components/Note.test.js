import React from "react";
import '@testing-library/jest-dom/extend-expect';
import {render, screen} from "@testing-library/react";
import Note from "./Note";
import userEvent from "@testing-library/user-event";

test('renders content', () => {
    const note = {
        content: 'Component testing done with react-testing-library',
        important: true
    };

    //Normally react components are rendered to DOM. The render method below renders components in a way
    //that is suitable for testing without rendering them to DOM.
    const {container} = render(<Note note={note}/>);

    //we use the object screen to access the rendered component
    const element = screen.getByText('Component testing done with react-testing-library');

    // eslint-disable-next-line testing-library/no-debugging-utils
    screen.debug(element); //this prints the html of element to console.

    expect(element).toBeDefined();

    //or we can use css-selectors to find rendered elements
    // by using querySelector method of the object container
    // eslint-disable-next-line testing-library/no-container,testing-library/no-node-access
    const div = container.querySelector('.note');
    expect(div).toHaveTextContent(
        'Component testing done with react-testing-librarymake not important'
    )
});

test('clicking the button calls event handler once', async () => {
    const note = {
        content: 'Component testing done with react-testing-library',
        important: true
    };

    const mockCallback = jest.fn(); //returns a mock function. See https://jestjs.io/docs/mock-functions

    render(<Note note={note} toggleImportance={mockCallback}/>);

    //retrieve the button from the rendered Note component
    const button = screen.getByText('make not important');

    //a user-event object is created. See https://testing-library.com/docs/user-event/setup/
    const user = userEvent.setup();
    await user.click(button);

    //The mock function is called once when the button is clicked.
    expect(mockCallback.mock.calls.length).toBe(1);
});

// describe("<Tooglable />", () => {
//     let container;
//
//     beforeEach(() => {
//         // className 'togglable content' below is just a dummy className for testing
//         // eslint-disable-next-line testing-library/no-render-in-setup
//         container = render(
//             <Togglable buttonLabel={'show'} >
//                 togglable content
//             </Togglable>).container;
//     })
//
//     test('renders its children', async () => {
//         await screen.findAllByText('togglable content');
//     })
//
//     test('at the start the children are not displayed', () => {
//         // eslint-disable-next-line testing-library/no-container,testing-library/no-node-access
//         const div = container.querySelector('.togglableContent');
//         // eslint-disable-next-line testing-library/no-debugging-utils
//         expect(div).toHaveStyle('display: none');
//     })
//
//     test('after clicking the button children are displayed', async () => {
//         const button = screen.getByText('show');
//         const user = userEvent.setup();
//         await user.click(button);
//
//         // eslint-disable-next-line testing-library/no-container,testing-library/no-node-access
//         const div = container.querySelector('.togglableContent');
//         expect(div).not.toHaveStyle('display: none')
//     })
//
//     test('toggled content can be closed', async () => {
//         const button = screen.getByText('show');
//         const user = userEvent.setup();
//         await user.click(button);
//
//         const cancelButton = screen.getByText('cancel');
//         await user.click(cancelButton);
//
//         // eslint-disable-next-line testing-library/no-container,testing-library/no-node-access
//         const div = container.querySelector('.togglableContent');
//         expect(div).toHaveStyle('display: none');
//     })
//
//
// })