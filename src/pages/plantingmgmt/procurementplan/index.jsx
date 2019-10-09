import React, {Component} from 'react';
import {Input, Button, Select, DatePicker, message, Modal, LocaleProvider, Row, Col, Card, Form, Icon} from 'antd';
import Tables from './table.jsx';
import TablesWait from './tableWait.jsx';
import {connect} from 'react-redux';
import moment from 'moment';
import 'moment/locale/zh-cn';
import {action, IOModel} from './model';
import '../../index.less';
import './index.less';
import Utils from "@/pages/plantingmgmt/farmingplan/util";
import Com from '@/component/common';
import _ from "lodash";
import zhCN from 'antd/lib/locale-provider/zh_CN';

moment.locale('zh-cn');
const {RangePicker} = DatePicker;
const FormItem = Form.Item;
class ProcurementPlan extends Component {
    constructor(props) {
        super(props);
        this.state = {
            operationName: '',//操作名称
            agriculturalType: '',//农事类型
            status: [1,2,3],
            planCode: '',
            userName: '',
            materialName: '',
            queryFlag: false,  //筛选按钮
            chooseId: null,
            task: ['待采农资列表', '采购计划列表'],
            currentIndex: 1,
            timeStart: moment(new Date(), 'YYYY-MM-DD'),
            timeEnd: moment(new Date(), 'YYYY-MM-DD').add(3, 'months'),
            timeStartCreate: moment(new Date(), 'YYYY-MM-DD').add(-3, 'months'),
            timeEndCreate: moment(new Date(), 'YYYY-MM-DD'),
            selectedRowKeys: [],//表格多选
            selectedRows: [],
            loading: false,
            allStatus: [],
            queryRole: false,
            queryMaterialRole: false,
            addRole: false,
            editRole: false,
            getRole: false,
            closure: false,
            disabled: true,
            expandForm: false
        };
    }

    async componentDidMount() {
        //this.props.AllStatusQuery(); //状态数据字典
        await IOModel.GetAllStatus().then(res => {
            if (res.success) {
                const data = res.data || [];
                this.setState({
                    allStatus: data
                });
            }
        }).catch();
        this.props.Alldatas({
            statrTime: new Date(this.state.timeStart).getTime(),
            endTime: new Date(this.state.timeEnd).getTime(),
            startPage: 1,
            limit: 10
        });  //进入页面请求列表数据
        this.props.page({current: 1, pageSize: 10});
        this.props.superiorName({name: '采购计划', parentLeftID: -1});
        const params = _.replace(this.props.location.pathname, '/pages/plantingmgmt/procurementplan', '');
        const index = parseInt(_.replace(params, '/', ''));
        if (params) {
            await this.setState({
                currentIndex: index
            });
        }
        if (index === 2) {
            this.query();
        }
    }

    setMaterialName(event) {  //查找的表单-用户名称
        this.setState({
            materialName: event.target.value
        });
        //this.query();
    }

    setPlanCode(event) {
        this.setState({
            planCode: event.target.value
        });
        //this.query();
    }

    setUserName(event) {
        this.setState({
            userName: event.target.value
        });
        //this.query();
    }

    setStatus(event) {  //查找的表单-状态多选
        if (event) {
            event = [event];
        } else {
            event = [1,2,3];
        }
        this.setState({
            status: event
        });
        //this.query();
    }

    query() {  //查询按钮
        this.setState({
            queryFlag: true //控制分页的展示
        }, () => {
            if (this.state.closure) {
                clearTimeout(this.state.closure);
            }
            let vm = {};
            if (this.state.currentIndex === 1) { // 查询待采购列表
                vm = {
                    startPage: 1,
                    limit: 10,
                    materialName: this.state.materialName,
                    statrTime: this.state.timeEnd ? new Date(this.state.timeStart).getTime() : undefined,
                    endTime: this.state.timeEnd ? new Date(this.state.timeEnd).getTime() : undefined,
                    workPlanCode: this.state.planCode
                };
            } else { // 查询采购计划列表
                vm = {
                    startPage: 1,
                    limit: 10,
                    userName: this.state.userName,
                    statrTime: this.state.timeEndCreate ? new Date(this.state.timeStartCreate).getTime() : undefined,
                    endTime: this.state.timeEndCreate ? new Date(this.state.timeEndCreate).getTime() : undefined,
                    workPlanCode: this.state.planCode,
                    statusIds: JSON.stringify(this.state.status)
                };
            }
            this.setState({
                closure: setTimeout(() => {
                    if (this.state.currentIndex === 1) {
                        this.props.queryAll(vm);
                    } else {
                        this.props.queryAllProcurement(vm);
                    }
                    this.props.page({current: 1, pageSize: 10});
                }, 800)
            });
        });
    }
    reset() {
        this.setState({
            timeStart: moment(new Date(), 'YYYY-MM-DD'),
            timeEnd: moment(new Date(), 'YYYY-MM-DD').add(3, 'months'),
            timeStartCreate: moment(new Date(), 'YYYY-MM-DD').add(-3, 'months'),
            timeEndCreate: moment(new Date(), 'YYYY-MM-DD'),
            planCode: '',
            userName: '',
            materialName: '',
            status: [1,2,3]
        },() => {
            this.query();
        });
    }

    onSizeChangequery(current, size) {  //点击筛选的分页按钮
        this.setState({
            queryFlag: true //控制分页的展示
        });
        this.props.page({current: current, pageSize: size});
        if (this.state.currentIndex === 1) { // 查询待采购列表
            const vm = {
                startPage: current,
                limit: size,
                materialName: this.state.materialName,
                statrTime: new Date(this.state.timeStart).getTime(),
                endTime: new Date(this.state.timeEnd).getTime(),
                workPlanCode: this.state.planCode
            };
            this.props.queryAll(vm);
        } else { // 查询采购计划列表
            const vm = {
                startPage: current,
                limit: size,
                userName: this.state.userName,
                statrTime: this.state.timeEndCreate ? new Date(this.state.timeStartCreate).getTime() : undefined,
                endTime: this.state.timeEndCreate ? new Date(this.state.timeEndCreate).getTime() : undefined,
                workPlanCode: this.state.planCode,
                statusIds: JSON.stringify(this.state.status)
            };
            this.props.queryAllProcurement(vm);
        }
    }
    onShowSizeChange(current, size) {  //点击筛选的分页按钮
        this.setState({
            queryFlag: true //控制分页的展示
        });
        this.props.page({current: 1, pageSize: size});
        if (this.state.currentIndex === 1) { // 查询待采购列表
            const vm = {
                startPage: 1,
                limit: size,
                materialName: this.state.materialName,
                statrTime: new Date(this.state.timeStart).getTime(),
                endTime: new Date(this.state.timeEnd).getTime(),
                workPlanCode: this.state.planCode
            };
            this.props.queryAll(vm);
        } else { // 查询采购计划列表
            const vm = {
                startPage: 1,
                limit: size,
                userName: this.state.userName,
                statrTime: this.state.timeEndCreate ? new Date(this.state.timeStartCreate).getTime() : undefined,
                endTime: this.state.timeEndCreate ? new Date(this.state.timeEndCreate).getTime() : undefined,
                workPlanCode: this.state.planCode,
                statusIds: JSON.stringify(this.state.status)
            };
            this.props.queryAllProcurement(vm);
        }
    }

    //创建采购计划
    addmodel() {   //增加的按钮
        //hashHistory.push('/farming_admin/planDetail/modify/123');
        const {selectedRows} = this.state;
        const list = [];
        selectedRows.forEach((item) => {
            const obj = {
                id: item.id,
                materialId: item.materialId,
                planId: item.planId,
                plannedQty: item.plannedQty
            };
            list.push(obj);
        });
        const {securityKeyWord} = this.props;
        const getRole = Com.hasRole(securityKeyWord, 'procurementplan_getById', 'show');
        const vm = {
            companyId: 1,
            materialsList: JSON.stringify(list)
        };
        IOModel.Adddata(vm).then((res) => {
            if (res.success) {
                message.success("新增成功");
                this.props.defaultFields({
                    currentId: 123
                });
                if (getRole) {
                    this.props.history.push(`/pages/plantingmgmt/procurementplan/detail/modify/${res.data}`);
                } else {
                    this.props.history.push(`/pages/plantingmgmt/procurementplan/index`);
                }
            }
        }).catch((res) => {
            Modal.error({
                title: '提示',
                content: res.message
            });
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

    onSelectChange(selectedRowKeys, selectedRows) {
        this.setState({selectedRowKeys, selectedRows});
        if (selectedRowKeys.length > 0) {
            this.setState({
                disabled: false
            });
        }else {
            this.setState({
                disabled: true
            });
        }
    }

    async handleTask(index) {
        const {timeStartCreate, timeEndCreate,timeStart, timeEnd, status} = this.state;
        await this.setState({
            currentIndex: index
        });
        await this.props.page({current: 1, pageSize: 10});
        await this.setState({
            materialName: '',
            userName: '',
            timeStartCreate: moment(new Date(), 'YYYY-MM-DD').add(-3, 'months'),
            timeEndCreate: moment(new Date(), 'YYYY-MM-DD'),
            planCode: '',
            timeStart: moment(new Date(), 'YYYY-MM-DD'),
            timeEnd: moment(new Date(), 'YYYY-MM-DD').add(3, 'months')
        });
        if (index === 2) {
            //第一次查询
            const vm = {
                startPage: 1,
                limit: 10,
                statrTime: timeStartCreate ? new Date(timeStartCreate).getTime() : undefined,
                endTime: timeEndCreate ? new Date(timeEndCreate).getTime() : undefined,
                statusIds: JSON.stringify(status)
            };
            await this.props.queryAllProcurement(vm);
        } else {
            await this.props.Alldatas({
                startPage: 1,
                limit: 10,
                statrTime: timeStart ? new Date(timeStart).getTime() : undefined,
                endTime: timeEnd ? new Date(timeEnd).getTime() : undefined
            });
        }
    }

    dateChange(date) {
        if (date !== null && date.length > 0) {
            const timeStart = moment(date[0]).format('YYYY-MM-DD');
            const timeEnd = moment(date[1]).format('YYYY-MM-DD');
            if (this.state.currentIndex === 1) {
                this.setState({
                    timeStart,
                    timeEnd
                });
            } else {
                this.setState({
                    timeStartCreate: timeStart,
                    timeEndCreate: timeEnd
                });
            }
        } else {
            if (this.state.currentIndex === 1) {
                this.setState({
                    timeStart: '',
                    timeEnd: ''
                });
            } else {
                this.setState({
                    timeStartCreate: '',
                    timeEndCreate: ''
                });
            }
        }
        //this.query();
    }
    toggleForm() {
        const {expandForm} = this.state;
        this.setState({
            expandForm: !expandForm
        });
    }
    renderSimpleForm() {
        const {
            securityKeyWord
        } = this.props;
        const {timeStart,timeEnd,currentIndex,timeStartCreate, timeEndCreate} = this.state;
        const queryMaterialRole = Com.hasRole(securityKeyWord, 'procurementplan_material_listByPage', 'show');
        const queryRole = Com.hasRole(securityKeyWord, 'procurementplan_listByPage', 'show');
        return (
            <Form layout="inline">
                {
                    currentIndex === 1 && <Row gutter={{md: 8, lg: 24, xl: 48}}>
                        <Col md={8} sm={24}>
                            <FormItem label="农资日期范围">
                                    <LocaleProvider locale={zhCN}>
                                        <RangePicker className='rangePicker-farmAnalysis' style={{marginRight: '10px'}}
                                                     value={timeStart ? [moment(timeStart), moment(timeEnd)] : []}
                                                     onChange={this.dateChange.bind(this)}/>
                                       {/* <RangePicker onChange={this.dateChange.bind(this)}
                                                     value={[timeStart,timeEnd]}/>*/}
                                    </LocaleProvider>
                            </FormItem>
                        </Col>
                        {
                            queryMaterialRole && <Col md={8} sm={24}>
                                <FormItem label="种植计划编号">
                                        <Input value={this.state.planCode} onChange={this.setPlanCode.bind(this)}/>
                                </FormItem>
                            </Col>
                        }
                        <Col md={queryMaterialRole ? 8: 16} sm={24} style={{textAlign: 'right'}}>
                        <span className='submitButtons'>
                          <Button type="primary" onClick={this.query.bind(this)}>
                            查询
                          </Button>
                          <Button style={{marginLeft: 8}} onClick={this.reset.bind(this)}>
                            重置
                          </Button>
                            {
                                queryMaterialRole && <a style={{marginLeft: 8}} onClick={this.toggleForm.bind(this)}>
                                    展开 <Icon type="down"/>
                                </a>
                            }
                        </span>
                        </Col>
                    </Row>
                }
                {
                    currentIndex === 2 && <Row gutter={{md: 8, lg: 24, xl: 48}}>
                        <Col md={8} sm={24}>
                            <FormItem label="创建日期范围">
                                    <LocaleProvider locale={zhCN}>
                                        <RangePicker className='rangePicker-farmAnalysis' style={{marginRight: '10px'}}
                                                     value={timeStartCreate ? [moment(timeStartCreate), moment(timeEndCreate)] : []}
                                                     onChange={this.dateChange.bind(this)}/>
                                        {/*<RangePicker onChange={this.dateChange.bind(this)}
                                                     value={[timeStartCreate, timeEndCreate]}/>*/}
                                    </LocaleProvider>
                            </FormItem>
                        </Col>
                        {
                            queryRole && <Col md={8} sm={24}>
                                <FormItem label="采购计划编号">
                                        <Input value={this.state.planCode} onChange={this.setPlanCode.bind(this)}/>
                                </FormItem>
                            </Col>
                        }
                        <Col md={queryRole ? 8: 16} sm={24} style={{textAlign: 'right'}}>
                        <span className='submitButtons'>
                          <Button type="primary" onClick={this.query.bind(this)}>
                            查询
                          </Button>
                          <Button style={{marginLeft: 8}} onClick={this.reset.bind(this)}>
                            重置
                          </Button>
                            {
                                queryRole &&  <a style={{marginLeft: 8}} onClick={this.toggleForm.bind(this)}>
                                    展开 <Icon type="down"/>
                                </a>
                            }
                        </span>
                        </Col>
                    </Row>
                }
            </Form>
        );
    }

    renderAdvancedForm() {
        const {timeStart,timeEnd,currentIndex,timeStartCreate, timeEndCreate,allStatus} = this.state;
        const statusList = [{id: '', name: '全部'}];
        allStatus.forEach((item) => {
            statusList.push(item);
        });
        const statusOptions = Utils.getOptionList(statusList);
        let statusIndex = '';
        if (this.state.status && this.state.status.length === 1) {
            statusIndex = this.state.status;
        }
        return (
            <Form layout="inline">
                {
                    currentIndex === 1 && <Row gutter={{md: 8, lg: 24, xl: 48}}>
                        <Col md={8} sm={24}>
                            <FormItem label="农资日期范围">
                                    <LocaleProvider locale={zhCN}>
                                        <RangePicker className='rangePicker-farmAnalysis' style={{marginRight: '10px'}}
                                                     value={timeStart ? [moment(timeStart), moment(timeEnd)] : []}
                                                     onChange={this.dateChange.bind(this)}/>
                                        {/*<RangePicker onChange={this.dateChange.bind(this)}
                                                     value={[timeStart,timeEnd]}/>*/}
                                    </LocaleProvider>
                            </FormItem>
                        </Col>
                        <Col md={8} sm={24}>
                            <FormItem label="种植计划编号">
                                    <Input value={this.state.planCode} onChange={this.setPlanCode.bind(this)}/>
                            </FormItem>
                        </Col>
                        <Col md={8} sm={24}>
                            <FormItem label="农资名称">
                                    <Input value={this.state.materialName} onChange={this.setMaterialName.bind(this)}/>
                            </FormItem>
                        </Col>
                        <Col span={24} style={{textAlign: 'right'}}>
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
                }
                {
                    currentIndex === 2 &&  <Row gutter={{md: 8, lg: 24, xl: 48}}>
                        <Col md={8} sm={24}>
                            <FormItem label="创建日期范围">
                                    <LocaleProvider locale={zhCN}>
                                        <RangePicker className='rangePicker-farmAnalysis' style={{marginRight: '10px'}}
                                                     value={timeStartCreate ? [moment(timeStartCreate), moment(timeEndCreate)] : []}
                                                     onChange={this.dateChange.bind(this)}/>
                                        {/*<RangePicker onChange={this.dateChange.bind(this)}
                                                     value={[timeStartCreate, timeEndCreate]}/>*/}
                                    </LocaleProvider>
                            </FormItem>
                        </Col>
                        <Col md={8} sm={24}>
                            <FormItem label="采购计划编号">
                                    <Input value={this.state.planCode} onChange={this.setPlanCode.bind(this)}/>
                            </FormItem>
                        </Col>
                        <Col md={8} sm={24}>
                            <FormItem label="创建人">
                                    <Input value={this.state.userName} onChange={this.setUserName.bind(this)}/>
                            </FormItem>
                        </Col>
                        <Col md={8} sm={24}>
                            <FormItem label="状态">
                                        <Select value={statusIndex} onChange={this.setStatus.bind(this)}>
                                            {statusOptions}
                                        </Select>
                                </FormItem>
                        </Col>
                        <Col span={16} style={{textAlign: 'right'}}>
                            <span className='submitButtons'>
                              <Button type="primary" onClick={this.query.bind(this)}>
                                查询
                              </Button>
                              <Button style={{marginLeft: 8}} onClick={this.reset.bind(this)}>
                                重置
                              </Button>
                              <a style={{marginLeft: 8}} onClick={this.toggleForm.bind(this)}>
                                收起 <Icon type="up"/>
                              </a>
                            </span>
                        </Col>
                    </Row>
                }
            </Form>
        );
    }
    renderForm() {
        const {expandForm,currentIndex} = this.state;
        const { securityKeyWord } = this.props;
        const queryMaterialRole = Com.hasRole(securityKeyWord, 'procurementplan_material_listByPage', 'show');
        const queryRole = Com.hasRole(securityKeyWord, 'procurementplan_listByPage', 'show');
        if(currentIndex === 1) {
            return expandForm && queryMaterialRole ? this.renderAdvancedForm() : this.renderSimpleForm();
        } else if(currentIndex === 2) {
            return expandForm && queryRole ? this.renderAdvancedForm() : this.renderSimpleForm();
        }
    }

    render() {
        const {securityKeyWord} = this.props;
        const queryRole = Com.hasRole(securityKeyWord, 'procurementplan_listByPage', 'show');
        const queryMaterialRole = Com.hasRole(securityKeyWord, 'procurementplan_material_listByPage', 'show');
        const editRole = Com.hasRole(securityKeyWord, 'procurementplan_update', 'update');
        const addRole = Com.hasRole(securityKeyWord, 'procurementplan_add', 'insert');
        const getRole = Com.hasRole(securityKeyWord, 'procurementplan_getById', 'show');
        const {queryFlag, currentIndex, allStatus} = this.state;
        const {dataList, dataProList, user} = this.props;
        const statusList = [{id: '', name: '全部'}];
        allStatus.forEach((item) => {
            statusList.push(item);
        });
        return (
                <div className='farming-tab-list'>
                    <Card bordered={false}>
                        <div className='farming-top'>
                            <div className='nav-ul title-navul'>
                                <ul>
                                    {this.state.task.map((item, index) => {
                                        return <li key={index}
                                                   className={index + 1 === this.state.currentIndex ? 'active-nav' : ''}
                                                   onClick={this.handleTask.bind(this, index + 1)}><span>{item}</span></li>;
                                    })}
                                </ul>
                            </div>
                        </div>
                        <div className='farming-box procurement-box'>
                            <div className='tableList'>
                                <div className='tableListForm'>
                                    {
                                        this.renderForm()
                                    }
                                </div>
                            </div>
                            <div className='content'>
                                {
                                    currentIndex === 1 && (
                                        <div>
                                            {
                                                addRole && <Row style={{marginBottom: '20px'}}>
                                                    <Col span={24}>
                                                        <div><Button type="primary" onClick={this.addmodel.bind(this)} disabled={this.state.disabled}>新增采购计划 </Button></div>
                                                    </Col>
                                                </Row>
                                            }
                                            {/*<div className='table-header'>*/}
                                            {/*<p><i className='iconfont icon-sort'></i><span>待采农资列表</span></p>*/}
                                            {/*{addRole && <p><Button onClick={this.addmodel.bind(this)} disabled={this.state.disabled} className={this.state.disabled?'null':'active'}>新增采购计划 </Button></p>}*/}
                                            {/*</div>*/}
                                            {queryMaterialRole &&
                                            <LocaleProvider locale={zhCN}>
                                                <TablesWait data={dataList} onSelectChange={this.onSelectChange.bind(this)}
                                                            onSizeChangequery={this.onSizeChangequery.bind(this)}
                                                            onShowSizeChange={this.onShowSizeChange.bind(this)}
                                                            onchooseChange={this.onchooseChange.bind(this)} queryFlag={queryFlag}/>
                                            </LocaleProvider>}
                                        </div>)
                                }
                                {
                                    currentIndex === 2 &&
                                    <div>
                                        {queryRole &&
                                        <LocaleProvider locale={zhCN}>
                                            <Tables data={dataProList} onSizeChangequery={this.onSizeChangequery.bind(this)}
                                                    onShowSizeChange={this.onShowSizeChange.bind(this)}
                                                    editRole={editRole} getRole={getRole} user={user}
                                                    onchooseChange={this.onchooseChange.bind(this)} queryFlag={queryFlag}/>
                                        </LocaleProvider>}
                                    </div>
                                }
                            </div>
                        </div>
                    </Card>
                </div>
        );
    }
}

const mapStateprops = (state) => {
    const {Alldate, slideName, modalflag, statusDic, AlldataPro} = state.procurementplanReducer;
    const { securityKeyWord } = state.initReducer;
    //const securityKeyWord = ['procurementplan_listByPage', 'procurementplan_material_listByPage', 'procurementplan_update', 'procurementplan_add', 'procurementplan_getById'];
    return {
        dataList: Alldate,//展示列表的数据
        dataProList: AlldataPro,
        statusList: statusDic,
        slideName,
        modalflag, securityKeyWord
    };
};
const WrappedNormalLoginForm = Form.create()(ProcurementPlan);
export default connect(mapStateprops, action)(WrappedNormalLoginForm);
