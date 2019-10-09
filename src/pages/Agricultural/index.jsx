import {Component} from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import Detail from './detail/index.jsx';
import Smalldetail from './detail/smallDetail/index.jsx';
// import {connect} from 'react-redux';
// import {action} from './model';
class Page extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <div className='farming-admin agricultural'>
            <Switch>
              <Route path="/pages/agricultural/detail" exact component={Detail}/>
              <Route path='/pages/agricultural/detail/:number' component={Smalldetail}/>
              <Redirect path='/pages/agricultural' to="/pages/agricultural/detail"/>
              <Redirect to="/404"/>
            </Switch>
          </div>
      // </div>
    );
  }
}
export default Page;
