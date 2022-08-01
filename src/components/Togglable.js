import {forwardRef, useImperativeHandle, useState} from "react";
import PropTypes from 'prop-types';

//React.forwardRef creates a React component that forwards the ref attribute it receives to
// another component below in the tree.
const Togglable = forwardRef((props, refs) => {
        const [visible, setVisible] = useState(false);

        const hideWhenVisible = {display: visible ? 'none' : ''};
        const showWhenVisible = {display: visible ? '' : 'none'};

        const toggleVisibility = () => {
            setVisible(!visible);
        }

        //The component uses the useImperativeHandle hook to make its toggleVisibility
        // function available outside of the component.
        useImperativeHandle(refs, () => {
            return {
                toggleVisibility
            }
        });

        return (
            <div>
                <div style={hideWhenVisible}>
                    <button onClick={toggleVisibility}>{props.buttonLabel}</button>
                </div>
                <div style={showWhenVisible}>
                    {props.children}
                </div>
                <div style={showWhenVisible}>
                    <button onClick={toggleVisibility}>cancel</button>
                </div>
            </div>
        );
    }
);

Togglable.propTypes = {
    buttonLabel: PropTypes.string.isRequired
};

export default Togglable;