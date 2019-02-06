
class SelectOption extends React.Component {
    render() {
        return React.createElement(
            "option",
            { value: this.props.dat },
            this.props.dat
        );
    }
}
class BugRow extends React.Component {
    render() {
        var op = [];
        $.each(this.props.bug.defaultValues, function (key, val) {
            op.push(React.createElement(SelectOption, { key: key, dat: val }));
        });
        if (this.props.bug.isHidden == 0) {
            if (this.props.bug.uicomponenttype != 'dropdown') {
                return React.createElement(
                    "div",
                    { className: "form-group" },
                    React.createElement(
                        "label",
                        { "for": this.props.bug._id },
                        this.props.bug.label,
                        ":"
                    ),
                    React.createElement("input", { type: this.props.bug.uicomponenttype, className: "form-control", id: this.props.bug._id, placeholder: this.props.bug.placeholder, name: this.props.bug.fieldName })
                );
            } else {
                return React.createElement(
                    "div",
                    { className: "form-group" },
                    React.createElement(
                        "label",
                        { "for": this.props.bug._id },
                        this.props.bug.fieldName,
                        ":"
                    ),
                    React.createElement(
                        "select",
                        { name: "emailOption", className: "form-control", id: this.props.bug._id },
                        React.createElement(
                            "option",
                            { selected: "selected", value: "", disabled: "disabled" },
                            "Choose Type Of Mail Id"
                        ),
                        op
                    )
                );
            }
        } else {
            return null;
        }
    }
}

class BugTable extends React.Component {
    constructor(props) {
        super(props);
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    handleSubmit(e) {
        e.preventDefault();
        var form = document.forms.inputForm;
        var formData = {
            FirstName: $("*[name='firstname']").val(),
            Lastname: $("*[name='lastname']").val(),
            emailId: $("*[name='emailAddress']").val(),
            mobileNo: '7022835279',
            Address: {addressType: $("*[name='emailOption']").val()},
            username: $("*[name='username']").val(),
            password: $("input[type='password']").val(),
            enabled: true,
            userType: 2
          };
        axios({
            method: 'post',
            url: 'http://localhost:3001/signup',
            data: formData
          }).then(data => console.log(`success with ${JSON.stringify(data)}`))
            .catch(err => console.log(`error is ${err}`));
          console.log(formData);
    }
    render() {
        var bugRows = '';
        var da = [];
        const datas = this.props.bugs;
        $.each(datas, function (key, value) {
            if (key == "data") {
                $.each(value, function (i, thisVal) {
                    if (datas[thisVal]) {
                        bugRows = datas[thisVal].map(function (obj) {
                            return React.createElement(BugRow, { key: obj.id, bug: obj });
                        });
                        da.push(bugRows);
                    }
                });
            }
        });
        return React.createElement(
            "div",
            null,
            React.createElement(
                "div",
                null,
                "The list of bugs as a table would come here."
            ),
            React.createElement(
                "div",
                { id: "formContainer" },
                React.createElement(
                    "form",
                    { name: "inputForm", id: "registration-form", className: "col-md-5 col-xs-5 col-lg-5 col-sm-5" },
                    da,
                    React.createElement(
                        "button",
                        { onClick: this.handleSubmit, className: "btn btn-success" },
                        "submit"
                    )
                )
            )
        );
    }
}

class BugList extends React.Component {
    constructor(props) {
        super(props);
        this.state = { bugs: [] };
        this.componentDidMount = this.componentDidMount.bind(this);
    }

    componentDidMount() {
        $.post('http://localhost:3001/get_signupForm', { "clientId": "5a422d92ee3fef65324d15a1" }, { headers: {
                'Content-Type': 'application/json'
            }
        }).done(function (data) {
            console.log("rendering the form from Mongodb")
            if (data['status']) {
                this.setState({ bugs: data['result'] });
            }
        }.bind(this));
    }
    render() {
        return React.createElement(
            "div",
            null,
            React.createElement(
                "center",
                null,
                React.createElement(
                    "h3",
                    null,
                    "Supplier Partner Registration Form"
                )
            ),
            React.createElement("hr", null),
            React.createElement(BugTable, { bugs: this.state.bugs }),
            React.createElement("hr", null)
        );
    }
}
ReactDOM.render(React.createElement(BugList, null), document.getElementById('main'));