import {render, screen} from "@testing-library/react";
import Togglable from "./Togglable";
import userEvent from "@testing-library/user-event";
import React from "react";
import '@testing-library/jest-dom/extend-expect';

describe("<Tooglable />", () => {
    let container;

    beforeEach(() => {
        // className 'togglable content' below is just a dummy className for testing
        // eslint-disable-next-line testing-library/no-render-in-setup
        container = render(
            <Togglable buttonLabel={'show'} >
                togglable content
            </Togglable>).container;
    })

    test('renders its children', async () => {
        await screen.findAllByText('togglable content');
    })

    test('at the start the children are not displayed', () => {
        // eslint-disable-next-line testing-library/no-container,testing-library/no-node-access
        const div = container.querySelector('.togglableContent');
        // eslint-disable-next-line testing-library/no-debugging-utils
        expect(div).toHaveStyle('display: none');
    })

    test('after clicking the button children are displayed', async () => {
        const button = screen.getByText('show');
        const user = userEvent.setup();
        await user.click(button);

        // eslint-disable-next-line testing-library/no-container,testing-library/no-node-access
        const div = container.querySelector('.togglableContent');
        expect(div).not.toHaveStyle('display: none')
    })

    test('toggled content can be closed', async () => {
        const button = screen.getByText('show');
        const user = userEvent.setup();
        await user.click(button);

        const cancelButton = screen.getByText('cancel');
        await user.click(cancelButton);

        // eslint-disable-next-line testing-library/no-container,testing-library/no-node-access
        const div = container.querySelector('.togglableContent');
        expect(div).toHaveStyle('display: none');
    })
})