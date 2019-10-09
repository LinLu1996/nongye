import {Component} from 'react';
import {NavLink} from 'react-router-dom';
import {Menu,Layout} from 'antd';
import './index.less';
import {withRouter} from "react-router";
import connect from "react-redux/es/connect/connect";
import {action} from "@/app/model";
const MenuItemGroup = Menu.ItemGroup;
const SubMenu = Menu.SubMenu;
const { Sider } = Layout;
const clientHeight = document.body.clientHeight;
class Sidebar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            page: 'normal',
            openList: [],
            menuData: [],
            selectedKeys: '',
            breadcrumbList: []
        };
        // this.handleSelect = this.handleSelect.bind(this);
    }
    async componentWillReceiveProps(nextProps) {
        let { selectedKeys } = this.state;
        if (nextProps && nextProps.data) {
            let currentMenu = {};
            const openList = [];
            await nextProps.data.map(item => {
                if (location.hash.indexOf(item.resUrl) > -1) {
                    currentMenu = item;
                    openList.push(`sub${item.id}`);
                    return;
                }
            });
            await this.setState({
                menuData: currentMenu
            });
            let list = [
                {
                    name: '首页',
                    url: '/'
                }
            ];
            if (currentMenu && currentMenu.childrens) {
                list.push({
                    name: currentMenu.resName
                });
                await currentMenu.childrens.forEach((item) => {
                    if (item && item.childrens) {
                        item.childrens.forEach((item2) => {
                            if (location.hash.indexOf(item2.pageUrl) > -1) {
                                list.push({
                                    name: item.resName
                                });
                                list.push({
                                    name: item2.resName
                                });
                                openList.push(`sub${item.id}`);
                                selectedKeys = `sub${item2.id}`;
                                return;
                            }
                        });
                    } else {
                        const urlAarr = item.pageUrl.split('/');
                        if (location.hash.indexOf(urlAarr[urlAarr.length - 1]) > -1) {
                            openList.push(`sub${item.id}`);
                            selectedKeys = `sub${item.id}`;
                            if(item.resName!=='首页') {
                                list.push({
                                    name: item.resName
                                });
                            }
                            return;
                        }
                    }
                });
            } else {
                selectedKeys = 'subhome';
                list = [];
                this.setState({
                    selectedKeys,
                    openList:[]
                });
            }
            this.setState({
                breadcrumbList: list
            },() => {
                this.props.setBreadcrumbList(list);
            });
            if (this.state.page !== currentMenu.keyword) {
                await this.setState({
                    page: currentMenu.keyword,
                    openList: openList,
                    selectedKeys
                });
            }
        }
    }

    MenuItem(item) {
        return item.childrens.map((text) => {
            const url = text.pageUrl ? `${text.pageUrl}` : '/';
            if (text.childrens) {
                return this.MenuItem(text);
            }
                return <Menu.Item key={`sub${text.id}`}><NavLink style={{paddingLeft: '5px'}} activeClassName='is-active'
                                                              to={url}><span>{text.resName}</span></NavLink></Menu.Item>;
        });
    }

    menuChange(openKeys) {
        this.setState({
            openList: openKeys
        });
    }

     handleSelect(e) {
        this.setState({
            selectedKeys: e.key
        });
    }

    render() {
        const {openList,selectedKeys} = this.state;
        const {data} = this.props;
        // const iconClass = menuData.icon ? `iconfont ${menuData.icon}` : 'iconfont icon-xiangmuguanli';
        return (
            <div className='menubox' style={{minHeight:clientHeight-130}}>
                <Sider collapsed={this.props.collapsed} style={{minHeight: '100vh'}}>
                    <div className="ant-pro-sider-menu-logo" id="logo">
                        <a href={'/'}>
                             {/*<i className="iconfont icon-jidi"></i>*/}
                            <h1>{this.props.collapsed?'AI':'AI种植系统'}</h1>
                        </a>
                    </div>
                    {/*<div className='menu-title'>*/}
                    {/*<div className='menu-cont'>*/}
                    {/*<div className='menu-icon'>*/}
                    {/*<div className='p1'><i className={iconClass}></i></div>*/}
                    {/*<div className='p2'>{menuData.resName}</div>*/}
                    {/*</div>*/}
                    {/*</div>*/}
                    {/*</div>*/}
                    <Menu
                            mode="inline"
                            className='menu'
                            // defaultSelectedKeys={selectedKey}
                            selectedKeys={[selectedKeys]}
                            // onSelect={this.handleSelect}
                            onClick={this.handleSelect.bind(this)}
                            openKeys={openList}
                            theme="dark"
                            onOpenChange={this.menuChange.bind(this)}
                            // inlineCollapsed={this.props.collapsed}
                    >
                        {/*<Menu.Item key="home">*/}
                            {/*<NavLink to={'/'}><i className='iconfont icon-jidi' style={{paddingRight: '5px'}}/><span>首页</span></NavLink>*/}
                        {/*</Menu.Item>*/}
                        {
                            (data || []).map((item) => {
                                const url = item.pageUrl ? `${item.pageUrl}` : '/';
                                const icon = `iconfont ${item.icon}`;
                                if (item.childrens && item.childrens.length > 0) {
                                    return <SubMenu key={`sub${item.id}`} title={<span><i className={icon} style={{paddingRight: '5px'}}/><span>{item.resName}</span></span>}>
                                        {
                                            (item.childrens || []).map((item2) => {
                                                // const url = item2.pageUrl ? `${item2.pageUrl}` : '/';
                                                // const icon = `iconfont ${item2.icon}`;
                                                if (item2.childrens && item2.childrens.length > 0) {
                                                    return <SubMenu key={`sub${item2.id}`} title={<span>{item2.resName}</span>}>
                                                        {
                                                            item2.childrens ? this.MenuItem(item2) : ''
                                                        }
                                                    </SubMenu>;
                                                } else {
                                                    return <Menu.Item key={`sub${item2.id}`}><NavLink style={{paddingLeft: '5px'}} activeClassName='is-active'
                                                                                                     to={item2.pageUrl}><span>{item2.resName}</span></NavLink></Menu.Item>;
                                                }
                                            })
                                        }
                                    </SubMenu>;
                                }
                                else {
                                    return <MenuItemGroup key={item.id} title={<span><NavLink style={{paddingLeft: '5px'}}
                                                                                              activeClassName='is-active'
                                                                                              to={url}><i className={icon}
                                                                                                          style={{paddingRight: '5px'}}/>{item.resName}</NavLink></span>}>{item.childrens ? this.MenuItem(item) : ''}</MenuItemGroup>;
                                }
                            })
                        }
                    </Menu>
                </Sider>
            </div>
        );
    }
}
const mapStateToProps = (state) => {
    const {collapsed} = state.initReducer;
    return {
        collapsed
    };
};
export default withRouter(connect(mapStateToProps, action)(Sidebar));
