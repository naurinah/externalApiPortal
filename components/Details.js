import { withRouter } from "react-router";
function Details(props) {
  console.warn(props);
  return (
    <div>
      <h1>Hello{props.match.params.acno}</h1>
    </div>
  );
}

export default withRouter(Details);
