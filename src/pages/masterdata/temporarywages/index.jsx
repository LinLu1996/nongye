import {Component} from 'react';
import Tables from './table.jsx';
import {connect} from 'react-redux';
import {action, IOModel} from './model';
import '../../index.less';
import './index.less';
import { Button, message, Col, Row, Card, Form} from "antd";
import Formtitle from '@/component/formtitle/index.jsx';
import Com from "@/component/common";
const FormItem = Form.Item;
class Resources extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dataList: [],
            queryFlag: false,  //筛选按钮
            chooseId: null,
            queryRole: false,
            selectvalue:1,
            current: 1,
            psize: 10,
            total:0
        };
    }

    componentDidMount() {
        IOModel.listAll({startPage: 1,limit: this.state.psize}).then((res) => {
            let data;
            res.data && res.data.rows ? data = res.data.rows :data=[];
            const datas = data.map(item => {
                item.key = item.id;
                return item;
            });
            this.setState({dataList: datas,total:res.data.total});
        });
        this.props.getAllUnit();
        this.props.superiorName({name: '临时工薪酬', parentLeftID: -1});
    }

    componentWillReceiveProps(nextProps) {
        if (Com.hasRole(nextProps.securityKeyWord, 'temporaryWages_add', 'update')) {
            this.props.saveFlagModel(true);
        } else {
            this.props.saveFlagModel(false);
        }
    }

    query(cur,psize,name) {  //查询
        IOModel.listAll({startPage: cur,limit: psize,operationName:name}).then((res) => {
            let data;
            res.data && res.data.rows ? data = res.data.rows :data=[];
            const datas = data.map(item => {
                item.key = item.id;
                return item;
            });
            this.setState({dataList: datas});
        });
    }
    search() {
        this.query(1,10,this.state.valueName);
    }
    reset() {
        this.setState({
            valueName : ''
        },() => {
            this.query(1,10,this.state.valueName);
        });
    }

    changeTableData(data) {  //
        this.setState({dataList: data});
    }
    handleSave(value,record) {
        if(value.wage===record.wage && (value.unitName===record.chargeUnitId || value.unitName===record.unitName)) {
            message.success('保存成功');
        }else {
            let Id;
            value.unitName===record.unitName ? Id=record.chargeUnitId : Id=value.unitName;
            const data = Object.assign({},record,{
                wage:value.wage,
                unitName:value.unitName,
                chargeUnitId:Id
            });
            const json = JSON.stringify(data);
            IOModel.Modifydata({wokewageJson: json}).then((res) => {
                if (res.success) {
                    if (res.data > 0) {
                        message.success('修改成功');
                        this.query(this.state.current,this.state.psize,this.state.valueName);
                    } else {
                        message.error('修改失败');
                    }
                } else {
                    message.error('修改失败');
                }
            }).catch(() => {
                message.error('修改失败');
            });
        }
    }
    onShowSizeChange(cur,psize) {
        this.setState({
            current:cur,
            psize:psize
        });
        this.query(cur,psize,this.state.valueName);
    }
    formName(val) {  //查找的表单
        this.setState({
            valueName: val,
            current: 1
        }, () => {
            if (this.state.closure) {
                clearTimeout(this.state.closure);
            }
            // this.setState({
            //     closure: setTimeout(() => {
            //         this.query(this.state.current,this.state.psize,val);
            //     }, 800)
            // });
        });
    }
    onSizeChange(cur,psize) {
        this.setState({
            current:cur,
            psize:psize
        });
        this.query(cur,psize,this.state.valueName);
    }
    renderSimpleForm() {
        const { valueName } = this.state;
        return (
            <Form layout="inline">
                <Row gutter={{md: 8, lg: 24, xl: 48}}>
                    <Col md={8} sm={24}>
                        <FormItem label="农事操作">
                            <Formtitle  Nameval={valueName}  querykeyword='农事操作' formName={this.formName.bind(this)}/>
                        </FormItem>
                        {/*<FormItem label="农事类型">
                            <Input value={this.state.valueName} onChange={this.formName.bind(this)}/>
                        </FormItem>*/}
                    </Col>
                    <Col md={16} sm={24} style={{textAlign:'right'}}>
                        <span className='submitButtons'>
                          <Button type="primary" onClick={this.search.bind(this)}>
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
        const queryRole = Com.hasRole(securityKeyWord, 'temporaryWages_workWageListAll', 'show');
        const {queryFlag,total, current} = this.state;
        const {saveFlag} = this.props;
        return (
            <div className='farming-box master-box'>
                <Card>
                    <div className='tableListForm'>{this.renderForm()}</div>
                    {queryRole && <div className='content'>
                        {/*<div className='table-header'>*/}
                        {/*<p><i className='iconfont icon-sort'></i><span>临时工薪酬列表</span></p>*/}
                        {/*</div>*/}
                        <Tables data={this.state.dataList} queryFlag={queryFlag} total={total} current={current}
                                onShowSizeChange={this.onShowSizeChange.bind(this)}
                                onSizeChange={this.onSizeChange.bind(this)}
                                changeTableData={this.changeTableData.bind(this)} handleSave={this.handleSave.bind(this)}/>
                        {saveFlag && <div className='table-btm'>
                        </div>}
                    </div>}
                </Card>
                {/*<div className='farming-search'>
                  <div className='farming-title'>
                    <div className='title'>临时工薪酬</div>
                    <div className='search-layout '>
                      <div className='search-row'>
                        <div className='search-col'>
                          <Formtitle  Nameval={valueName}  querykeyword='农事类型'
                               formName={this.formName.bind(this)}/>
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
    const {saveFlag, slideName} = state.temporaryWagesReducer;
    const {securityKeyWord} = state.initReducer;
    return {
        saveFlag,
        securityKeyWord,
        slideName
    };
};
const WrappedNormalLoginForm = Form.create()(Resources);
export default connect(mapStateprops, action)(WrappedNormalLoginForm);
