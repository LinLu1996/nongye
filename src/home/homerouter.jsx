import {Component} from 'react';
import {Route, Switch, Redirect } from 'react-router-dom';
import Homes from './index.jsx';
import {action} from '@/app/model';
import {connect} from 'react-redux';
import Header from '@/component/header/index.jsx';
import Sidebar from '../component/sidebar/index.jsx';
class Home extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    const { menuData } = this.props;
    const menuFlag = JSON.parse(localStorage.getItem('flag'));
      let url = localStorage.getItem('url');
      if(!url) {
          url = "platform";
      }
    const urlLogin = `/${url}/login`;
    // const urlLogin = '/portal';
    return (
        <div className="content-body">
            {menuFlag?<Sidebar data = {menuData} />:''}
            <div className='content-box'>
            {menuFlag?<Header data={menuData}/>:''}
                <div className='content-wrapper'>
                    {
                        menuFlag?<Switch>
                            <Route path='/' component={Homes}/>
                        </Switch>:<Redirect to={urlLogin} />
                    }
                </div>
            </div>
       </div>
    );
  }
}
const mapstateProps=(state) => {
    const { menuData } = state.initReducer;
    return {
      menuData
    };
  };
  export default connect(mapstateProps,action)(Home);