import {Component} from 'react';
import {Button, Input, message, Card, Form, Row, Col} from 'antd';
import Tables from './table.jsx';
import {connect} from 'react-redux';
import {action} from './model';
import ModalForm from './modalForm.jsx';
import './../../index.less';
import {IOModel} from "./model";
import Com from "@/component/common";
const FormItem = Form.Item;
class Resources extends Component {
    constructor(props) {
        super(props);
        this.state = { //查询条件
            name: '',//计量单位名称
            queryFlag: false,  //筛选按钮
            chooseId: null,
            addRole: false,
            queryRole: false,
            editRole: false,
            stautsRole: false,
            saveFlag:true,
          closure:null
        };
    }
    query() {  //查询按钮
        this.setState({
            queryFlag: true //控制分页的展示
        });
        const vm = {
            name: this.state.name,
            startPage: 1,
            limit: 10
        };
        this.props.queryAll(vm);
        this.props.page({current:1, pageSize:10});
    }
    reset() {
        this.setState({
            name: ''
        },() => {
            this.query();
        });
    }
    setName(event) {  //查询条件-计量单位名称
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
            //     closure : setTimeout(() => {
            //         this.query();
            //     },800)
            // });
        });
    }
    componentDidMount() {
        this.props.Alldatas({startPage: 1, limit: 10});
        this.props.superiorName({name: '计量单位', parentLeftID: -1});
    }
    onSizeChangequery(current, size) {  //点击筛选的分页按钮
        const vm = {
            name: this.state.name,
            startPage: current,
            limit: size
        };
        this.props.queryAll(vm);
    }
    onShowSizeChange(current, size) {  //点击筛选的分页按钮
        const vm = {
            name: this.state.name,
            startPage: 1,
            limit: size
        };
        this.props.queryAll(vm);
    }
    addmodel() {   //增加的按钮
        this.props.modal({modalFlag: true, modeltype: 'add'});
        this.props.defaultFields({
            name: {
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
    }
    checkName(name, id) {
        if(this.state.closure) {
            clearTimeout(this.state.closure);
        }
        this.setState({
            closure : setTimeout(() => {
                if(name) {
                    IOModel.CheckName({name: name, id: id}).then((res) => {  //添加成功时的回
                        if (res.success) {
                            if (res.data === 0) {
                                this.setState({
                                    saveFlag:false
                                });
                                message.warning('计量单位名称已存在');
                            } else if (res.data === -1) {
                                message.error('验证失败');
                            } else if(res.data > 0) {
                                this.setState({
                                    saveFlag:true
                                });
                            }
                        } else {
                            message.error('验证失败');
                        }
                    }).catch(() => {
                        message.error('验证失败');
                    });
                }
            },800)
        });
    }
    renderSimpleForm() {
        return (
            <Form layout="inline">
                <Row gutter={{md: 8, lg: 24, xl: 48}}>
                    <Col md={8} sm={24}>
                        <FormItem label="计量单位名称">
                            <Input value={this.state.name} onChange={this.setName.bind(this)}/>
                        </FormItem>
                    </Col>
                    <Col md={16} sm={24} style={{textAlign: 'right'}}>
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
        const {queryFlag} = this.state;
        const {securityKeyWord} = this.props;
        const addRole = Com.hasRole(securityKeyWord, 'chargeunit_add', 'insert', 'chargeunit');
        const editRole = Com.hasRole(securityKeyWord, 'chargeunit_update', 'update', 'chargeunit');
        const {dataList} = this.props;
        return (
            <div className='farming-box master-box'>
                <Card>
                    <div className='content'>
                        <div className='tableListForm'>{this.renderForm()}</div>
                        {addRole && <Row style={{marginBottom: '20px'}}>
                            <Col span={24}>
                                {addRole && <p><Button onClick={this.addmodel.bind(this)} type="primary">新增计量单位</Button></p>}
                            </Col>
                        </Row>}
{/*                        <div className='table-header'>
                            <p><i className='iconfont icon-sort'></i><span>计量单位列表</span></p>
                            {addRole && <p><Button onClick={this.addmodel.bind(this)}>新增计量单位</Button></p>}
                        </div>*/}
                        <Tables data={dataList} onSizeChangequery={this.onSizeChangequery.bind(this)} name={this.state.name}
                                onchooseChange={this.onchooseChange.bind(this)}
                                onShowSizeChange={this.onShowSizeChange.bind(this)}
                                queryFlag={queryFlag}
                                editRole={editRole} />
                        < ModalForm props={this.props} name={this.state.name} query={this.query.bind(this)} checkName={this.checkName.bind(this)}  saveFlag={this.state.saveFlag}/>
                    </div>
                </Card>
                {/*<div className='farming-search'>
                    <div className='farming-title'>
                  <div className='title'>计量单位维护</div>
                        <div className='search-layout search-layout-1'>
                            <div className='search-row'>
                                <div className='search-col'>
                                    <span className='label-title'>计量单位名称</span>
                                    <Input size="large" value={this.state.name} onChange={this.setName.bind(this)}/>
                                </div>
                            </div>
                        </div></div>
                </div>*/}

            </div>
        );
    }
}

const mapStateprops = (state) => {
    const {Alldate, slideName} = state.growthReducer;
    const { securityKeyWord } = state.initReducer;
   // const securityKeyWord = ['period_listByPage', 'period_add', 'period_update', 'period_stauts'];
    return {
        dataList: Alldate,//展示列表的数据
        slideName,
        securityKeyWord
    };
};
export default connect(mapStateprops, action)(Resources);
