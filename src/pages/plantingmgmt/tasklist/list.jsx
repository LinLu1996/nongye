import {Component} from 'react';
import {Input, Select, DatePicker, LocaleProvider, Form, Row, Col, Button, Icon} from 'antd';
import Tables from './table.jsx';
import {connect} from 'react-redux';
import {action} from './model';
import ModalForm from './modalForm.jsx';
import ModalFormDetails from './modalFormDetails.jsx';
import '../../index.less';
import './index.less';
import Utils from "@/pages/plantingmgmt/farmingplan/util";
import zhCN from 'antd/lib/locale-provider/zh_CN';
import moment from "moment";
import Com from '@/component/common';


const {RangePicker} = DatePicker;
const FormItem = Form.Item;

class Resources extends Component {
    constructor(props) {
        super(props);
        this.state = {
            operationName: '',//操作名称
            agriculturalType: '',//农事类型
            queryFlag: false,  //筛选按钮
            chooseId: null,
            task: ['任务数', '已完成', '待执行', '超时'],
            currentIndex: 1,
            timeStart: moment(new Date(), 'YYYY-MM-DD').add(-1, 'months'),
            timeEnd: moment(new Date(), 'YYYY-MM-DD').add(3, 'months'),
            planCode: '',
            baseId: -1,//基地ID
            landId: -1,//地块ID
            cropId: -1,//作物ID
            workTypeId: -1,
            taskStatus: 0,
            queryRole: false,
            addRole: false,
            editRole: false,
            getRole: false,
            closure: false,
            expandForm: false
        };
    }

    componentDidMount() {
        const {securityKeyWord} = this.props;
        this.props.getCompanyBase();
        this.props.getCompanyCrop();
        const queryRole = Com.hasRole(securityKeyWord, 'tasklist_listByPage');
        const editRole = Com.hasRole(securityKeyWord, 'tasklist_update');
        const getRole = Com.hasRole(securityKeyWord, 'tasklist_getById');
        this.setState({queryRole, editRole, getRole});
        if (queryRole) {
            const vm = {
                startPage: 1,
                limit: 10,
                companyId: 1,
                taskStatus: 0,
                beginTime: this.state.timeStart ? moment(this.state.timeStart).format('YYYY-MM-DD') : '',
                endTime: this.state.timeEnd ? moment(this.state.timeEnd).add(1, 'days').format('YYYY-MM-DD') : ''
            };
            const str = JSON.stringify(vm);
            this.props.Alldatas({str: str});  //进入页面请求列表数据
        }
        this.props.AllWorkTypeQuery();
        this.props.superiorName({name: '基地', parentLeftID: -1});
    }

    setFunctionary(event) {  //查找的表单-用户名称
        this.setState({
            functionary: event.target.value
        });
    }

    setPlanCodeName(event) {
        this.setState({
            planCode: event.target.value
        });
        //this.query();
    }

    setCropName(event) {
        this.setState({
            cropName: event.target.value
        });
        this.query(this.state.landId,this.state.cropId,this.state.baseId,this.state.planCode);
    }

    setWorkType(value) {
        this.setState({
            workTypeId: value
        });
        //this.query();
    }

    setOperationName(event) {  //查找的表单-基地名称
        this.setState({
            operationName: event.target.value
        });
    }

    setFarmingType(event) {  //查找的表单-基地名称
        this.setState({
            farmingType: event.target.value
        });
    }
    listdata(landId,cropId,baseId,planCode) {
        const vm = {
            startPage: 1,
            limit: 10,
            companyId: 1,
            taskStatus: this.state.taskStatus,
            beginTime: this.state.timeStart ? moment(this.state.timeStart).format('YYYY-MM-DD') : '',
            endTime: this.state.timeEnd ? moment(this.state.timeEnd).add(1, 'days').format('YYYY-MM-DD') : '',
            planCode: planCode,
            baseId: baseId === -1 ? undefined : baseId,
            landId: landId === -1 ? undefined : landId,
            cropId: cropId === -1 ? undefined : cropId,
            workTypeId: this.state.workTypeId === -1 ? undefined : this.state.workTypeId
        };
        return vm;
    }
    query() {  //查询按钮
        this.setState({
            queryFlag: true //控制分页的展示
        }, () => {
            if (this.state.closure) {
                clearTimeout(this.state.closure);
            }
            this.setState({
                closure: setTimeout(() => {
                    const vm = this.listdata(this.state.landId,this.state.cropId,this.state.baseId,this.state.planCode);
                    const str = JSON.stringify(vm);
                    this.props.queryAll({str: str});
                    this.props.page({current: 1, pageSize: 10});
                }, 800)
            });
        });
    }
    /*query() {
        this.setState({
            queryFlag:true
        });
        const vm = this.listdata(this.state.landId,this.state.cropId,this.state.baseId,this.state.planCode);
        const str = JSON.stringify(vm);
        this.props.queryAll({str: str});
        this.props.page({current: 1, pageSize: 10});
    }*/
    reset() {
        this.setState({
            timeStart: moment(new Date(), 'YYYY-MM-DD').add(-1, 'months'),
            timeEnd: moment(new Date(), 'YYYY-MM-DD').add(3, 'months'),
            baseId: -1,//基地ID
            landId: -1,//地块ID
            cropId: -1,//作物ID
            workTypeId: -1,
            planCode: ''
        });
        this.query();
    }
    onSizeChangequery(current, size) {  //点击筛选的分页按钮
        const vm = {
            startPage: current,
            limit: size,
            companyId: 1,
            taskStatus: this.state.taskStatus,
            beginTime: this.state.timeStart ? moment(this.state.timeStart).format('YYYY-MM-DD') : '',
            endTime: this.state.timeEnd ? moment(this.state.timeEnd).add(1, 'days').format('YYYY-MM-DD') : '',
            planCode: this.state.planCode,
            baseId: this.state.baseId === -1 ? undefined : this.state.baseId,
            landId: this.state.landId === -1 ? undefined : this.state.landId,
            cropId: this.state.cropId === -1 ? undefined : this.state.cropId,
            workTypeId: this.state.workTypeId === -1 ? undefined : this.state.workTypeId
        };
        const str = JSON.stringify(vm);
        this.props.queryAll({str: str});
        this.props.page({current: current, pageSize: size});
    }
    onShowSizeChange(current, size) {  //点击筛选的分页按钮
        const vm = {
            startPage: 1,
            limit: size,
            companyId: 1,
            taskStatus: this.state.taskStatus,
            beginTime: this.state.timeStart ? moment(this.state.timeStart).format('YYYY-MM-DD') : '',
            endTime: this.state.timeEnd ? moment(this.state.timeEnd).add(1, 'days').format('YYYY-MM-DD') : '',
            planCode: this.state.planCode,
            baseId: this.state.baseId === -1 ? undefined : this.state.baseId,
            landId: this.state.landId === -1 ? undefined : this.state.landId,
            cropId: this.state.cropId === -1 ? undefined : this.state.cropId,
            workTypeId: this.state.workTypeId === -1 ? undefined : this.state.workTypeId
        };
        const str = JSON.stringify(vm);
        this.props.queryAll({str: str});
        this.props.page({current: 1, pageSize: size});
    }

    addmodel() {   //增加的按钮
        this.props.modal({modalFlag: true, modeltype: 'add'});
        this.props.defaultFields({
            operationName: {
                value: ''
            },
            id: {
                value: ''
            },
            name: {
                value: ''
            },
            agriculturalType: {
                value: ''
            },
            inhibitionPeriod: {
                value: ''
            },
            consumption: {
                value: ''
            },
            stauts: {
                value: ''
            },
            createName: {
                value: ''
            },
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
        this.props.page({current: current, pageSize: size});
    }

    handleTask(index) {
        this.setState({
            currentIndex: index
        });
        let taskStatus = 0;
        if (index === 1) { //全部
            this.setState({
                taskStatus: 0
            });
            taskStatus = 0;
        } else if (index === 2) { //已完成
            this.setState({
                taskStatus: 1
            });
            taskStatus = 1;
        } else if (index === 3) { //待执行
            this.setState({
                taskStatus: 2
            });
            taskStatus = 2;
        } else if (index === 4) { //超时
            this.setState({
                taskStatus: 3
            });
            taskStatus = 3;
        }
        this.setState({
            queryFlag: true //控制分页的展示
        });
        this.props.clearData();
        const vm = {
            startPage: 1,
            limit: 10,
            userId: 1,
            companyId: 1,
            taskStatus: taskStatus,
            beginTime: this.state.timeStart ? moment(this.state.timeStart).format('YYYY-MM-DD') : '',
            endTime: this.state.timeEnd ? moment(this.state.timeEnd).add(1, 'days').format('YYYY-MM-DD') : '',
            planCode: this.state.planCode,
            baseId: this.state.baseId === -1 ? undefined : this.state.baseId,
            landId: this.state.landId === -1 ? undefined : this.state.landId,
            cropId: this.state.cropId === -1 ? undefined : this.state.cropId,
            workTypeId: this.state.workTypeId === -1 ? undefined : this.state.workTypeId
        };
        const str = JSON.stringify(vm);
        this.props.queryAll({str: str});
        this.props.page({current: 1, pageSize: 10});
    }

    dateChange(date) {
        if (date && date.length > 0) {
            const timeStart = date[0];
            const timeEnd = date[1];
            this.setState({
                timeStart,
                timeEnd
            });
        } else {
            this.setState({
                timeStart: '',
                timeEnd: ''
            });
        }
        //this.query();
    }
    handleBase(value) {
        this.setState({
            baseId: value,
            landId: ''
        });
        const {baseList} = this.props;
        if (baseList && baseList.length > 0) {
            const bases = baseList.filter((item) => {
                return item.id === value;
            });
            if (bases && bases.length > 0) {
                this.setState({
                    base: bases[0]
                });
            }
        }
        this.props.getBaseLand(value);
        this.setState({
            landId: -1,
            cropId: -1
        });
        //this.query(-1,-1,value,this.state.planCode);
    }
    setLand(event) {  //查找的表单-基地名称
        this.setState({
            landId: event
        });
        //this.query(event,this.state.cropId,this.state.baseId,this.state.planCode);
    }
    handleC() {
    }
    setCrops(event) {  //查找的表单-基地名称
        this.setState({
            cropId: event
        });
        //this.query(this.state.landId,event,this.state.baseId,this.state.planCode);
    }
    toggleForm() {
        const {expandForm} = this.state;
        this.setState({
            expandForm: !expandForm
        });
    }
    renderSimpleForm() {
        const {
            baseList
        } = this.props;
        const newBaseList = [];
        newBaseList.push({id: -1, name: '全部'});
        baseList.forEach((item) => {
            newBaseList.push(item);
        });
        const newBaseOptions = Utils.getOptionList(newBaseList);
        return (
            <Form layout="inline">
                <Row gutter={{md: 8, lg: 24, xl: 48}}>
                    <Col md={8} sm={24}>
                        <FormItem label="日期范围">
                                <LocaleProvider locale={zhCN}>
                                <RangePicker value={this.state.timeStart?[this.state.timeStart, this.state.timeEnd]:[]}
                                             onChange={this.dateChange.bind(this)}/>
                                </LocaleProvider>
                        </FormItem>
                    </Col>
                    <Col md={8} sm={24}>
                        <FormItem label="基地">
                                <Select value={this.state.baseId} onChange={this.handleBase.bind(this)}
                                        showSearch
                                        placeholder="请选择基地"
                                        optionFilterProp="children"
                                        filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}>
                                    {newBaseOptions}
                                </Select>
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
        const {
            landList,cropList,workTypeList,baseList
        } = this.props;
        const newBaseList = [];
        newBaseList.push({id: -1, name: '全部'});
        baseList.forEach((item) => {
            newBaseList.push(item);
        });
        const newBaseOptions = Utils.getOptionList(newBaseList);
        const newLandList = [];
        newLandList.push({id: -1, name: '全部'});
        landList.forEach((item) => {
            newLandList.push(item);
        });
        const newLandOptions = Utils.getOptionList(newLandList);
        const newCropList = [];
        newCropList.push({id: -1, name: '全部'});
        cropList.forEach((item) => {
            newCropList.push(item);
        });
        const newCropsOptions = Utils.getOptionList(newCropList);
        const list = [];
        list.push({id: -1, name: '全部'});
        workTypeList.forEach((item) => {
            list.push(item);
        });
        const workTypeOptions = Utils.getOptionList(list);
        return (
            <Form layout="inline">
                <Row gutter={{md: 8, lg: 24, xl: 48}}>
                    <Col md={8} sm={24}>
                        <FormItem label="日期范围">
                                <LocaleProvider locale={zhCN}>
                                <RangePicker value={this.state.timeStart?[this.state.timeStart, this.state.timeEnd]:[]}
                                             onChange={this.dateChange.bind(this)}/>
                                </LocaleProvider>
                        </FormItem>
                    </Col>
                    <Col md={8} sm={24}>
                        <FormItem label="基地">
                                <Select value={this.state.baseId} onChange={this.handleBase.bind(this)}
                                        showSearch
                                        placeholder="请选择基地"
                                        optionFilterProp="children"
                                        filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}>
                                    {newBaseOptions}
                                </Select>
                        </FormItem>
                    </Col>
                    <Col md={8} sm={24}>
                        <FormItem label="地块">
                                <Select value={this.state.landId} onChange={this.setLand.bind(this)}
                                        showSearch
                                        placeholder="请选择地块"
                                        optionFilterProp="children"
                                        filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                >
                                    {newLandOptions}
                                </Select>
                        </FormItem>
                    </Col>
                </Row>
                <Row gutter={{md: 8, lg: 24, xl: 48}}>
                    <Col md={8} sm={24}>
                        <FormItem label="作物">
                                <Select value={this.state.cropId} onChange={this.setCrops.bind(this)}
                                    showSearch
                                    placeholder="请选择作物"
                                    optionFilterProp="children"
                                    filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}>
                                    {newCropsOptions}
                                </Select>
                        </FormItem>
                    </Col>
                    <Col md={8} sm={24}>
                        <FormItem label="任务">
                                <Select value={this.state.workTypeId} onChange={this.setWorkType.bind(this)}
                                        showSearch
                                        placeholder="请选择任务"
                                        optionFilterProp="children"
                                        filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}>
                                    {workTypeOptions}
                                </Select>
                        </FormItem>
                    </Col>
                    <Col md={8} sm={24}>
                        <FormItem label="编号">
                                <Input value={this.state.planCode} onChange={this.setPlanCodeName.bind(this)}/>
                        </FormItem>
                    </Col>
                </Row>
                <Row style={{textAlign: 'right'}}>
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
            </Form>
        );
    }
    renderForm() {
        const {expandForm} = this.state;
        return expandForm ? this.renderAdvancedForm() : this.renderSimpleForm();
    }
    render() {
        const {securityKeyWord} = this.props;
        const queryRole = Com.hasRole(securityKeyWord, 'tasklist_listByPage','show');
        const editRole = Com.hasRole(securityKeyWord, 'tasklist_update','update');
        const getRole = Com.hasRole(securityKeyWord, 'tasklist_getById','show');
        const {queryFlag, currentIndex} = this.state;
        const {dataList} = this.props;
        const tableSearch = {
            companyId: 1,
            taskStatus: this.state.taskStatus,
            beginTime: this.state.timeStart ? moment(this.state.timeStart).format('YYYY-MM-DD') : '',
            endTime: this.state.timeEnd ? moment(this.state.timeEnd).add(1, 'days').format('YYYY-MM-DD') : '',
            planCode: this.state.planCode,
            baseId: this.state.baseId === -1 ? undefined : this.state.baseId,
            landId: this.state.landId === -1 ? undefined : this.state.landId,
            cropId: this.state.cropId === -1 ? undefined : this.state.cropId,
            workTypeId: this.state.workTypeId === -1 ? undefined : this.state.workTypeId
        };
        return (
            <div>
                <div className='tableList'>
                    <div className='tableListForm'>
                        {
                            queryRole && this.renderForm()
                        }
                    </div>
                </div>
                {queryRole && <div className='content'>
                    <div className='farming-table-header'>
                        <div className='table-header-analysis'>
                            {
                                this.props.arr.map((item, index) => {
                                    return <span key={index} onClick={this.handleTask.bind(this, index + 1)}
                                                 className={currentIndex === index + 1 ? 'checked' : ''}>{item}</span>;
                                })
                            }
                        </div>
                    </div>
                        {
                            currentIndex === 1 &&
                            <LocaleProvider locale={zhCN}>
                                <Tables data={dataList} search={tableSearch} status={this.state.taskStatus} editRole={editRole}
                                        getRole={getRole}
                                        onSizeChangequery={this.onSizeChangequery.bind(this)}
                                        onShowSizeChange={this.onShowSizeChange.bind(this)}
                                        onchooseChange={this.onchooseChange.bind(this)} queryFlag={queryFlag}/>
                            </LocaleProvider>
                        }
                        {
                            currentIndex === 2 &&
                            <LocaleProvider locale={zhCN}>
                                <Tables data={dataList} search={tableSearch} status={this.state.taskStatus} editRole={editRole}
                                        getRole={getRole}
                                        onSizeChangequery={this.onSizeChangequery.bind(this)}
                                        onchooseChange={this.onchooseChange.bind(this)} queryFlag={queryFlag}/>
                            </LocaleProvider>
                        }
                        {
                            currentIndex === 3 &&
                            <LocaleProvider locale={zhCN}>
                                <Tables data={dataList} search={tableSearch} status={this.state.taskStatus} editRole={editRole}
                                        getRole={getRole}
                                        onSizeChangequery={this.onSizeChangequery.bind(this)}
                                        onchooseChange={this.onchooseChange.bind(this)} queryFlag={queryFlag}/>
                            </LocaleProvider>
                        }
                        {
                            currentIndex === 4 &&
                            <LocaleProvider locale={zhCN}>
                                <Tables data={dataList} search={tableSearch} status={this.state.taskStatus} editRole={editRole}
                                        getRole={getRole}
                                        onSizeChangequery={this.onSizeChangequery.bind(this)}
                                        onchooseChange={this.onchooseChange.bind(this)} queryFlag={queryFlag}/>
                            </LocaleProvider>
                        }
                    <ModalForm props={this.props} />
                    <ModalFormDetails props={this.props} handleC={this.handleC.bind(this)}/>
                </div>}
            </div>
        );
    }
}

const mapStateprops = (state) => {
    const {Alldate, slideName, workTypeDic, total,baseList, cropList, landList, pendingTotal, overtimeTotal, doneTotal, allTotal} = state.agriculturalTaskReducer;
    //const { securityKeyWord } = state.initReducer;
    const securityKeyWord = ['tasklist_listByPage', 'tasklist_update', 'tasklist_getById', 'tasklist_list', 'tasklist_calendar'];
    return {
        dataList: Alldate,//展示列表的数据
        workTypeList: workTypeDic,
        arr: [`任务数 ( ${allTotal} )`, `已完成 ( ${doneTotal} )`, `待执行 ( ${pendingTotal} )`, `超时 ( ${overtimeTotal} )`],
        total: total,
        slideName, securityKeyWord,
        baseList, cropList, landList
    };
};
const WrappedNormalLoginForm = Form.create()(Resources);
export default connect(mapStateprops, action)(WrappedNormalLoginForm);
