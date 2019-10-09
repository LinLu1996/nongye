import './index.less';
import {Component} from 'react';
import {connect} from "react-redux";
import {NavLink, Link} from "react-router-dom";
import {Icon, Breadcrumb} from 'antd';
import {withRouter} from "react-router";
import {context, IO} from '@/app/io';
import {action} from '@/app/model';
import Com from '../common/index.js';

//import { message } from 'antd';
class Header extends Component {
    constructor(props) {
        super(props);
        this.state = {
            datauser: ''
        };
    }

    async componentDidMount() {
        IO.infouser.getCurrentUserInfo().then((res) => {
            this.setState({datauser: res.data});
            localStorage.setItem('companyName', res.data.companyName);
            localStorage.setItem('accountType', res.data.accountType);
            localStorage.setItem('roleType', res.data.roleType ? res.data.roleType : 3);
        }).catch((res) => {
            Com.errorCatch(res);
        });
        this.props.getMenu();
        await this.props.getSecurityKeyword();
    }

    exit() {
        localStorage.removeItem('base');
        context.create('header', {
            exit: {
                mockUrl: '/proxy/sigOut',
                url: '/sigOut',
                method: 'POST'
            }
        });
        IO.header.exit().then((res) => {
            if (res.success) {
                localStorage.setItem('flag', false);
                let urls = localStorage.getItem('url');
                if(!urls) {
                    urls = "platform";
                }
                location.href = `/#/${urls}/login`;
                localStorage.removeItem('companyName');
                localStorage.removeItem('accountType');
            }
        });
    }

    triggerResizeEvent() {
        // eslint-disable-line
        const event = document.createEvent('HTMLEvents');
        event.initEvent('resize', true, false);
        window.dispatchEvent(event);
    }

    toggle() {
        const {collapsed, handleMenuCollapse} = this.props;
        handleMenuCollapse(!collapsed);
        this.triggerResizeEvent();
    }

    render() {
        const {headerStyle, data, collapsed, breadcrumbList} = this.props;
        const {datauser} = this.state;
        return (
            <div>
                <header style={headerStyle && JSON.parse(headerStyle) || {}} className="body-header">
                <span className='trigger' onClick={this.toggle.bind(this)}>
                  <Icon type={collapsed ? 'menu-unfold' : 'menu-fold'}/>
                </span>
                    <div className="logo-png" style={{display: 'none'}}>
                        <Link to="/">
                            <img src={'https://img.alicdn.com/tfs/TB1Z_zLh4naK1RjSZFtXXbC2VXa-52-41.png'}
                                 className='logo-img'/>
                            <span className='english-span'>AI</span><span>种植</span>
                        </Link>
                        {datauser.companyName ? <span className='logo-tit'>{datauser.companyName}</span> : ''}
                    </div>
                    <ul className="header-menu-list" style={{display: 'none'}}>
                        {data !== null && data.map(item => {
                            const url = item.pageUrl ? `${item.pageUrl}` : '/';
                            return <li key={`${item.id}`}><NavLink to={url}>{item.resName}</NavLink></li>;
                        })}
                    </ul>
                    <div style={{display: 'flex'}}>
                        <div className="header-user-info">
                            <NavLink target="_Blank" className="font-color-j" style={{color: '#ccc'}}
                                     to={`/pages/system/employee/user/${datauser.userId}`}>你好，{datauser.userName}</NavLink>
                        </div>
                        <div className="header-exit" onClick={this.exit.bind(this)}>
                            <a>
                                <i className="iconfont icon-exit"></i>
                                退出
                            </a>
                        </div>
                    </div>
                </header>
                <div className="breadcrumb">
                    {
                        breadcrumbList.length > 0 ?
                            <Breadcrumb>
                                {
                                    breadcrumbList.map(item => (
                                            <Breadcrumb.Item key={item.name}>{item.url ?
                                                <a href={item.url}>{item.name}</a> : item.name}</Breadcrumb.Item>
                                        )
                                    )
                                }
                            </Breadcrumb> : ''
                    }
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    const {headerStyle, logoUrl, userInfo, menuList, logoimg, collapsed, breadcrumbList} = state.initReducer;
    return {
        headerStyle, logoUrl, userInfo, menuList, logoimg, collapsed, breadcrumbList
    };
};
export default withRouter(connect(mapStateToProps, action)(Header));

