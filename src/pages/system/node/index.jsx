import {Component} from 'react';
import {Button, Card, Col, Form, message, Modal, Row} from 'antd';
import Operation from '../public.js';
import Tables from './table.jsx';
import {connect} from 'react-redux';
import {action, IO} from './model';
import EmployeeRole from './employeerole/index.jsx';
import Formtitle from '@/component/formtitle/index.jsx';
import ModalForm from './modalForm.jsx';
import RightSide from '@/component/rightSides/index.jsx';
import Zoomable from 'react-stretchable';
import '../../index.less';
import './index.less';
import Com from '@/component/common';
const confirm = Modal.confirm;
const FormItem = Form.Item;
class Resources extends Component {
    constructor(props) {
        super(props);
        this.state = {
            valueName: '',//筛选的条件
            chooseId: null,
            value: '全部',
            current: 1,
            psize: 10,
            queryFlag: false,
            chooseFlag: false,
            closure: null,
            Treeflag: true,
            queryF:false,
            ModelParentName:'节点',
            changedata:{},
            TreeParent:[]
        };
    }

    componentDidMount() {
        const Treeparentdata=[];
        this.props.TreeData({tree: []});
        this.props.Alldatas({
            sortField: this.props.sortfield,
            sortOrder: this.props.sortorder,
            startPage: 1,
            limit: this.state.psize
        });  //进入页面请求列表数据
        this.props.slide({num: -1,slideName: '节点'});
        IO.node.TreeData().then((res) => {  //请求侧边树的数据
            let treedata;
            if (!res.data) {
                treedata = [];
            } else {
                treedata = res.data;
                this.setState({
                    TreeParent:this.treedata(this.TreeParent(res.data,Treeparentdata))
                });
                this.props.TreeData({tree: treedata});
            }
        });
    }
    treedata(data) {
        return data.map(item => {
          if (item.childrens) {
            item.childrens = this.treedata(item.childrens);
          }
          return Object.assign({},item,{
            title : item.nodeName,
            key : item.id
          });
        });
      }
    TreeParent(data,Treeparentdata) {
        data.map((item) => {
            let isleaf;
            item.leaf===0 ? isleaf=false: isleaf=true;
            const d = Object.assign({},item,{
                isLeaf:isleaf,
                childrens:[]
            });
            Treeparentdata.push(d);
        });
        return Treeparentdata;
    }
    formName(val) {  //查找的表单
        this.setState({
            valueName: val,
            current: 1
        }, () => {
            if (this.state.valueName) {
                if (this.state.queryF) {
                    this.setState({
                        chooseFlag: true,
                        queryFlag: false
                    });
                } else {
                    this.setState({
                        queryFlag: true,
                        chooseFlag: false
                    });
                }
            } else {
                this.setState({
                    queryFlag: false
                });
            }
            // if (this.state.closure) {
            //     clearTimeout(this.state.closure);
            // }
            // this.setState({
            //     closure: setTimeout(() => {
            //         if (!this.state.queryF) {
            //             this.props.Alldatas({
            //                 sortField: this.props.sortfield,
            //                 sortOrder: this.props.sortorder,
            //                 nodeName: this.state.valueName,
            //                 startPage: 1,
            //                 limit: this.state.psize
            //             });
            //         } else {
            //             this.props.chooseAll({
            //                 sortField: this.props.sortfield,
            //                 sortOrder: this.props.sortorder,
            //                 nodeName: this.state.valueName,
            //                 startPage: 1,
            //                 limit: this.state.psize,
            //                 id: this.state.chooseId
            //             });
            //         }
            //     }, 800)
            // });
        });
    }
    query() {
        if (!this.state.queryF) {
            this.props.Alldatas({
                sortField: this.props.sortfield,
                sortOrder: this.props.sortorder,
                nodeName: this.state.valueName,
                startPage: 1,
                limit: this.state.psize
            });
        } else {
            this.props.chooseAll({
                sortField: this.props.sortfield,
                sortOrder: this.props.sortorder,
                nodeName: this.state.valueName,
                startPage: 1,
                limit: this.state.psize,
                id: this.state.chooseId
            });
        }
    }
    formChange(node,selected) {  //点击每一条数据的方法
        this.setState({
            value: node.props.nodeName,
            valueName:'',
            current: 1,
            queryF:selected,
            changedata:node.props
        }, () => {
        const num = node.props.id;
            if (!selected) {
                this.props.Alldatas({
                    sortField: this.props.sortfield,
                    sortOrder: this.props.sortorder,
                    startPage: 1,
                    limit: this.state.psize
                });
                this.setState({
                    chooseFlag: false,
                    queryFlag: true,
                    chooseId: null,
                    current: 1,
                    Treeflag: true
                });
            } else {
                this.props.chooseAll({
                    sortField: this.props.sortfield,
                    sortOrder: this.props.sortorder,
                    id: num,
                    nodeName: this.state.valueName,
                    limit: this.state.psize,
                    startPage: 1
                });
                this.setState({
                    chooseId: num,
                    chooseFlag: true,
                    queryFlag: false,
                    Treeflag: false
                });
            }
            this.props.slide({num: num, slideName: !selected ? '节点' : node.props.nodeName});
            if (!selected) {
                this.setState({ModelParentName: '节点'});
                this.props.slide({num: -1, slideName: '节点'});
            } else {
                this.setState({ModelParentName: node.props.nodeName});
            }
        });
    }

    addmodel(record,e) {   //增加的按钮
        if(e) {
            if(this.state.queryF) {
                if(this.state.changedata.nodeName===record.nodeName) {
                    e.stopPropagation();
                }
            }
        }
        if(!e && !this.state.queryF) {
            this.setState({ModelParentName: '节点'});
            this.props.slide({num: -1, slideName: '节点'});
        }else if(this.state.queryF && !e) {
            this.props.slide({num: this.state.changedata.id, slideName: this.state.changedata.nodeName});
            this.setState({ModelParentName: this.state.changedata.nodeName});
        }else if(e) {
            this.props.slide({num: record.id, slideName: record.nodeName});
            this.setState({ModelParentName: record.nodeName});
        }
        this.props.modal({modalFlag: true, modeltype: 'add'});
        this.props.defaultFields({
            word: {
                value: ''
            },
            name: {
                value: ''
            }
        });
    }
    onTableChange(pagination, filters, sorter) {
        this.setState({
            current: pagination.current,
            psize:pagination.pageSize
        });
        const {Alldatas, chooseAll} = this.props;
        let s;
        let o;
        let order;
        if(sorter.order) {
            sorter.order === 'descend' ? order = 'DESC' : order = 'ASC';
            if (sorter.field) {
                if (/[A-Z]/g.test(sorter.field)) {
                    s = sorter.field.replace(/[A-Z]/g, function (r) {
                        const b = r.toLowerCase();
                        return `_${b}`;
                    });
                } else {
                    s = sorter.field;
                }
                o = order;
            } else {
                s = '';
                o = '';
            }
            this.props.sorter({sortfield: s, sortorder: o});
        }else {
            s=this.props.sortfield;
            o=this.props.sortorder;
        }
        if (this.state.Treeflag) {
            Alldatas({
                sortField: s,
                sortOrder: o,
                nodeName: this.state.valueName,
                startPage: pagination.current,
                limit: pagination.pageSize
            });
        } else {
            chooseAll({
                sortField: s,
                sortOrder: o,
                nodeName: this.state.valueName,
                id: this.props.slideID,
                startPage: pagination.current,
                limit: pagination.pageSize
            });
        }
    }
    deleteR(record,e) {
        let tit;
        e.stopPropagation();
        if ((record.leaf===0 && record.childrens && record.isLeaf===false) || (record.childrens && record.childrens.length>0)) {
            tit = '您确定连同子元素一起删除吗？';
        } else {
            tit = '是否确认删除？';
        }
        const _this = this;
        confirm({
            title: tit,
            okText: '确认',
            okType: 'primary',
            cancelText: '取消',
            onOk() {
                _this.confirm(record);
            }
        });
    }
    confirm(record) {
        const {Alldatas, chooseAll} = this.props;
        const deleteID = record.id;
        this.props.RightsearchFlag({flag:true});
       // Operation.systemDelete(Operation.listurl(this.props.list, 'node_delete'));
        IO.node.delete({':id': deleteID}).then((res) => {
            if (res.success) {
                const deletedata = Operation.deletetree(this.props.TreeD, record);
                this.props.TreeData({tree: [...deletedata]});
                let lencurrent;
                if (this.props.dataList.length === 1) {
                    //lencurrent = 1;
                    lencurrent = this.state.current - 1;
                    this.setState({
                        current:this.state.current - 1
                    });
                    //this.props.getcurrent(this.props.current);
                } else {
                    lencurrent = this.state.current;
                }
                if (!this.state.queryF) {
                    Alldatas({
                        sortField: this.props.sortfield,
                        sortOrder: this.props.sortorder,
                        nodeName: this.props.Nameval,
                        startPage: lencurrent,
                        limit: this.state.psize
                    });
                } else {
                    chooseAll({
                        sortField: this.props.sortfield,
                        sortOrder: this.props.sortorder,
                        nodeName: this.props.Nameval,
                        id: this.props.slideID,
                        startPage: lencurrent,
                        limit: this.state.psize
                    });
                }
                message.success('删除成功');
            }
        }).catch((res) => {
            this.setState({
                loadflag: false
            });
            Com.errorCatch(res);
        });
    }
    editor(record,e) {
        e.stopPropagation();
        const querydata = {
            word: {
                value: record.keyword
            },
            name: {
                value: record.nodeName
            }
        };
        this.props.rightqueryItem(record);
        this.props.defaultFields(querydata);
        this.props.querydefaultfields(querydata);
        this.props.querylist({parentID: record.parentId, modifyid: record.id, modifycode: record.resourceCode});
        record.parentId === -1 ? this.setState({ModelParentName: '节点'}) : this.setState({ModelParentName: record.parentName});
        this.props.modal({modalFlag: true, modeltype: 'modify'});
    }
    getcurrent(num) {
      this.setState({
        current: num
      });
    }
    empdepshow (record) {
      this.setState({
        empdepisshow:true,
        emprole_:record
      });
    }
    empdephde () {
      this.setState({
        empdepisshow:false
      });
    }
    getNameval() {
      this.setState({
        valueName:''
      });
    }
    reset() {
        this.setState({
            valueName: ''
        },() => {
            this.query();
        });
    }
    renderSimpleForm() {
        return (
            <Form layout="inline">
                <Row gutter={{md: 8, lg: 24, xl: 48}}>
                    <Col md={8} sm={24}>
                        <FormItem label="节点名称">
                            <Formtitle value={this.state.value} Nameval={this.state.valueName} keyword='节点配置' querykeyword='节点名称'
                                       formChange={this.formChange.bind(this)}
                                       formName={this.formName.bind(this)}/>
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
    renderForm() {
        return this.renderSimpleForm();
    }
    render() {
        const me = this;
        const {queryFlag, current, psize,empdepisshow,emprole_,chooseFlag, valueName, Treeflag} = this.state;
        const {dataList, TreeD, securityKeyWord, searchflag} = this.props;
        const RightSideOpt = {
            TreeDatalist:TreeD,
            add:me.addmodel.bind(me),
            editor:me.editor.bind(me),
            deleteR:me.deleteR.bind(me),
            keyword:'node',
            securityKeyWord:securityKeyWord,
            formChange:me.formChange.bind(me),
            ref:self => {me.rightSides = self;},
            TreeParent:this.state.TreeParent,
            searchflag:searchflag
        };
        const TableOpt = {
            data:dataList,
            showDeleteConfirm:me.deleteR.bind(me),
            query:me.editor.bind(me),
            onTableChange:me.onTableChange.bind(me),
            keydata:me.props.securityKeyWord,
            Treeflag:Treeflag,
            Nameval:me.state.valueName,
            current: current,
            queryFlag:queryFlag,
            chooseFlag:chooseFlag,
            empdepshow:me.empdepshow.bind(me)
        };
        const zoomableOpt = {
            draggable: {
                used: false
            },
            zoomable: {
                width: {
                    min: 150,
                    max: 300
                },
                direction: ["right"]
            },
            fixedHeight: "100%"
        };
        return (
            <div className ='system-box tree-box'>
                <div className='wrap' style={{display: 'none'}}>
                    <Zoomable {...zoomableOpt}>
                        <RightSide {...RightSideOpt}/>
                    </Zoomable>
                </div>
                <Card bordered={false}>
                    <div className='system-tree-rightbox'>
                        <div className='content'>
                            <div className='tableListForm'>{this.renderForm()}</div>
                            {(Com.hasRole(this.props.securityKeyWord, 'node_add', 'insert', 'node')) ?
                                <Row style={{marginBottom: '20px'}}>
                                    <Col span={24}>
                                        <Button type="primary" onClick={this.addmodel.bind(this)}>新增节点</Button>
                                    </Col>
                                </Row> : ''}
                            <Tables {...TableOpt} getcurrent={this.getcurrent.bind(this)} />
                            {
                                empdepisshow ?<div className="zhezhao"></div> :''
                            }
                            {
                                empdepisshow ? <EmployeeRole emprolehide={this.empdephde.bind(this)}
                                                            idss={emprole_}/> : ''
                            }
                            <ModalForm
                                cur={current}
                                psize={psize}
                                Treeflag={Treeflag}
                                Nameval={valueName}
                                props={this.props}
                                val={this.state.value}
                                ModelParentName={this.state.ModelParentName}
                                getNameval={this.getNameval.bind(this)}
                            />
                        </div>
                    </div>
                </Card>
            </div>
        );
    }
}

const mapStateprops = (state) => {
    const {Alldate, slideName, TreeD, sortfield,searchflag, sortorder, slideID, total, flag} = state.nodeReducer;
    const {securityKeyWord} = state.initReducer;
    return {
        dataList: Alldate,//展示列表的数据
        slideName, TreeD,
        securityKeyWord,
        sortfield,
        sortorder,
        slideID,
        list: state.systemReducer.listdata,
        total: total,
        flag, searchflag
    };
};
const WrappedNormalLoginForm = Form.create()(Resources);
export default connect(mapStateprops, action)(WrappedNormalLoginForm);
