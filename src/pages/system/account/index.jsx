import { Component } from 'react';
import Tables from './table.jsx';
import {connect} from 'react-redux';
import {action} from './model';
import Formtitle from '@/component/formtitle/index.jsx';
import Operation from '../public.js';
import './../../index.less';
import './index.less';
import {IO} from '@/app/io';
import {Button, Card, Col, Form, Icon, Row, Select, TreeSelect} from "antd";
const Option = Select.Option;
const TreeNode = TreeSelect.TreeNode;
const FormItem = Form.Item;
class Resources extends Component {
    constructor(props) {
        super(props);
        this.state={
            valueName:'',
            queryFlag:false,
            current:1,
            closure:null,
            employee:'',  //员工
            company:'',//所属企业
            companyName:'',//所属企业名称
            accountType:'', //企业类型
            listCompany:[],
            companyid:'',
            expandForm: false
        };
    }
  componentDidMount() {
    this.props.Alldatas({startPage:1,limit:10,sortField:this.props.sortfield,sortOrder:this.props.sortorder});
    this.props.employeeListAll();
    IO.account.CompanyAll().then((res) => {
        let Companydata;
        if (!res.data) {
            Companydata = [];
        } else {
            Companydata = res.data;
        }
        this.setState({
             listCompany: Operation.CompanyTreelist(Companydata, {
                props: {
                    eventKey: 0
                }
            })
        });
    });
    //this.props.accountTypeList();
  }
  oncompanyChange(value, label, extra) {
        this.setState({
            company: extra.triggerNode.props.dataRef.id,
            companyName: label[0]
        },() => {
            if(this.setState.company) {
                this.setState({
                    queryFlag:true
                });
            } else {
                this.setState({
                    queryFlag:false
                });
            }
            /*if(this.state.closure) {
                clearTimeout(this.state.closure);
            }
            this.setState({
                closure : setTimeout(() => {
                    this.query();
                },800)
            });*/
        });
    }
    setEmployee(event) {
        this.setState({
            employee: event
        },() => {
            if(this.setState.employee) {
                this.setState({
                    queryFlag:true
                });
            } else {
                this.setState({
                    queryFlag:false
                });
            }
            // if(this.state.closure) {
            //     clearTimeout(this.state.closure);
            // }
            // this.setState({
            //     closure : setTimeout(() => {
            //         this.query();
            //     },800)
            // });
        });
    }
    setAccountType(event) {
        this.setState({
            accountType: event
        },() => {
            if(this.setState.accountType) {
                this.setState({
                    queryFlag:true
                });
            } else {
                this.setState({
                    queryFlag:false
                });
            }
            // if(this.state.closure) {
            //     clearTimeout(this.state.closure);
            // }
            // this.setState({
            //     closure : setTimeout(() => {
            //         this.query();
            //     },800)
            // });
        });
    }
  setcurrent (val) {
    this.setState({current:val});
  }
  formName(val) {
    this.setState({
      valueName:val,
      current:1
    }, () => {
      if(this.setState.valueName) {
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
      //     this.props.queryAll({accountName:this.state.valueName,companyId: this.state.company,accountType:this.state.accountType,empRealName:this.state.employee,startPage:1,limit:10});
      //   },800)
      // });
    });
  }
    query() {  //查询按钮
        this.setState({
            queryFlag: true //控制分页的展示
        });
        const vm = {
            companyId: this.state.company,
            userId: this.state.userId,
            name: this.state.name,
            accountType:this.state.accountType,
            empRealName:this.state.employee,
            startPage: 1,
            limit: 10
        };
        this.props.queryAll(vm);
        this.props.page({current: 1, pageSize: 10});
    }
  onTableChange(pagination, filters, sorter) {
    this.setState({
        psize:pagination.pageSize,
        current:pagination.current
    });
    const {valueName} = this.props;
    let order;
    let s;
    if(sorter.order) {
        if (/[A-Z]/g.test(sorter.field)) {
            s = sorter.field.replace(/[A-Z]/g, function (r) {
                const b = r.toLowerCase();
                return `_${b}`;
            });
        } else if (sorter.field === 'sexx') {
            s = 'sex';
        } else if (sorter.field === 'birthda') {
            s = 'birthday';
        } else if (sorter.field === 'zhuangtai') {
            s = 'stauts';
        } else {
            s = sorter.field;
        }
        sorter.order === 'descend' ? order = 'DESC' : order = 'ASC';
        this.props.sorter({sortfield: s, sortorder: order});
    }else {
        s=this.props.sortfield;
        order=this.props.sortorder;
    }
    if(this.props.queryFlag) {
        this.props.queryAll({accountName:valueName,companyId: this.state.company,accountType:this.state.accountType,empRealName:this.state.employee,startPage:pagination.current,limit:pagination.pageSize,sortField:s,sortOrder:order});
      }else {
        this.props.Alldatas({startPage:pagination.current,limit:pagination.pageSize,sortField:s,accountName:this.state.valueName,companyId: this.state.company,accountType:this.state.accountType,empRealName:this.state.employee,sortOrder:order});
    }
}
  renderTreeNodes(data) {
    return data.map((item) => {
        if (item.children) {
            return (
                <TreeNode title = {item.title} value={item.title} key={item.key} dataRef={item}>
                    {this.renderTreeNodes(item.children)}
                </TreeNode>
            );
        }
        return <TreeNode {...item} value={item.title} dataRef={item}/>;
    });
  }
  formLoadData(treeNode) {  //点击展开时的调用
    const listCompany = this.state.listCompany;
    return new Promise((resolve) => {
        IO.employee.CompanyChild({id: treeNode.props.dataRef.id}).then((res) => {
            const Treedata = Operation.CompanyTreelist(res.data, treeNode);
            treeNode.props.dataRef.children = Treedata;
            this.setState({
                listCompany:[...listCompany]
            });
        });
        resolve();
    });
}
    toggleForm() {
        const {expandForm} = this.state;
        this.setState({
            expandForm: !expandForm
        });
    }

    reset() {
        this.setState({
            employee:'',  //员工
            company:'',//所属企业
            accountType:'',
            valueName:'',
            companyName: ''
        }, () => {
            this.query();
        });
    }
    renderSimpleForm() {
        const { functionaryList } = this.props;
        const { listCompany } = this.state;
        const personList = [];
        if (functionaryList && functionaryList.length > 0) {
            personList.push({id: '',name: '全部'});
            functionaryList.forEach((item) => {
                personList.push(item);
            });
        }
        return (
            <Form layout="inline">
                <Row gutter={{md: 8, lg: 24, xl: 48}}>
                    <Col md={8} sm={24}>
                        <FormItem label="员工姓名">
                            <Select value={this.state.employee} onChange={this.setEmployee.bind(this)}
                                    showSearch
                                    placeholder="请选择员工名"
                                    optionFilterProp="children"
                                    filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}>
                                {(personList || []).map((item) => {
                                    return <Option key={item.id} value={item.name}>{item.name}</Option>;
                                })}
                            </Select>
                        </FormItem>
                    </Col>
                    <Col md={8} sm={24}>
                        <FormItem label="所属企业">
                            <TreeSelect
                                value={this.state.companyName}
                                loadData={this.formLoadData.bind(this)}
                                dropdownStyle={{maxHeight: 300, overflow: 'auto'}}
                                onChange={this.oncompanyChange.bind(this)}
                            >
                                {this.renderTreeNodes(listCompany)}
                            </TreeSelect>
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
        const { functionaryList,accountList } = this.props;
        const { listCompany } = this.state;
        const personList = [];
        if (functionaryList && functionaryList.length > 0) {
            personList.push({id: '',name: '全部'});
            functionaryList.forEach((item) => {
                personList.push(item);
            });
        }
        const accountsList =[];
        if (accountList && accountList.length > 0) {
            accountsList.push({id: '',name: '全部'});
            accountList.forEach((item) => {
                accountsList.push(item);
            });
        }
        return (
            <Form layout="inline">
                <Row gutter={{md: 8, lg: 24, xl: 48}}>
                    <Col md={8} sm={24}>
                        <FormItem label="员工姓名">
                            <Select value={this.state.employee} onChange={this.setEmployee.bind(this)}
                                    showSearch
                                    placeholder="请选择员工名"
                                    optionFilterProp="children"
                                    filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}>
                                {(personList || []).map((item) => {
                                    return <Option key={item.id} value={item.name}>{item.name}</Option>;
                                })}
                            </Select>
                        </FormItem>
                    </Col>
                    <Col md={8} sm={24}>
                        <FormItem label="所属企业">
                            <TreeSelect
                                value={this.state.companyName}
                                loadData={this.formLoadData.bind(this)}
                                dropdownStyle={{maxHeight: 300, overflow: 'auto'}}
                                onChange={this.oncompanyChange.bind(this)}
                            >
                                {this.renderTreeNodes(listCompany)}
                            </TreeSelect>
                        </FormItem>
                    </Col>
                    <Col md={8} sm={24}>
                        <FormItem label="账号类型">
                            <Select className='e' value={this.state.accountType} onChange={this.setAccountType.bind(this)}
                                    showSearch
                                    placeholder="请选择账号类型"
                                    optionFilterProp="children"
                                    filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}>
                                {(accountsList ||[]).map((item) => {
                                    return <Option key={item.id} value={item.id}>{item.name}</Option>;
                                })}
                            </Select>
                        </FormItem>
                    </Col>
                </Row>
                <Row gutter={{md: 8, lg: 24, xl: 48}}>
                    <Col md={8} sm={24}>
                        <FormItem label="账户名称">
                            <Formtitle Nameval={this.state.valueName} formName = {this.formName.bind(this)} querykeyword='账户名称'/>
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
    const { queryFlag, current} = this.state;
      const { dataList,companyList} = this.props;
      const companysList = [];
      if (companyList && companyList.length > 0) {
          companysList.push({id: '',name: '全部'});
          companyList.forEach((item) => {
              companysList.push(item);
          });
      }
    return (
      <div className='farming-box master-box'>
          <Card bordered={false}>
              <div className='content'>
                  <div className='tableList'>
                      <div className='tableListForm'>{this.renderForm()}</div>
                      <Tables current={current} setcurrent={this.setcurrent.bind(this)} valueName={this.state.valueName} company={this.state.company} accountType={this.state.accountType}employee={this.state.employee}  data={dataList} current={current} onTableChange={this.onTableChange.bind(this)} queryFlag={queryFlag}/>
                  </div>
              </div>
          </Card>
      </div>
    );
  }
}
const mapStateprops = (state) => {
  const {sortfield,sortorder}=state.accountReducer;
  const {Alldate} = state.accountReducer;
  const {functionaryList,companyList,accountList} = state.accountReducer;
  return {
    dataList:Alldate,
    sortfield, sortorder,
    functionaryList,
    companyList,
    accountList
  };
};
const WrappedNormalLoginForm = Form.create()(Resources);
export default connect(mapStateprops, action)(WrappedNormalLoginForm);