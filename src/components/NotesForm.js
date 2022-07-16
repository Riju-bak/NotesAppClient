import * as PropTypes from "prop-types";

function NotesForm(props) {
    return <form onSubmit={props.onSubmit}>
        <input value={props.value} onChange={props.onChange}/>
        <button type={"submit"}>save</button>
    </form>;
}

NotesForm.propTypes = {
    onSubmit: PropTypes.func,
    value: PropTypes.string,
    onChange: PropTypes.func
};

export default NotesForm;
