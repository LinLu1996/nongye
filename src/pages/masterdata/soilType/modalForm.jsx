import {Component} from 'react';
import {connect} from 'react-redux';
import {action, IOModel} from './model';
import {Modal, Input, Form, message} from 'antd';

const FormItem = Form.Item;
const CustomizedForm = Form.create({
    onFieldsChange(props, changedFields) {
        props.onChange(changedFields);
    },
    mapPropsToFields(props) {
        return {
            name: Form.createFormField({
                ...props.name,
                value: props.name.value
            }),
            code: Form.createFormField({
                ...props.code,
                value: props.code.value
            })
        };
    }
})((props) => {
    const {getFieldDecorator} = props.form;
    props.getForm(props.form);
    return (
        <Form layout="inline">
            <FormItem label="类型名称">
                {getFieldDecorator('name', {
                    rules: [{required: true, message: '请输入类型名称'}]
                })(<Input/>)}
            </FormItem>
            <FormItem label="英文名称">
                {getFieldDecorator('code', {
                    rules: [{required: true, message: '请输入英文名称'},
                    {pattern: /^[0-9a-zA-Z]*$/, message: '只能输入英文和数字'}]
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
        const {name, code} = this.props.fields;
        const {current, psize,modaltype,names} = this.props;
        e.preventDefault();
        this.formValitate.validateFields((err) => {
            if (!err) {
                  if (modaltype === 'add') {
                    const addData = {
                      name: name.value,
                      code:code.value
                    };
                    IOModel.Adddata(addData).then((res) => {  //添加成功时的回
                      if (res.success) {
                          message.success('添加成功');
                          this.props.Alldatas({startPage: current, limit: psize,name:names,sortField: 'gmt_create',sortOrder: 'DESC'});
                          this.props.modal({modalFlag: false});
                      } else {
                        message.error('添加失败');
                      }
                    }).catch(() => {
                      message.error('添加失败');
                    });
                  } else if (modaltype === 'modify') {
                    const modifydata = {
                      name: name.value,
                      id: this.props.fields.id.value,
                      code:code.value
                    };
                    IOModel.Modifydata(modifydata).then((res) => {  //修改成功时的回调
                      if (res.success) {
                          message.success('修改成功');
                          this.props.Alldatas({startPage: current, limit: psize,name:names,sortField: 'gmt_create',sortOrder: 'DESC'});
                          this.props.modal({modalFlag: false});
                      } else {
                        message.error('修改失败');
                      }
                    }).catch(() => {
                      message.error('修改失败');
                    });
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
        let title = "编辑农事操作";
        if (modaltype === 'add') {
            title = "新增农事操作";
        }
        return (
            <div>
                <Modal
                    visible={modalflag}
                    onOk={this.hideModal.bind(this)}
                    title={title}
                    onCancel={this.hideCancel.bind(this)}
                    okText="确认"
                    cancelText="取消"
                    wrapClassName='farming-admin-modal'
                >
                    <CustomizedForm {...fields} onChange={this.handleFormChange.bind(this)} parentName={parentName}
                                    getForm={this.getForm.bind(this)} checkName={this.props.checkName}/>
                </Modal>
            </div>
        );
    }
}

const mapstateProps = (state) => {
    const {fields, modaltype, modalflag} = state.workTypeReducer;
    return {
        fields,
        modaltype,
        modalflag
    };
};
export default connect(mapstateProps, action)(modifyModal);
