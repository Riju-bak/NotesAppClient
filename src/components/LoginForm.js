import * as PropTypes from "prop-types";

function LoginForm(props) {
    return <form onSubmit={props.onSubmit}>
        <div>
            username
            <input
                type="text"
                value={props.value}
                name="Username"
                onChange={props.onChange}
            />
        </div>
        <div>
            password
            <input
                type="text"
                value={props.value1}
                name="Password"
                onChange={props.onChange1}
            />
        </div>
        <button type="submit">login</button>
    </form>;
}

LoginForm.propTypes = {
    onSubmit: PropTypes.func,
    value: PropTypes.string,
    onChange: PropTypes.func,
    value1: PropTypes.string,
    onChange1: PropTypes.func
};

export default LoginForm;