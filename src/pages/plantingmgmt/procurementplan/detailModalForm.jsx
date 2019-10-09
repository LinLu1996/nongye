
import React, { Component } from 'react';
import {connect} from 'react-redux';
import {action,IOModel} from './model';
import {Modal, message, Table, DatePicker, Input, LocaleProvider, Form, Row, Col, Button, Icon} from 'antd';
import moment from "moment";
import './../index.less';
import './index.less';
const { RangePicker } = DatePicker;
const FormItem = Form.Item;
import zhCN from 'antd/lib/locale-provider/zh_CN';

class modifyModal extends Component {
  constructor(props) {
      super(props);
      this.state={
          visible: false,
          timeStart:moment(new Date(),'YYYY-MM-DD'),
          timeEnd:moment(new Date(),'YYYY-MM-DD').add(3,'months'),
          status: [],
          planCode: '',
          materialName: '',
          selectedRowKeys: [],
          selectedRows: [],
          closure: false,
          expandForm: false
      };
      this.columns = [    {
          title: '序号',
          dataIndex: 'key',
          key: 'key',
          align: "center",
          width: 100,
          render: (text, record, index) => {
              return <span>{index + 1}</span>;
          }
      },{
          title: '计划使用时间',
          dataIndex: 'plannedTime',
          align:"center",
          render(plannedTime) {
              return moment(plannedTime).format('YYYY-MM-DD');
          }
      },{
          title: '种植计划编号',
          dataIndex: 'workPlanCode',
          align:"center"
      },{
          title: '农事任务',
          dataIndex: 'name',
          align:"left"
      },{
          title: '农资名称',
          dataIndex: 'materialName',
          align:"left"
      },{
          title: '计划用量',
          dataIndex: 'plannedQty',
          align:"right"
      },{
          title: '用量单位',
          dataIndex: 'unitName',
          align:"left"
      },{
          title: '基地',
          dataIndex: 'baseName',
          align:"left"
      },{
          title: '地块',
          dataIndex: 'landName',
          align:"left"
      }];
  }
    componentDidMount() {
        //this.props.AllWaitDatas({companyId: 1,statrTime: this.state.timeStart,endTime: this.state.timeEnd});  //进入页面请求列表数据
        this.props.AllStatusQuery(); //状态数据字典
    }
  hideModal() {
      const {selectedRowKeys,selectedRows} = this.state;
      if(selectedRowKeys.length === 0) {
        Modal.warning({
          title: '提示',
          content:"请选择农资"
        });
          return;
      }
      const list = [];
      const list1 = [];
      //选中的农资
      selectedRows.forEach((item) => {
          const obj = {
              id: item.id,
              materialId: item.materialId,
              planId: item.planId,
              plannedQty: item.plannedQty
          };
          list.push(obj);
      });
      //已存在的农资
    const {detailInfo} = this.props;
    let data = [];
    if(detailInfo && detailInfo.materials && detailInfo.materials.length > 0) {
      detailInfo.materials.forEach((item) => {
        item.childList = [];
      });
      data =  detailInfo.materials;
    }
      data.forEach((item) => {
        const obj = {
          materialsId: item.materialId,
          plannedQty: item.plannedQty,
          totalValue: item.totalValue
        };
          list1.push(obj);
      });
      const vm = {
        companyId: 1,
        id: this.props.detailId,
        materialsList: JSON.stringify(list),
        extMaterials: JSON.stringify(list1)
      };
      IOModel.AddMaterials(vm).then((res) => {
          if(res.success) {
              message.success("添加成功");
              this.props.modal({modalFlag:false,modeltype:'add'});
          }
        this.props.refresh(this.props.detailId);
        this.childRefresh();
      }).catch((res) => {
        Modal.error({
          title: '提示',
          content:res.message
        });
      });
  }
  async childRefresh() {
    const idExpended = this.props.expanded;
    const childList = {};
    for(let i = 0; i < idExpended.length; i++) {
      const obj = {
        companyId: 1,
        procurementId: this.props.detailId,
        materialsId: idExpended[i].materialId
      };
      await IOModel.GetChild(obj).then((res) => {
        if(res.success) {
          childList[idExpended[i].materialId] = res.data || [];
        }
      }).catch();
    }
    await this.props.setChildList(childList);
  }
  hideCancel() {   //点击关闭的回调函数
    this.props.modal({modalFlag:false,modeltype:'add'});
  }
  handleFormChange (changedFields) {
    const fields = this.props.fields;
    this.props.defaultFields( { ...fields, ...changedFields });
  }
    dateChange(date) {
        if(date !== null && date.length > 0) {
            const timeStart= moment(date[0]).format('YYYY-MM-DD');
            const timeEnd= moment(date[1]).format('YYYY-MM-DD');
            this.setState({
                timeStart,
                timeEnd
            });
        }else{
            this.setState({
                timeStart: '',
                timeEnd: ''
            });
        }
        // this.query();
    }
    setPlanCode(event) {
        this.setState({
            planCode: event.target.value
        });
        // this.query();
    }
    setMaterialName(event) {
        this.setState({
            materialName: event.target.value
        });
        // this.query();
    }
    setStatus(event) {  //查找的表单-状态多选
        this.setState({
            status:event
        });
    }
    query() {  //查询按钮
        this.setState({
            queryFlag: true //控制分页的展示
        }, () => {
            if(this.state.closure) {
                clearTimeout(this.state.closure);
            }
            const vm={
                companyId: 1,
                materialName: this.state.materialName,
                statrTime:this.state.timeStart ? moment(this.state.timeStart).valueOf() : undefined,
                endTime: this.state.timeEnd ? moment(this.state.timeEnd).valueOf() : undefined,
                workPlanCode: this.state.planCode,
                statusIds: this.state.status
            };
            this.setState({
                closure : setTimeout(() => {
                    this.props.queryAllWait(vm);
                },800)
            });
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
          planCode: '',
          materialName: '',
          timeStart:moment(new Date(),'YYYY-MM-DD'),
          timeEnd:moment(new Date(),'YYYY-MM-DD').add(3,'months')
      },() => {
          this.query();
      });
    }
    renderSimpleForm() {
        return (
            <Form layout="inline">
                <Row gutter={{md: 8, lg: 24, xl: 48}}>
                    <Col md={9} sm={24}>
                        <FormItem label="农资日期范围">
                            <LocaleProvider locale={zhCN}>
                                <RangePicker className='rangePicker-farmAnalysis' style={{marginRight: '10px'}}
                                             value={this.state.timeStart ? [moment(this.state.timeStart), moment(this.state.timeEnd)] : []}
                                             onChange={this.dateChange.bind(this)}/>
                                {/*<RangePicker onChange={this.dateChange.bind(this)} value={[this.state.timeStart, this.state.timeEnd]} />*/}
                            </LocaleProvider>
                        </FormItem>
                    </Col>
                    <Col md={8} sm={24}>
                        <FormItem label="种植计划编号">
                            <Input value={this.state.planCode} onChange={this.setPlanCode.bind(this)}/>
                        </FormItem>
                    </Col>
                    <Col md={7} sm={24} style={{textAlign: 'right'}}>
                        <span className='submitButtons'>
                          <Button type="primary" onClick={this.query.bind(this)}>
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
        return (
            <Form layout="inline">
                <Row gutter={{md: 8, lg: 24, xl: 48}}>
                    <Col md={9} sm={24}>
                        <FormItem label="农资日期范围">
                            <LocaleProvider locale={zhCN}>
                                <RangePicker className='rangePicker-farmAnalysis' style={{marginRight: '10px'}}
                                             value={this.state.timeStart ? [moment(this.state.timeStart), moment(this.state.timeEnd)] : []}
                                             onChange={this.dateChange.bind(this)}/>
                                {/*<RangePicker onChange={this.dateChange.bind(this)} value={[this.state.timeStart, this.state.timeEnd]} />*/}
                            </LocaleProvider>
                        </FormItem>
                    </Col>
                    <Col md={8} sm={24}>
                        <FormItem label="种植计划编号">
                            <Input value={this.state.planCode} onChange={this.setPlanCode.bind(this)}/>
                        </FormItem>
                    </Col>
                    <Col md={7} sm={24}>
                        <FormItem label="农资名称">
                            <Input value={this.state.materialName} onChange={this.setMaterialName.bind(this)}/>
                        </FormItem>
                    </Col>
                </Row>
                <Row gutter={{md: 8, lg: 24, xl: 48}}>
                    <Col span={24} style={{textAlign: 'right'}}>
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
    const { modalflag,dataList } = this.props;
    const rowSelection = {
        onChange:(selectedRowKeys, selectedRows) => {
            this.setState({ selectedRowKeys,selectedRows });
        }
    };
    const title="添加农资";
    return (
      <div>
        <Modal width={1000}
          title={title}
          visible={modalflag}
          onOk={this.hideModal.bind(this)}
          onCancel={this.hideCancel.bind(this)}
          okText="确认"
          cancelText="取消"
        >
            <div className='farming-box plan-detail-modal'>
                <div className='content'>
                    <div className='tableList'>
                        <div className='tableListForm'>{this.renderForm()}</div>
                        <div className='procurement-add-table'>
                            <LocaleProvider locale={zhCN}>
                                <Table rowKey={record => record.id} rowSelection={rowSelection} columns={this.columns}  dataSource={dataList} pagination={false}/>
                            </LocaleProvider>
                        </div>
                    </div>
                </div>
            </div>
        </Modal>
      </div>
    );
  }
}
const mapStateprops = (state) => {
  const {detailData,isOk,parentname,childData,parentID,Cur,Psize,fields,modalflag,chooseCUR, chooseSIZE,modaltype, TreeD, slideID,modifyID,slideparentID,slideName,AllWaitData,statusDic} = state.procurementplanReducer;
  return {
    detailInfo: detailData,
    isok:isOk,
    parentName:parentname,
    parentID,modifyID,childData,
    Cur,
    Psize,
    fields:fields,
    modalflag,modaltype,TreeD,slideID,
    chooseCUR, chooseSIZE,slideparentID,slideName,
    dataList: AllWaitData,
    statusList: statusDic
  };
};
const WrappedNormalLoginForm = Form.create()(modifyModal);
export default connect(mapStateprops, action)(WrappedNormalLoginForm);
