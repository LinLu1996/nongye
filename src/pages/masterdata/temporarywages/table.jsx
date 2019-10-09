import {Table, InputNumber, Form, LocaleProvider,Select, Pagination} from 'antd';
import {connect} from 'react-redux';
import {action} from './model';
import { Component } from 'react';
import React from 'react';
import '../../index.less';
import './index.less';
import zhCN from "antd/lib/locale-provider/zh_CN";
import {wageIOMode} from "@/pages/masterdata/temporarywages/model";
import Com from "@/component/common";
const Option=Select.Option;
const FormItem = Form.Item;
const EditableContext = React.createContext();

const EditableRow = ({ form, ...props }) => (
  <EditableContext.Provider value={form}>
    <tr {...props} />
  </EditableContext.Provider>
);

const EditableFormRow = Form.create()(EditableRow);
class EditableCell extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            editing: false
        };
    }
    getInput(data) {
      if (this.props.inputtype === 'number') {
          return <InputNumber  min={0}/>;
        }else if(data && this.props.inputtype === 'select') {
          return <Select>
                    {data && data.map((val) => {
                      return <Option value={val.id} key={val.id}>{val.unitName}</Option>;
                   })
                  }
                </Select>;
      }else {
          return <div></div>;
        }
    }
  render() {
    const {
      editing,
      dataIndex,
      title,
      record,
      unitlist,
      ...restProps
    } = this.props;
    return (
      <td ref={node => (this.cell = node)}>
        {(
          <EditableContext.Consumer {...restProps}>
            {(form) => {
              this.form = form;
              return (
                editing ? (
                  <FormItem style={{ margin: 0 }}>
                    {form.getFieldDecorator(dataIndex, {
                    rules: [{
                      required: true,
                      message: `Please Input ${title}!`
                    }],
                    initialValue: record[dataIndex]
                  })(this.getInput(unitlist))}
                  </FormItem>
                ) : (
                  <div
                    className="editable-cell-value-wrap"
                    style={{ paddingRight: 24 }}
                    //onClick={this.toggleEdit}
                  >
                    {restProps.children}
                  </div>
                )
              );
            }}
          </EditableContext.Consumer>
        )}
      </td>
    );
  }
}
class Tables extends Component {
  constructor(props) {
    super(props);
    this.state={
      selectedRowKeys:[],
      all:[],
      editingKey:'',
      unitlist:[]
    };
  }
    async componentDidMount() {
        this.columns = [
            {
                title: '序号',
                dataIndex: 'key',
                width:100,
                key: 'key',
                align: 'center',
                render: (text, record, index) => {
                    return <span>{index + 1}</span>;
                }
            },{
                title: '农事操作',
                dataIndex: 'operationName',
                align:"left"
            },{
                title:'计量单位',
                align:"center",
                dataIndex: 'unitName',
                editable: true
                // render: (text, record,index) => {
                //     return <div>
                //         <Select  onChange = {this.onChange.bind(this,record,index)} value={record.unitName} style={{width:"100px",marginLeft:"10px"}}
                //         >
                //             {unitlist.map((item) => {
                //                 return <Option key={item.id} value={item.id}>{item.unitName}</Option>;
                //             })}
                //         </Select>
                //     </div>;
                // }
            },{
                title: '单位薪酬（元）',
                dataIndex: 'wage',
                align:"right",
                editable: true
            },
            {
                title: '操作',
                dataIndex: 'operation',
                render: (text, record) => {
                    const editable = this.isEditing(record);
                    return (
                        <div>
                            {editable ? (
                                <span>
                                    <EditableContext.Consumer>
                                      {form => (
                                          <a onClick={() => this.save(form, record)}>保存</a>
                                          /*<Tooltip placement="top" title='保存'><span className='cursor'
                                                                                    onClick={() => this.save(form, record)}><i
                                              className='iconfont icon-baocun'></i></span></Tooltip>*/
                                      )}
                                    </EditableContext.Consumer>
                                  </span>
                            ) : (
                                <a onClick={() => this.edit(record)}>编辑</a>
                                /*<Tooltip placement="top" title='编辑'><span className='cursor'
                                                                          onClick={() => this.edit(record)}><i
                                    className='iconfont icon-xiugai07'></i></span></Tooltip>*/
                            )}
                        </div>
                    );
                }
            }];
        await wageIOMode.getAllUnit().then((res) => {
            const unitlist = [];
            const list = res.data;
            if (list.length > 0) {
                for(let i=0; i<list.length; i++) {
                    unitlist.push(list[i]);
                }
            }
            this.setState({
              unitlist:unitlist
            });
        }).catch();
    }
    // onChange(record,index,value) {
    //   this.props.handleColumns(record,index,value);
    // }
    isEditing(record) {
      return record.id === this.state.editingKey;
    }
    edit(record) {
      this.setState({ editingKey: record.id, defaultunitId:''});
    }
    save(form,record) {
      //const { record } = this.props;
      form.validateFields((error, values) => {
        if (error) {
          return;
        }
        this.setState({
          editingKey:''
        });
       this.props.handleSave(values,record);
      });
    }
    onShowSizeChange(current, pageSize) {
      this.props.onShowSizeChange(current, pageSize);
    }
    onSizeChange(current, pageSize) {
      this.props.onSizeChange(current, pageSize);

    }
  render() {
    const components = {
          body: {
            row: EditableFormRow,
            cell: EditableCell
          }
        };
    const columns = this.columns && this.columns.map((col) => {
      if (!col.editable) {
        return col;
      }
      return {
        ...col,
        onCell: record => ({
          record,
          inputtype: col.dataIndex === 'wage' ? 'number' : 'select',
          dataIndex: col.dataIndex,
          title: col.title,
          unitlist:this.state.unitlist,
          editing: this.isEditing(record)
        })
      };
    });
    const {current,total, data, securityKeyWord} = this.props;
      let newColumn;
      if(columns) {
          Com.hasRole(securityKeyWord, 'temporaryWages_add', 'update') ? newColumn = columns : newColumn = columns.slice(0, columns.length - 1);
      }else {
          newColumn = columns;
      }
    return (
      <div className='res-table temporarywage-table'>
        <LocaleProvider locale={zhCN}>
          <Table components={components}
               rowClassName={() => 'editable-row'}
               rowKey={record => record.id}
               dataSource={data}
               pagination={false}
              columns={newColumn}/></LocaleProvider>
        <LocaleProvider locale={zhCN}><Pagination className='XGres-pagination' showSizeChanger showQuickJumper onShowSizeChange={this.onShowSizeChange.bind(this)}  onChange={this.onSizeChange.bind(this)} current={current} defaultCurrent={1}  total={total} /></LocaleProvider>
      </div>
    );
  }
}
const mapstateprops = (state) => {
  const {saveFlag,Cur, Psize, deleteOK,parentname, TreeD, slideID, chooseSIZE, chooseCUR  } = state.temporaryWagesReducer;
    const { securityKeyWord } = state.initReducer;
  return {
    saveFlag,
    Cur,
    Psize,
    deleteok:deleteOK,
    TreeD,
    parentName:parentname,
    slideID, chooseSIZE, chooseCUR,securityKeyWord
  };
};
export default connect(mapstateprops,action)(Tables);
