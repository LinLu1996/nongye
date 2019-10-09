import { Component } from 'react';
import {Input, Button, Col, Row, Card, Form} from 'antd';
import Tables from './table.jsx';
import {connect} from 'react-redux';
import {action} from './model';
import ModalForm  from './modalForm.jsx';
import './../../index.less';
import './index.less';
// import Com from "@/component/common";
const FormItem = Form.Item;
class Resources extends Component {
    constructor(props) {
        super(props);
        this.state={
            typeName:'',//操作名称
            allWorkType:[],//所有类型
            farmingType: '',//农事类型
            queryFlag:false,  //筛选按钮
            chooseId:null,
            queryRole: false,
            addRole: false,
            editRole: false,
            getRole: false,
            saveFlag:true,
            closure:null,
            psize:10,
            current:1
        };
    }
    async componentDidMount() {
        this.props.Alldatas({startPage:1,limit:10,sortField: 'gmt_create',sortOrder: 'DESC'});  //进入页面请求列表数据
    }
    setOperationName() {  //查找的表单-操作名称
        this.setState({
            typeName:event.target.value,
            current:1
        },() => {
            if(this.state.closure) {
                clearTimeout(this.state.closure);
            }
            // this.setState({
            //     closure : setTimeout(() => {
            //         this.props.Alldatas({startPage:this.state.current,sortField: 'gmt_create',sortOrder: 'DESC',limit:this.state.psize,name:this.state.typeName});
            //     },800)
            // });
        });
    }
    onSizeChangequery(current) {  //点击筛选的分页按钮
        this.setState({
            current: current
        });
        const {typeName} = this.state;
        this.props.Alldatas({startPage: current, limit: this.state.psize,name:typeName,sortField: 'gmt_create',sortOrder: 'DESC'});
    }
    getpsize(psize,cur) {
        this.setState({
            psize:psize,
            current:cur
        });
    }
    addmodel() {   //增加的按钮
        this.props.modal({modalFlag:true,modeltype:'add'});
        this.props.defaultFields({
            allWorkType: {
                value: this.props.AllWorkType
            },
            name: {
                value: ''
            },
            code: {
                value: ''
            },
            modeltype:{
                value:'add'
            }
        });
    }
    query() {  //查询按钮
        this.setState({
            queryFlag: true //控制分页的展示
        });
        const vm = {
            name: this.state.typeName,
            startPage: 1,
            limit: 10,
            sortField: 'gmt_create',
            sortOrder: 'DESC'
        };
        this.props.Alldatas(vm);
        // this.props.page({current: 1, pageSize: 10});
    }
    reset() {
        this.setState({
            typeName:''//操作名称
        },() => {
            this.query();
        });
    }
    renderSimpleForm() {
        return (
            <Form layout="inline">
                <Row gutter={{md: 8, lg: 24, xl: 48}}>
                    <Col md={8} sm={24}>
                        <FormItem label="类型名称">
                            <Input value={this.state.typeName} onChange={this.setOperationName.bind(this)}/>
                        </FormItem>
                    </Col>
                    <Col md={16} sm={24} style={{textAlign:'right'}}>
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
      const {securityKeyWord, dataList} = this.props;
    return (
        <div className='farming-box master-box'>
            <Card>
                <div className='content'>
                    <div className='tableListForm'>{this.renderForm()}</div>
                    {securityKeyWord.indexOf("platform_all") > -1 && <Row style={{marginBottom: '20px'}}>
                        <Col span={24}>
                            {securityKeyWord.indexOf("platform_all") > -1 && <Button type="primary" onClick={this.addmodel.bind(this)}>新增农事类型</Button>}
                        </Col>
                    </Row>}
                    {/*<div className='table-header'>*/}
                    {/*<p><i className='iconfont icon-sort'></i><span>农事类型列表</span></p>*/}
                    {/*{securityKeyWord.indexOf("platform_all") > -1 ? <p><Button onClick={this.addmodel.bind(this)}>新增农事类型</Button></p>:''}*/}
                    {/*</div>*/}
                    {<Tables data={dataList} onSizeChangequery={this.onSizeChangequery.bind(this)}  current={this.state.current} psize={this.state.psize} names={this.state.typeName}
                             getpsize={this.getpsize.bind(this)}/>}
                    <ModalForm props={this.props} current={this.state.current} psize={this.state.psize} names={this.state.typeName}/>
                </div>
            </Card>

            {/*<div className='farming-search'>
                <div className='farming-title'>
                    <div className='title'>农事类型</div>
                    <div className='search-layout search-layout-1'>
                        <div className='search-row'>
                            <div className='search-col'>
                                <span className='label-title'>类型名称</span>
                                <Input size="large" value={this.state.typeName} onChange={this.setOperationName.bind(this)}/>
                            </div>
                        </div>
                    </div></div>
            </div>*/}

      </div>
    );
  }
}
const mapStateprops = (state) => {
  const { Alldate } = state.workTypeReducer;
  const { securityKeyWord } = state.initReducer;
  return {
    dataList:Alldate,//展示列表的数据
    securityKeyWord
  };
};
const WrappedNormalLoginForm = Form.create()(Resources);
export default connect(mapStateprops, action)(WrappedNormalLoginForm);
