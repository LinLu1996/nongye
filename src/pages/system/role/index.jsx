import { Component } from 'react';
import {Button, Card, Col, Form, LocaleProvider, Row} from 'antd';
import Tables from './table.jsx';
import {connect} from 'react-redux';
import {action} from './model';
import ModalForm  from './modalForm.jsx';
import Formtitle from '@/component/formtitle/index.jsx';
import zhCN from 'antd/lib/locale-provider/zh_CN';
import {IO} from '@/app/io';
import '../../index.less';
import Empdep from './empdep/index.jsx';
import Com from '@/component/common';
import Operation from '../public.js';
const FormItem = Form.Item;
class Roles extends Component {
  constructor(props) {
    super(props);
    this.state={
      valueName:'',
      current:1,
      psize:10,
      closure:null,
      empdepisshow: false,
      listCompany:[]
    };
  }
  componentDidMount() {
    this.props.Alldatas({sortField:this.props.sortfield,sortOrder:this.props.sortorder,startPage:1,limit:this.state.psize});
      if(localStorage.getItem("accountType") === 'platform') {
        IO.role.CompanyAll().then((res) => {
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
      }
  }
  formName(val) {
    this.setState({
      valueName:val,
      current:1
    });
  }
  query() {
      this.props.Alldatas({
          sortField:this.props.sortfield,
          sortOrder:this.props.sortorder,
          roleName:this.state.valueName,
          startPage:1,
          limit:this.state.psize
      });
  }
  addmodel() {
    this.props.defaultFields({
      roleCode: {
        value: ''
      },
      roleName: {
        value: ''
      },
      roleState: {
        value: 0
      },
      roleType: {
        value: 2
      },
      companyId: {
        value: ''
      }
    });
    this.props.modal({modalFlag:true,modeltype:'add'});
  }
  onTableChange(pagination, filters, sorter) {
    this.setState({
      current:pagination.current,
      psize:pagination.pageSize
    });
    let s;
    let o;
    let order;
    if(sorter.order) {
      sorter.order==='descend'?order='DESC':order='ASC';
      if(sorter.field) {
        if(/[A-Z]/g.test(sorter.field)) {
          s = sorter.field.replace(/[A-Z]/g,function(r) {
            const b = r.toLowerCase();
            return `_${b}`;
          });
        }else {
          s=sorter.field;
        }
          o=order;
        }else {
          s='';
          o='';
        }
      this.props.sorter({sortfield:s,sortorder:o});
    }else {
      s=this.props.sortfield;
      o=this.props.sortorder;
  }
    this.props.Alldatas({sortField:s,sortOrder:o,roleName:this.state.valueName,startPage:pagination.current,limit:pagination.pageSize});
  }
  empdepshow(record) {
    this.setState({
      empdepisshow: true,
      emprole_: record
    });
  }
  empdephde() {
    this.setState({
      empdepisshow: false
    });
  }
  treeNodeData(treedatas) {
    this.setState({
      listCompany:[...treedatas]
    });
  }
  // onsizeChange(current) {
  //   this.setState({
  //       current:current
  //   });
  //   const { valueName }=this.state;
  //   this.props.Alldatas({sortField:this.props.sortfield,sortOrder:this.props.sortorder,roleName:valueName,startPage:current,limit:this.state.psize});
  // }
  getcurrent(num) {
    this.setState({
      current:num
    });
  }
  emptyName() {
    if(this.state.valueName) {
      this.setState({
        valueName:''
      });
    }
  }
  getpsize(num) {
      this.setState({
          psize:num,
          current:1
      });
  }
    reset() {
      this.setState({valueName:''},() => {
          this.query();
      });
    }
    renderForm() {
        return (
            <Form layout="inline">
                <Row gutter={{md: 8, lg: 24, xl: 48}}>
                    <Col md={8} sm={24}>
                        <FormItem label="角色名称">
                            <Formtitle Nameval={this.state.valueName} formName = {this.formName.bind(this)} querykeyword='角色名称'/>
                        </FormItem>
                    </Col>
                    <Col md={16} sm={24} style={{textAlign: 'right'}}>
                        <span className='submitButtons'>
                          <Button type="primary" htmlType="submit" onClick={this.query.bind(this)}>
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
  render() {
    const me = this;
    const {current, psize, empdepisshow,valueName, emprole_, listCompany} = this.state;
    const { dataList } = this.props;
    const TableOpt = {
        getcurrent:me.getcurrent.bind(me),
        empdepshow:me.empdepshow.bind(me),
        data:dataList,
        current:current,
        psize:psize,
        Nameval:valueName,
        onTableChange:me.onTableChange.bind(this),
        getpsize:me.getpsize.bind(me)
    };
    const ModelOpt = {
        cur:current,
        psize:psize,
        emptyName:me.emptyName.bind(me),
        Nameval:valueName,
        listCompany:listCompany,
        treeNodeData:me.treeNodeData.bind(me)
    };
    return (
      <div className='system-box'>
          <Card bordered={false}>
              <div className='tableList'>
                  <div className='tableListForm'>{this.renderForm()}</div>
                  <div className='content'>
                      {
                          (Com.hasRole(this.props.securityKeyWord, 'role_add', 'insert','role')) &&
                              <Row style={{marginBottom: '20px'}}>
                                  <Col span={24}>
                                      <Button type="primary" onClick={this.addmodel.bind(this)}>新增角色</Button>
                                  </Col>
                              </Row>
                      }
                      <LocaleProvider locale={zhCN}>
                          <Tables {...TableOpt}/>
                      </LocaleProvider>
                      {
                          empdepisshow ? <div className="zhezhao"></div> : ''
                      }
                      {
                          empdepisshow ? <Empdep emprole_={emprole_} empdephde={this.empdephde.bind(this)}/> : ''
                      }
                      <ModalForm {...ModelOpt}/>
                  </div>
              </div>
          </Card>
      </div>
    );
  }
}
const mapStateprops = (state) => {
  const {Alldate, sortfield, sortorder} = state.roleReducer;
  const { securityKeyWord } = state.initReducer;
  return {
    dataList:Alldate,
    securityKeyWord,
    sortfield, sortorder
  };
};
const WrappedNormalLoginForm = Form.create()(Roles);
export default connect(mapStateprops, action)(WrappedNormalLoginForm);
