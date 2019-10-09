import {Component} from 'react';
import {Input, Button, Col, Row, Card, Form} from 'antd';
import Tables from './table.jsx';
import {connect} from 'react-redux';
import {action} from './model';
import './../../index.less';
import Com from '@/component/common';
const FormItem = Form.Item;
class Resources extends Component {
    constructor(props) {
        super(props);
        this.state = {
            crop: '',//作物品种
            queryFlag: false,  //筛选按钮
            chooseId: null,
            queryRole: false,
            gradeQueryRole: false,
            editRole: false,
            closure:null
        };
    }

    componentDidMount() {
        this.props.Alldatas({startPage: 1, limit: 10, companyId: 1});
        this.props.page({current: 1, pageSize: 10});
        this.props.superiorName({name: '作物产量数据', parentLeftID: -1});
    }

    setCrop(event) {  //查找的表单-用户名称
        this.setState({
            crop: event.target.value
        },() => {
          if(this.setState.crop) {
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
            name: this.state.crop,
            startPage: 1,
            limit: 10,
            companyId: 1
        };
        this.props.queryAll(vm);
        this.props.page({current: 1, pageSize: 10});
    }
    reset() {   //重置
        this.setState({
            crop: ''
        },() => {
            this.query();
        });
    }

    onSizeChangequery(current, size) {  //点击筛选的分页按钮
        const vm = {
            name: this.state.crop,
            startPage: current,
            limit: size,
            companyId: 1
        };
        this.props.queryAll(vm);
        this.props.page({current: current, pageSize: size});
    }
    onShowSizeChange(current, size) {  //点击筛选的分页按钮
        const vm = {
            name: this.state.crop,
            startPage: 1,
            limit: size,
            companyId: 1
        };
        this.props.queryAll(vm);
        this.props.page({current: 1, pageSize: size});
    }

    onchooseChange(current, size) {  //点击侧边的分页按钮
        const {chooseId} = this.state;
        this.props.chooseAll({id: chooseId, startPage: current, limit: size});
        this.props.page({current: current, pageSize: size});
    }
    renderSimpleForm() {
        return (
            <Form layout="inline">
                <Row gutter={{md: 8, lg: 24, xl: 48}}>
                    <Col md={8} sm={24}>
                        <FormItem label="作物品种">
                            <Input value={this.state.crop} onChange={this.setCrop.bind(this)}/>
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
        const {securityKeyWord} = this.props;
        const queryRole = Com.hasRole(securityKeyWord, 'cropyielddata_listByPage', 'show');
        const gradeQueryRole = Com.hasRole(securityKeyWord, 'cropyielddata_grade_listByPage', 'show');
        const editRole = Com.hasRole(securityKeyWord, 'cropyielddata_update', 'update');
        const {queryFlag} = this.state;
        const {dataList} = this.props;
        return (
            <div className='farming-box master-box'>
                <Card>
                    <div className='content cropContent'>
                        <div className='tableListForm'>{this.renderForm()}</div>
                        {queryRole &&
                        <Tables data={dataList} crop={this.state.crop} onSizeChangequery={this.onSizeChangequery.bind(this)} editRole={editRole} gradeQueryRole={gradeQueryRole}
                                onShowSizeChange={this.onShowSizeChange.bind(this)}
                                onchooseChange={this.onchooseChange.bind(this)} queryFlag={queryFlag}/>}
                    </div>
                </Card>
                {/*<div className='farming-search'>
                <div className='farming-title'>
                  <div className='title'>作物产量</div>
                  <div className='search-layout search-layout-1'>
                        <div className='search-row'>
                            <div className='search-col'>
                                <span className='label-title'>作物品种</span>
                                <Input size="large" value={this.state.crop} onChange={this.setCrop.bind(this)}/>
                            </div>
                        </div>
                    </div>
                </div>
                </div>*/}
            </div>
        );
    }
}

const mapStateprops = (state) => {
    const {Alldate, slideName} = state.cropyielddataReducer;
    const { securityKeyWord } = state.initReducer;
    //const securityKeyWord = ['cropyielddata_listByPage', 'cropyielddata_update', 'cropyielddata_grade_listByPage'];
    return {
        dataList: Alldate,//展示列表的数据
        slideName, securityKeyWord
    };
};
const WrappedNormalLoginForm = Form.create()(Resources);
export default connect(mapStateprops, action)(WrappedNormalLoginForm);
