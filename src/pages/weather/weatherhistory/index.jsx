import {Component} from 'react';
import {Input, DatePicker, LocaleProvider, Form, Row, Col, Button, Card} from 'antd';
import Tables from './table.jsx';
import {connect} from 'react-redux';
import {action} from './model';
import '../../index.less';
import './index.less';
import moment from "moment";
import Com from '@/component/common';
import zhCN from "antd/lib/locale-provider/zh_CN";

const FormItem = Form.Item;
const {RangePicker} = DatePicker;

class Resources extends Component {
    constructor(props) {
        super(props);
        const end = new Date();
        const start = new Date();
        start.setTime(end.getTime() - 7 * 24 * 3600 * 1000);
        this.state = {
            startTime: moment(start).format('YYYY-MM-DD'),//开始日期
            endTime: moment(end).format('YYYY-MM-DD'),//结束日期
            baseName: '',//基地名称
            queryFlag: false, //筛钮
            queryRole: false,
            closure:null
        };
    }

    componentDidMount() {
        this.props.listByPage({
            startPage: 1,
            limit: 10,
            companyId: 1,
            startTime: this.state.startTime ? new Date(moment(this.state.startTime,'YYYY-MM-DD')).getTime() : undefined,
            endTime: this.state.endTime ? new Date(moment(this.state.endTime,'YYYY-MM-DD')).getTime() : undefined
        });//进入页面请求列表数据
    }

    setBaseName(event) {  //查找的表单-地块名称
        this.setState({
            baseName: event.target.value
        },() => {
        if(this.setState.baseName) {
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
        // this.query();
    }

    setDate(date, dateString) {
        this.setState({
            startTime: dateString[0],
            endTime: dateString[1]
        },() => {
          if(this.setState.startTime && this.setState.startTime) {
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
        });
    }

    query() {  //查询按钮
        this.setState({
            queryFlag: true //控制分页的展示
        });
        const vm = {
            companyId: 1,
            baseName: this.state.baseName,//基地名称
            startTime: this.state.startTime ? new Date(moment(this.state.startTime,'YYYY-MM-DD')).getTime() : undefined,
            endTime: this.state.endTime ? new Date(moment(this.state.endTime,'YYYY-MM-DD')).getTime() : undefined,
            startPage: 1,
            limit: 10
        };
        this.props.listByPage(vm);
        this.props.page({current: 1, pageSize: 10});
    }

    onSizeChangequery(current, size) {  //点击筛选的分页按钮
        const vm = {
            companyId: 1,
            baseName: this.state.baseName,//基地名称
            startTime: this.state.startTime ? new Date(moment(this.state.startTime,'YYYY-MM-DD')).getTime() : undefined,
            endTime: this.state.endTime ? new Date(moment(this.state.endTime,'YYYY-MM-DD')).getTime() : undefined,
            startPage: current,
            limit: size
        };
        this.props.listByPage(vm);
        this.props.page({current: current, pageSize: size});
    }
    onShowSizeChange(current, size) {  //点击筛选的分页按钮
        const vm = {
            companyId: 1,
            baseName: this.state.baseName,//基地名称
            startTime: this.state.startTime ? new Date(moment(this.state.startTime,'YYYY-MM-DD')).getTime() : undefined,
            endTime: this.state.endTime ? new Date(moment(this.state.endTime,'YYYY-MM-DD')).getTime() : undefined,
            startPage: 1,
            limit: size
        };
        this.props.listByPage(vm);
        this.props.page({current: 1, pageSize: size});
    }

    onchooseChange(current, size) {  //点击侧边的分页按钮
        const {chooseId} = this.state;
        this.props.chooseAll({id: chooseId, startPage: current, limit: size});
        this.props.page({current: current, pageSize: size});
    }

    reset () {
        const end = new Date();
        const start = new Date();
        start.setTime(end.getTime() - 7 * 24 * 3600 * 1000);
        this.setState({
            startTime: moment(start).format('YYYY-MM-DD'),//开始日期
            endTime: moment(end).format('YYYY-MM-DD'),//结束日期
            baseName: ''//基地名称
        },() => {
            this.query();
        });
    }

    renderSimpleForm() {
        const dateFormat = 'YYYY/MM/DD';
        return (
            <Form layout="inline">
                <Row gutter={{md: 8, lg: 24, xl: 48}}>
                    <Col md={8} sm={24}>
                        <FormItem label="基地名称">
                            <Input value={this.state.baseName} onChange={this.setBaseName.bind(this)}/>
                        </FormItem>
                    </Col>
                    <Col md={8} sm={24}>
                        <FormItem label="日期范围">
                            <LocaleProvider locale={zhCN}>
                                <RangePicker value={this.state.startTime?[moment(this.state.startTime), moment(this.state.endTime)]:[]}
                                             format={dateFormat} onChange={this.setDate.bind(this)}/>
                            </LocaleProvider>
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
        const queryRole = Com.hasRole(securityKeyWord, 'weatherhistory_listByPage', 'show');
        const {queryFlag} = this.state;
        const {weatherHistory} = this.props;
        /*const date = new Date();
        date.setTime(date.getTime() - 7 * 24 * 3600 * 1000);*/
        return (
            <div className='farming-box'>
                <Card bordered={false}>
                    <div className='content'>
                        <div className='tableListForm'>{this.renderForm()}</div>
                        {queryRole &&
                        <Tables data={weatherHistory.rows} onSizeChangequery={this.onSizeChangequery.bind(this)}
                                onShowSizeChange={this.onShowSizeChange.bind(this)}
                                onchooseChange={this.onchooseChange.bind(this)} queryFlag={queryFlag}/>}
                    </div>
                </Card>
            </div>
        );
    }
}

const mapStateprops = (state) => {
    const {slideName, weatherHistory} = state.historicalMeteorologicalReducer;
    const { securityKeyWord } = state.initReducer;
    return {
        slideName,
        weatherHistory, securityKeyWord
    };
};
const WrappedNormalLoginForm = Form.create()(Resources);
export default connect(mapStateprops, action)(WrappedNormalLoginForm);
