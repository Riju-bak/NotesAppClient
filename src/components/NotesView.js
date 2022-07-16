import * as PropTypes from "prop-types";

function NotesView(props) {
    return <div>
        user {props.user.name} logged-in
        <br/><br/>
        <button onClick={props.onClick}>show {props.showAll ? "important" : "all"}</button>
        <ul>
            {props.notesToShow.map(props.callbackfn)}
        </ul>
        {props.notesForm}
    </div>;
}

NotesView.propTypes = {
    user: PropTypes.any,
    onClick: PropTypes.func,
    showAll: PropTypes.bool,
    notesToShow: PropTypes.arrayOf(PropTypes.any),
    callbackfn: PropTypes.func,
    notesForm: PropTypes.any
};

export default NotesView;