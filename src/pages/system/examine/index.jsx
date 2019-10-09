import {Component} from 'react';
import Tables from './table.jsx';
import {connect} from 'react-redux';
import {action} from './model';
import './../../index.less';
import './index.less';
import {Button, Card, Col, DatePicker, Form, Icon, Input, LocaleProvider, Row, Select} from "antd";
import zhCN from "antd/lib/locale-provider/zh_CN";
import moment from "moment";
const Option = Select.Option;

const {RangePicker} = DatePicker;
const FormItem = Form.Item;

class Resources extends Component {
    constructor(props) {
        super(props);
        const end = new Date();
        const start = new Date();
        start.setMonth(start.getMonth() - 3);
        this.state = { //查询条件
            queryFlag: false,  //筛选按钮
            closure: null,
            mobilePhone: '',
            status:'',
            startDate: moment(start), //开始日期
            endDate: moment(end) //结束日期
        };
    }

    componentDidMount() {
        const startTime = new Date(`${moment(this.state.startDate).format('YYYY-MM-DD')} 00:00:00`).getTime();
        const endTime = new Date(`${moment(this.state.endDate).format('YYYY-MM-DD')} 23:59:59`).getTime();
        this.props.page({current: 1, pageSize: 10});
        this.props.allData({startPage: 1, limit: 10, startTime: startTime, endTime: endTime});
    }

    query() {  //查询按钮
        this.setState({
            queryFlag: true
        }, () => {
            if (this.state.closure) {
                clearTimeout(this.state.closure);
            }
            const vm = {
                approveStatus: this.state.status,
                startTime: this.state.startDate ? new Date(`${moment(this.state.startDate).format('YYYY-MM-DD')} 00:00:00`).getTime() : undefined,
                endTime: this.state.endDate ? new Date(`${moment(this.state.endDate).format('YYYY-MM-DD')} 23:59:59`).getTime() : undefined,
                mobilePhone: this.state.mobilePhone,
                startPage: 1,
                limit: this.props.PageSize
            };
            this.setState({
                closure: setTimeout(() => {
                    this.props.allData(vm);
                    this.props.page({current: 1, pageSize: this.props.PageSize});
                }, 800)
            });
        });
    }

    setDate(date) {
        if (date && date.length > 0) {
            this.setState({
                startDate: date[0],
                endDate: date[1]
            });
        } else {
            this.setState({
                startDate: null,
                endDate: null
            });
        }
        // this.query();
    }

    onSizeChangeQuery(current, size) {  //第几页
        const vm = {
            startTime: this.state.startDate ? new Date(`${moment(this.state.startDate).format('YYYY-MM-DD')} 00:00:00`).getTime() : undefined,
            endTime: this.state.endDate ? new Date(`${moment(this.state.endDate).format('YYYY-MM-DD')} 23:59:59`).getTime() : undefined,
            approveStatus: this.state.status,
            mobilePhone: this.state.mobilePhone,
            startPage: current,
            limit: size
        };
        this.props.allData(vm);
    }

    onShowSizeChange(current, size) {  //每页数量
        const vm = {
            startTime: this.state.startDate ? new Date(`${moment(this.state.startDate).format('YYYY-MM-DD')} 00:00:00`).getTime() : undefined,
            endTime: this.state.endDate ? new Date(`${moment(this.state.endDate).format('YYYY-MM-DD')} 23:59:59`).getTime() : undefined,
            mobilePhone: this.state.mobilePhone,
            approveStatus: this.state.status,
            startPage: 1,
            limit: size
        };
        this.props.allData(vm);
    }

    setMobilePhone(event) {
        const value = event.target.value;
        this.setState({
            mobilePhone: value
        });
        // this.query();
    }
    setStatus(event) {
        const value = event;
        this.setState({
            status: value
        });
        // this.query();
    }
    toggleForm() {
        const {expandForm} = this.state;
        this.setState({
            expandForm: !expandForm
        });
    }
    reset() {
        const end = new Date();
        const start = new Date();
        start.setMonth(start.getMonth() - 3);
        this.setState({
            mobilePhone: '',
            status:'',
            startDate: moment(start), //开始日期
            endDate: moment(end) //结束日期
        },() => {
            this.query();
        });
    }
    renderSimpleForm() {
        const statusList=[{id:'',name:'全部'},{id:0,name:'待审核'},{id:1,name:'审核通过'},{id:2,name:'审核不通过'}];
        return (
            <Form layout="inline">
                <Row gutter={{md: 8, lg: 24, xl: 48}}>
                    <Col md={8} sm={24}>
                        <FormItem label="手机号">
                            <Input value={this.state.mobilePhone} onChange={this.setMobilePhone.bind(this)}/>
                        </FormItem>
                    </Col>
                    <Col md={8} sm={24}>
                        <FormItem label="状态">
                            <Select value={this.state.status} onChange={this.setStatus.bind(this)}
                                    placeholder="状态">
                                {statusList.map((item) => {
                                    return <Option key={item.id} value={item.id}>{item.name}</Option>;
                                })}
                            </Select>
                        </FormItem>
                    </Col>
                    <Col md={8} sm={24} style={{textAlign: 'right'}}>
                        <span className='submitButtons'>
                          <Button type="primary" htmlType="submit" onClick={this.query.bind(this)}>
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
        const dateFormat = 'YYYY-MM-DD';
        const statusList=[{id:'',name:'全部'},{id:0,name:'待审核'},{id:1,name:'审核通过'},{id:2,name:'审核不通过'}];
        return (
            <Form layout="inline">
                <Row gutter={{md: 8, lg: 24, xl: 48}}>
                    <Col md={8} sm={24}>
                        <FormItem label="手机号">
                            <Input value={this.state.mobilePhone} onChange={this.setMobilePhone.bind(this)}/>
                        </FormItem>
                    </Col>
                    <Col md={8} sm={24}>
                        <FormItem label="状态">
                            <Select value={this.state.status} onChange={this.setStatus.bind(this)}
                                    placeholder="状态">
                                {statusList.map((item) => {
                                    return <Option key={item.id} value={item.id}>{item.name}</Option>;
                                })}
                            </Select>
                        </FormItem>
                    </Col>
                    <Col md={8} sm={24}>
                        <FormItem label="日期选择">
                            <LocaleProvider locale={zhCN}>
                                <RangePicker value={this.state.startDate?[this.state.startDate, this.state.endDate]:[]}
                                             format={dateFormat} onChange={this.setDate.bind(this)}/>
                            </LocaleProvider>
                        </FormItem>
                    </Col>
                </Row>
                <Row gutter={{md: 8, lg: 24, xl: 48}}>
                    <Col md={24} sm={24} style={{textAlign: 'right'}}>
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
        const {queryFlag, startDate, endDate, mobilePhone} = this.state;
        const {dataList} = this.props;
        return (
            <div className='farming-box'>
                <Card bordered={false}>
                    <div className='content'>
                        <div className='tableListForm'>{this.renderForm()}</div>
                        <Tables data={dataList} onSizeChangeQuery={this.onSizeChangeQuery.bind(this)} queryFlag={queryFlag}
                                onShowSizeChange={this.onShowSizeChange.bind(this)} startDate={startDate}
                                endDate={endDate} mobilePhone={mobilePhone}/>
                    </div>
                </Card>
            </div>
        );
    }
}

const mapStateprops = (state) => {
    const {dataList, Current, PageSize} = state.examineReducer;
    return {
        dataList,
        Current,
        PageSize
    };
};
const WrappedNormalLoginForm = Form.create()(Resources);
export default connect(mapStateprops, action)(WrappedNormalLoginForm);
