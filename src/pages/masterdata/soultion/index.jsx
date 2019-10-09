import {Component} from 'react';
import {Input, Button, Col, Row, Card, Form, Icon} from 'antd';
import Tables from './table.jsx';
import {connect} from 'react-redux';
import {NavLink} from 'react-router-dom';
import {action} from './model';
import './../../index.less';
import Com from '@/component/common';
const FormItem = Form.Item;
class Resources extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: '',//种植方案名称
            cropName: '', //作物名称
            createUserName: '', //创建人
            modifyUserName: '', //修改人
            queryFlag: false,  //筛选按钮
            chooseId: null,
            saveFlag: true,
          closure:null
        };
    }

    componentDidMount() {
        this.props.page({current:1, pageSize:10});
        this.props.Alldatas({companyId: 1, userId: 1, startPage: 1, limit: 10});
        this.props.superiorName({name: '种植方案', parentLeftID: -1});
    }

    setName(event) {
        this.setState({
            name: event.target.value
        }, () => {
          if(this.setState.name) {
            this.setState({
              queryFlag:true
            });
          } else {
            this.setState({
              queryFlag:false
            });
          }
          if(this.state.closure) {
            clearTimeout(this.state.closure);
          }
          /*this.setState({
            closure : setTimeout(() => {
              this.query();
            },800)
          });*/
        });
    }

    setCropName(event) {
        this.setState({
            cropName: event.target.value
        }, () => {
          if(this.setState.cropName) {
            this.setState({
              queryFlag:true
            });
          } else {
            this.setState({
              queryFlag:false
            });
          }
          if(this.state.closure) {
            clearTimeout(this.state.closure);
          }
          // this.setState({
          //   closure : setTimeout(() => {
          //     this.query();
          //   },800)
          // });
        });
    }

    setCreateUserName(event) {
        this.setState({
            createUserName: event.target.value
        }, () => {
          if(this.setState.createUserName) {
            this.setState({
              queryFlag:true
            });
          } else {
            this.setState({
              queryFlag:false
            });
          }
          if(this.state.closure) {
            clearTimeout(this.state.closure);
          }
          /*this.setState({
            closure : setTimeout(() => {
              this.query();
            },800)
          });*/
        });
    }

    setModifyUserName(event) {
        this.setState({
            modifyUserName: event.target.value
        }, () => {
          if(this.setState.modifyUserName) {
            this.setState({
              queryFlag:true
            });
          } else {
            this.setState({
              queryFlag:false
            });
          }
          if(this.state.closure) {
            clearTimeout(this.state.closure);
          }
          // this.setState({
          //   closure : setTimeout(() => {
          //     this.query();
          //   },800)
          // });
        });
    }
    query() {  //查询按钮
        this.setState({
            queryFlag: true //控制分页的展示
        });
        const vm = {
            companyId: 1,
            userId: 1,
            name: this.state.name,
            cropName: this.state.cropName,
            createUserName: this.state.createUserName,
            modifyUserName: this.state.modifyUserName,
            startPage: 1,
            limit: 10
        };
        this.props.queryAll(vm);
        this.props.page({current:1, pageSize:10});
    }
    reset() {   //重置
        this.setState({
            name: '',//种植方案名称
            cropName: '', //作物名称
            createUserName: '', //创建人
            modifyUserName: '' //修改人
        },() => {
            this.query();
        });
    }
    onSizeChangequery(current, size) {  //点击筛选的分页按钮
        const vm = {
            companyId: 1,
            userId: 1,
            name: this.state.name,
            cropName: this.state.cropName,
            createUserName: this.state.createUserName,
            modifyUserName: this.state.modifyUserName,
            startPage: current,
            limit: size
        };
        this.props.queryAll(vm);
    }
    onShowSizeChange(current, size) {  //点击筛选的分页按钮
        const vm = {
            companyId: 1,
            userId: 1,
            name: this.state.name,
            cropName: this.state.cropName,
            createUserName: this.state.createUserName,
            modifyUserName: this.state.modifyUserName,
            startPage: 1,
            limit: size
        };
        this.props.queryAll(vm);
    }

    fnondrag(num) {   //点击左侧边的id
        this.setState({
            chooseId: num
        });
    }

    onchooseChange(current, size) {  //点击侧边的分页按钮
        const {chooseId} = this.state;
        this.props.chooseAll({id: chooseId, startPage: current, limit: size});
    }

    toggleForm() {
        const {expandForm} = this.state;
        this.setState({
            expandForm: !expandForm
        });
    }

    renderSimpleForm() {
        return (
            <Form layout="inline">
                <Row gutter={{md: 8, lg: 24, xl: 48}}>
                    <Col md={8} sm={24}>
                        <FormItem label="方案名称">
                            <Input value={this.state.name} onChange={this.setName.bind(this)}/>
                        </FormItem>
                    </Col>
                    <Col md={8} sm={24}>
                        <FormItem label="创建人">
                            <Input value={this.state.createUserName} onChange={this.setCreateUserName.bind(this)}/>
                        </FormItem>
                    </Col>
                    <Col md={8} sm={24} style={{textAlign: 'right'}}>
                        <span className='submitButtons'>
                          <Button type="primary" onClick={this.query.bind(this)}>
                            查询
                          </Button>
                          <Button style={{marginLeft: 8}} onClick={this.reset.bind(this)}>
                            重置
                          </Button>
                          <a style={{marginLeft: 8}} onClick={this.toggleForm.bind(this)}>
                            展开 <Icon type="down"/>
                          </a>
                        </span>
                    </Col>
                </Row>
            </Form>
        );
    }

    renderAdvancedForm() {
        return (
            <Form layout="inline">
                <Row gutter={{md: 8, lg: 24, xl: 48}}>
                    <Col md={8} sm={24}>
                        <FormItem label="方案名称">
                            <Input value={this.state.name} onChange={this.setName.bind(this)}/>
                        </FormItem>
                    </Col>
                    <Col md={8} sm={24}>
                        <FormItem label="创建人">
                            <Input value={this.state.createUserName} onChange={this.setCreateUserName.bind(this)}/>
                        </FormItem>
                    </Col>
                    <Col md={8} sm={24}>
                        <FormItem label="作物品种">
                            <Input value={this.state.cropName} onChange={this.setCropName.bind(this)}/>
                        </FormItem>
                    </Col>
                </Row>
                <Row gutter={{md: 8, lg: 24, xl: 48}}>
                    <Col md={8} sm={24}>
                        <FormItem label="修改人">
                            <Input value={this.state.modifyUserName} onChange={this.setModifyUserName.bind(this)}/>
                        </FormItem>
                    </Col>
                    <Col md={16} sm={24} style={{textAlign: 'right'}}>
                        <div style={{overflow: 'hidden'}}>
                            <div style={{marginBottom: 24}}>
                                <Button type="primary" onClick={this.query.bind(this)}>
                                    查询
                                </Button>
                                <Button style={{marginLeft: 8}} onClick={this.reset.bind(this)}>
                                    重置
                                </Button>
                                <a style={{marginLeft: 8}} onClick={this.toggleForm.bind(this)}>
                                    收起 <Icon type="up"/>
                                </a>
                            </div>
                        </div>
                    </Col>
                </Row>
            </Form>
        );
    }

    renderForm() {
        const {expandForm} = this.state;
        return expandForm ? this.renderAdvancedForm() : this.renderSimpleForm();
    }
    render() {
        const {securityKeyWord} = this.props;
        const queryRole = Com.hasRole(securityKeyWord, 'soultion_listByPage', 'show');
        const addRole = Com.hasRole(securityKeyWord, 'soultion_add', 'insert');
        const editRole = Com.hasRole(securityKeyWord, 'soultion_update', 'update');
        const getRole = Com.hasRole(securityKeyWord, 'soultion_getById', 'show');
        const {queryFlag} = this.state;
        const {dataList} = this.props;
        return (
            <div className='farming-box master-box'>
                <Card>
                    <div className='content'>
                        <div className='tableListForm'>{this.renderForm()}</div>
                        {addRole && <Row style={{marginBottom: '20px'}}>
                            <Col span={24}>
                                {addRole && <div><NavLink to={`/pages/masterdata/soultion/one/-1/add`}><Button type="primary">新增方案</Button></NavLink></div>}
                            </Col>
                        </Row>}
                        {/*<div className='table-header'>*/}
                        {/*<p><i className='iconfont icon-sort'></i><span>方案模板列表</span></p>*/}
                        {/*{addRole && <p><NavLink to={`/pages/masterdata/soultion/one/-1/add`}><Button>新增方案</Button></NavLink></p>}*/}
                        {/*</div>*/}
                        {queryRole && <Tables data={dataList} name={this.state.name} cropName={this.state.cropName} createUserName={this.state.createUserName}  modifyUserName={this.state.modifyUserName} onSizeChangequery={this.onSizeChangequery.bind(this)} onShowSizeChange={this.onShowSizeChange.bind(this)} editRole={editRole} getRole={getRole}
                                              onchooseChange={this.onchooseChange.bind(this)} queryFlag={queryFlag}/>}
                    </div>
                </Card>
                {/*<div className='farming-search'>
                <div className='farming-title'>
                    <div className='title'>方案模板</div>
                    <div className='search-layout '>
                        <div className='search-row'>
                            <div className='search-col'>
                                <span className='label-title'>方案名称</span>
                                <Input size="large" value={this.state.name} onChange={this.setName.bind(this)}/>
                            </div>
                            <div className='search-col'>
                                <span className='label-title'>创建人</span>
                                <Input size="large" value={this.state.createUserName}
                                       onChange={this.setCreateUserName.bind(this)}/>
                            </div>
                            <div className='search-col'>
                                <span className='label-title'>作物品种</span>
                                <Input size="large" value={this.state.cropName} onChange={this.setCropName.bind(this)}/>
                            </div>
                            <div className='search-col '>
                                <span className='label-title'>修改人</span>
                                <Input size="large" value={this.state.modifyUserName}
                                       onChange={this.setModifyUserName.bind(this)}/>
                            </div>
                        </div>
                    </div></div>
                </div>*/}

            </div>
        );
    }
}

const mapStateprops = (state) => {
    const {Alldate, slideName} = state.programReducer;
    const { securityKeyWord } = state.initReducer;
    //const securityKeyWord = ['soultion_listByPage','soultion_add','soultion_update','soultion_getById'];
    return {
        dataList: Alldate,//展示列表的数据
        slideName,securityKeyWord
    };
};
const WrappedNormalLoginForm = Form.create()(Resources);
export default connect(mapStateprops, action)(WrappedNormalLoginForm);
