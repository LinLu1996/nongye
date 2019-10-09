import {Component} from 'react';
import {connect} from 'react-redux';
import {action, IOModel} from './model';
//import moment from 'moment';
import {Modal, Input, Form, message,Select} from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;
const CustomizedForm = Form.create({
    onFieldsChange(props, changedFields) {
        props.onChange(changedFields);
    },
    mapPropsToFields(props) {
        return {
            id: Form.createFormField({
                value: props.id.value
            }),
            name: Form.createFormField({
                ...props.name,
                value: props.name.value
            }),
            crops: Form.createFormField({
                ...props.crops,
                value: props.crops.value
            })
        };
    }
})((props) => {
    const {getFieldDecorator} = props.form;
    let disableFlag;
    props.modaltype!=='modify' ? disableFlag=false : disableFlag=true;
    props.getForm(props.form);
    return (
            <Form layout="inline">
                <FormItem label="作物名称">
                    {getFieldDecorator('crops', {
                        rules: [{required: true, message: '请输入作物名称'}]
                    })(<Select style={{width: 300}} disabled={disableFlag}>
                        {props.astgropdata.value.map((item) => {
                            return <Option key={item.id} value={item.id}>{item.name}</Option>;
                        })}
                    </Select>)}
                </FormItem>
                <FormItem label="农资方案名称">
                    {getFieldDecorator('name', {
                        rules: [{required: true, message: '请输入农资方案名称'}]
                    })(<Input/>)}
                </FormItem>
            </Form>
    );
});

class modifyModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: false
        };
    }

    getForm(value) {
        this.formValitate = value;
    }

    hideModal(e) {   //点击确定的回调
        const {name, crops} = this.props.fields;
        const {modaltype,Name} = this.props;
        e.preventDefault();
        this.formValitate.validateFields((err) => {
            if (!err) {
                if(this.props.saveFlag) {
                  if (modaltype === 'add') {
                    let addData = {};
                      addData = {
                        name: name.value,
                        cropId: crops.value
                      };
                    IOModel.Adddata(addData).then((res) => {  //添加成功时的回调
                      if (res.success) {
                          message.success('添加成功');
                            this.props.Alldatas({startPage: this.props.cur, limit: this.props.psize,name:Name});
                          this.props.modal({modalFlag: false});
                      } else {
                        message.error('添加失败');
                      }
                      this.props.modal({modalFlag: false});
                    }).catch(() => {
                      message.error('添加失败');
                    });
                  } else if (modaltype === 'modify') {
                    let modifydata = {};
                    //if (workTypeName.value === 'protection') {
                      modifydata = {
                        id: this.props.fields.id.value,
                        name: name.value,
                        cropId:crops.value
                      };
                    IOModel.Modifydata(modifydata).then((res) => {  //修改成功时的回调
                      if (res.success) {
                          message.success('修改成功');
                          this.props.Alldatas({startPage: this.props.cur, limit: this.props.psize,name:Name});
                      } else {
                        message.error('修改失败');
                      }
                      this.props.modal({modalFlag: false});
                    }).catch(() => {
                      message.error('修改失败');
                    });
                  }
                }else{
                  message.warning('农资名已存在');
                }
            }
        });
    }

    hideCancel() {   //点击关闭的回调函数
        this.props.modal({modalFlag: false, modeltype: 'add'});
    }

    handleFormChange(changedFields) {
        const fields = this.props.fields;
        this.props.defaultFields({...fields, ...changedFields});
    }

    render() {
        const {modalflag, parentName, modaltype, fields} = this.props;
        let title = "编辑农资标准组";
        if (modaltype === 'add') {
            title = "新增农资标准组";
        }
        return (
            <div>
                <Modal
                    title={title}
                    visible={modalflag}
                    onOk={this.hideModal.bind(this)}
                    onCancel={this.hideCancel.bind(this)}
                    okText="确认"
                    cancelText="取消"
                    wrapClassName='farming-admin-modal material-modal'
                >
                    <CustomizedForm {...fields} onChange={this.handleFormChange.bind(this)} parentName={parentName}
                                    getForm={this.getForm.bind(this)} checkName={this.props.checkName} modaltype={this.props.modaltype}/>
                </Modal>
            </div>
        );
    }
}

const mapstateProps = (state) => {
    const {Alldate, isOk, parentname, parentID,fields, modalflag, chooseCUR, chooseSIZE, modaltype, TreeD, slideID, modifyID, slideparentID, slideName} = state.AGIdetailReducer;
    return {
        isok: isOk,
        parentName: parentname,
        parentID, modifyID,
        dataList: Alldate,
        fields: fields,
        modalflag, modaltype, TreeD, slideID,
        chooseCUR, chooseSIZE, slideparentID, slideName
    };
};
export default connect(mapstateProps, action)(modifyModal);
