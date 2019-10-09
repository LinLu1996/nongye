import {Component} from 'react';
import {Route, Switch, Redirect } from 'react-router-dom';
import Header from '../component/header/index.jsx';
import Sidebar from '../component/sidebar/index.jsx';
// import logo from '@/assets/logo.png';
// import SiderMenu from '../component/SiderMenu/index.js';
import {action} from '@/app/model';
import {connect} from 'react-redux';
import Masterdata from './masterdata/index.jsx';
import Aidthepoor from './aidthepoor/index.jsx';
import Knowledgebase from './knowledgebase/index.jsx';
import Plantingmgmt from './plantingmgmt/index.jsx';
import Weather from './weather/index.jsx';
import Assetsmgmt from './assetsmgmt/index.jsx';
import Agricultural from './Agricultural/index.jsx';
import System from './system/index.jsx';
class Pages extends Component {
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
            {menuFlag?<Header data = {menuData}/>:''}
          <div className='content-wrapper'>
            {/*{menuFlag?<Sidebar data = {menuData} />:''}*/}
            {/*{menuFlag?<SiderMenu data = {menuData} />:''}*/}
            {menuFlag?<Switch>
              <Route path='/pages/masterdata' component={Masterdata}/>
              <Route path='/pages/plantingmgmt' component={Plantingmgmt}/>
              <Route path='/pages/weather' component={Weather}/>
              <Route path='/pages/assetsmgmt' component={Assetsmgmt}/>
              <Route path='/pages/knowledgebase' component={Knowledgebase}/>
              <Route path='/pages/aidthepoor' component={Aidthepoor}/>
              <Route path='/pages/agricultural' component={Agricultural}/>
              <Route path='/pages/system'  component={System}/>
              <Redirect to="/404" />
            </Switch>:<Redirect to={urlLogin} />}
            {/*{*/}
              {/*menuFlag? <div className='content-bottom'>*/}
                  {/*Copyright © 2018-2019 AI种植系统.com All Rights Reserved.*/}
              {/*</div> :''*/}
            {/*}*/}
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
export default connect(mapstateProps,action)(Pages);