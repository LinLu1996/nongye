import {Component} from 'react';
import {Input, Button, Form, Row, Col, Card} from 'antd';
import Tables from './table.jsx';
import {connect} from 'react-redux';
import {action} from './model';
import ModalForm from './modalForm.jsx';
import ModalTwo from './modalTwo.jsx';
import './../../index.less';
import './index.less';
import Com from '@/component/common';

const FormItem = Form.Item;
class CropMaintenance extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: '',//作物大类名称
            queryFlag: false,  //筛选按钮
            chooseId: null,
            saveFlag: true,
            saveFlag2: true,
            psize:10,
            current:1,
            closure:null
        };
    }

    componentDidMount() {
        this.props.Alldatas({startPage: this.state.current, limit: this.state.psize, parentId: -1}); //进入页面请求列表数据
        this.props.superiorName({name: '作物大类', parentLeftID: -1});
    }

    setBaseName(event) {  //查找的表单-作物大类名称
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
          // if(this.state.closure) {
          //   clearTimeout(this.state.closure);
          // }
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
            name: this.state.name,
            parentId:-1,
            startPage: this.state.current,
            limit: this.state.psize
        };
        this.props.queryAll(vm);
        this.props.page({current:1, pageSize:10});
    }
    onTableChange(pagination) {  //点击筛选的分页按钮
        this.setState({
            current:pagination.current,
            psize:pagination.pageSize
        });
        const vm = {
            name: this.state.name,
            startPage: pagination.current,
            parentId:-1,
            limit: pagination.pageSize
        };
        this.props.queryAll(vm);
    }

    addmodel() {   //增加的按钮
        this.props.defaultFields({
            name: {
                value: ''
            },
            parentId: {
                value: ''
            },
            code: {
                value: ''
            },
            modeltype: {
                value: 'add'
            }
        });
        this.props.modal({modalFlag: true, modeltype: 'add'});
    }

    fnondrag(num) {   //点击左侧边的id
        this.setState({
            chooseId: num
        });
    }
    reset() {
        this.setState({
            name: ''
        },() => {
            this.query();
        });
    }
    renderForm() {
        return (
            <Form layout="inline">
                <Row gutter={{md: 8, lg: 24, xl: 48}}>
                    <Col md={8} sm={24}>
                        <FormItem label="大类名称">
                            <Input value={this.state.name} placeholder='请输入大类名称' onChange={this.setBaseName.bind(this)}/>
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
        const {securityKeyWord} = this.props;
        const addRole = Com.hasRole(securityKeyWord, 'dictionary_add', 'insert','dictionary');
        const editRole = Com.hasRole(securityKeyWord, 'dictionary_update', 'update','dictionary');
        const deleteRole = Com.hasRole(securityKeyWord, 'dictionary_delete', 'delete','dictionary');
        const statusRole = Com.hasRole(securityKeyWord, 'dictionary_setStatusById', 'status','dictionary');
        const {queryFlag, Alldate} = this.state;
        return (
            <div className='farming-box master-box'>
                <Card bordered={false}>
                    <div className='content categoryContent'>
                        <div className='tableListForm'>{this.renderForm()}</div>
                        {addRole &&
                        <Row style={{marginBottom: '20px'}}>
                            <Col span={24}>
                                <Button type="primary" onClick={this.addmodel.bind(this)}>新增分类</Button>
                            </Col>
                        </Row>}
                        {<Tables data={Alldate} name={this.state.name} editRole={editRole} deleteRole={deleteRole} statusRole={statusRole} addRole={addRole}
                                              onTableChange={this.onTableChange.bind(this)}
                                              cur={this.state.current}
                                              queryFlag={queryFlag}/>}
                        <ModalForm props={this.props} name={this.state.name} query={this.query.bind(this)}   saveFlag={this.state.saveFlag} cur={this.state.current} psize={this.state.psize}/>
                        <ModalTwo props={this.props}  saveFlag2={this.state.saveFlag2} cur={this.state.current} psize={this.state.psize}/>
                    </div>
                </Card>
            </div>
        );
    }
}

const mapStateprops = (state) => {
    const {Alldate, slideName} = state.dictionaryReducer;
    const { securityKeyWord } = state.initReducer;
    return {
        Alldate,//展示列表的数据
        slideName,
        securityKeyWord
    };
};
const WrappedNormalLoginForm = Form.create()(CropMaintenance);
export default connect(mapStateprops, action)(WrappedNormalLoginForm);
