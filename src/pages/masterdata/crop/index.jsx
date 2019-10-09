import {Component} from 'react';
import {Input, Button, Col, Row, Card, Form} from 'antd';
import Tables from './table.jsx';
import {connect} from 'react-redux';
import {action} from './model';
import ModalForm from './modalForm.jsx';
import './../index.less';
import './index.less';
import Com from '@/component/common';
import Public from '../public.js';
const FormItem = Form.Item;
class Resources extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: '',//作物名称
            no: '',//作物编号
            queryFlag: false,  //筛选按钮
            chooseId: null,
            queryRole: false,
            addRole: false,
            editRole: false,
            saveFlag: true,
            closure:null
        };
    }

    async componentDidMount() {
        await this.props.getSelestData(); //下拉框数据
        this.props.Alldatas({startPage: 1, limit: 10});  //进入页面请求列表数据
        this.props.superiorName({name: '作物', parentLeftID: -1});
        this.props.page({current: 1, pageSize: 10});
    }

    setName(event) {  //查找的表单-作物名称
        this.setState({
            name: event.target.value
        },() => {
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
          // this.setState({
          //   closure : setTimeout(() => {
          //     this.query();
          //   },800)
          // });
        });
    }

    setNo(event) {  //查找的表单-作物编号
        this.setState({
            no: event.target.value
        },() => {
          if(this.setState.setNo) {
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
            no: this.state.no,
            name: this.state.name,
            startPage: 1,
            limit: 10
        };
        this.props.queryAll(vm);
        this.props.page({current: 1, pageSize: 10});
    }

    reset() {   //重置
        this.setState({
            name: '',//作物名称
            no: ''//作物编号
        },() => {
            this.query();
        });
    }

    onSizeChangequery(current, size) {  //点击筛选的分页按钮
        this.setState({
            queryFlag: true //控制分页的展示
        });
        const vm = {
            no: this.state.no,
            name: this.state.name,
            startPage: current,
            limit: size
        };
        this.props.queryAll(vm);
    }
    onShowSizeChange(current, size) {  //点击筛选的分页按钮
        this.setState({
            queryFlag: true //控制分页的展示
        });
        const vm = {
            no: this.state.no,
            name: this.state.name,
            startPage: 1,
            limit: size
        };
        this.props.queryAll(vm);
    }

    addmodel() {   //增加的按钮
        this.props.modal({modalFlag: true, modeltype: 'add',addFlag:true,oldPeriod:[]});
        this.props.old({oldPeriod:[]});
        this.props.defaultFields({
            // 下拉框
            allUnit: {
                value: this.props.allUnit.data
            },
            allCategory: {
                value: this.props.allCategory.data
            },
            allGrade: {
                value: this.props.allGrade.data
            },
            allPeriod: {
                value: this.props.allPeriod.data
            },
            name: {
                value: ''
            },
            no: {
                value: ''
            },
            unit: {
                value: ''
            },
            categoryOne: {
                value: ''
            },
            categoryTwo: {
                value: ''
            },
            grade: {
                value: ''
            },
            createUserName: {
                value: ''
            },
            OKlist:[],
            deleteList:[],
            list: {
                value: []
            },
          periodList: [],
          keyList:[],
            modeltype: {
                value: 'add'
            }
        });
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

    async checkName(name,id,type) {
        if(this.state.closure) {
            clearTimeout(this.state.closure);
        }
        this.setState({
            closure : setTimeout(() => {
                const saveFlag = Public.checkName(name,id,type);
                saveFlag.then((resolve) => {
                    this.setState({
                        saveFlag:resolve
                    });
                });
            },800)
        });
    }
    renderSimpleForm() {
        return (
            <Form layout="inline">
                <Row gutter={{md: 8, lg: 24, xl: 48}}>
                    <Col md={8} sm={24}>
                        <FormItem label="作物名称">
                            <Input value={this.state.name} onChange={this.setName.bind(this)}/>
                        </FormItem>
                    </Col>
                    <Col md={8} sm={24}>
                        <FormItem label="作物编号">
                            <Input value={this.state.no} onChange={this.setNo.bind(this)}/>
                        </FormItem>
                    </Col>
                    <Col md={8} sm={24} style={{textAlign:'right'}}>
                        <span className='submitButtons'>
                          <Button type="primary" onClick={this.query.bind(this)}>
                            查询
                          </Button>
                          <Button style={{marginLeft: 8}} onClick={this.reset.bind(this)}>
                            重置
                          </Button>
                        </span>
                    </Col>
                </Row>
            </Form>
        );
    }
    renderForm() {
        return this.renderSimpleForm();
    }
    render() {
        const {securityKeyWord} = this.props;
        const queryRole = Com.hasRole(securityKeyWord, 'crop_listByPage', 'show');
        const addRole = Com.hasRole(securityKeyWord, 'crop_add', 'insert');
        const editRole = Com.hasRole(securityKeyWord, 'crop_update', 'update');
        const {queryFlag} = this.state;
        const {dataList} = this.props;
        return (
            <div className='farming-box master-box'>
                <Card>
                    <div className='content'>
                        <div className='tableListForm'>{this.renderForm()}</div>
                        { addRole && <Row style={{marginBottom : '20px'}}>
                            <Col span={24}>
                                {addRole && <Button type="primary" onClick={this.addmodel.bind(this)}>新增作物</Button>}
                            </Col>
                        </Row>}
                        {/*<div className='table-header'>*/}
                        {/*<p><i className='iconfont icon-sort'></i><span>作物维护列表</span></p>*/}
                        {/*{addRole && <p><Button onClick={this.addmodel.bind(this)}>新增作物</Button></p>}*/}
                        {/*</div>*/}
                        {queryRole && <Tables data={dataList} name={this.state.name} no={this.state.no} onSizeChangequery={this.onSizeChangequery.bind(this)}
                                              onShowSizeChange={this.onShowSizeChange.bind(this)}
                                              onchooseChange={this.onchooseChange.bind(this)} queryFlag={queryFlag} editRole={editRole}/>}
                        <ModalForm names={this.state.name} nos={this.state.no}props={this.props} checkName={this.checkName.bind(this)} queryRole={queryRole} saveFlag={this.state.saveFlag}/>
                    </div>
                </Card>
                {/*<div className='farming-search'>
                    <div className='farming-title'>
                  <div className='title'>作物维护</div>
                  <div className='search-layout search-layout-2'>
                        <div className='search-row'>
                            <div className='search-col'>
                                <span className='label-title'>作物名称</span>
                                <Input size="large" value={this.state.name} onChange={this.setName.bind(this)}/>
                            </div>
                            <div className='search-col'>
                                <span className='label-title'>作物编号</span>
                                <Input size="large" value={this.state.no} onChange={this.setNo.bind(this)}/>
                            </div>
                        </div>
                  </div></div>
                </div>*/}

            </div>
        );
    }
}

const mapStateprops = (state) => {
    const {allUnit, allCategory, allGrade, allPeriod, Alldate, slideName} = state.cropReducer;
    const { securityKeyWord } = state.initReducer;
   // const securityKeyWord = ['crop_listByPage','crop_add','crop_update'];
    return {
        allUnit: allUnit,
        allPeriod: allPeriod,
        allCategory: allCategory,
        allGrade: allGrade,
        dataList: Alldate,//展示列表的数据
        slideName,
        securityKeyWord
    };
};
const WrappedNormalLoginForm = Form.create()(Resources);
export default connect(mapStateprops, action)(WrappedNormalLoginForm);
