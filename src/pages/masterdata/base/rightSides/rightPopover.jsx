import { Component } from 'react';
import { Popover, Tooltip} from 'antd';
import Com from '@/component/common';
import {connect} from 'react-redux';
import {action} from './model';
class RightPopover extends Component {
    constructor(props) {
        super(props);
    }
    editor(record, e) {
        this.props.editor(record,e);
    }
    deleteR(record,e) {
        this.props.deleteR(record,e);
    }
    addmodel(record,e) {   //增加的按钮
        this.props.add(record,e);
    }
    onmouseenter(e) {
        const len = e.target.parentNode.parentNode.parentNode.parentNode.offsetWidth;
        if(e.target.offsetWidth+(e.target.offsetLeft-this.props.scrollnum)>150 && this.props.scrollnum<10) {
            e.target.parentNode.parentNode.parentNode.style.maxWidth='100%';
        }else if(e.target.offsetWidth+(e.target.offsetLeft-this.props.scrollnum)>150 && this.props.scrollnum>10) {
            e.target.parentNode.parentNode.parentNode.style.width=`${len+this.props.scrollnum-10}px`;
        }else {
            e.target.parentNode.parentNode.parentNode.style.maxWidth='';
            e.target.parentNode.parentNode.parentNode.style.width='';
        }
      }
  render() {
    let itemTitle;
    this.props.keyword==='base'?itemTitle=this.props.item.title:this.props.keyword==='org'?itemTitle=this.props.item.orgName:this.props.keyword==='node'?itemTitle=this.props.item.nodeName:itemTitle=this.props.item.resName;
    let addtitle = "新增";
    //let keys = '';
    if(this.props.item.type==="company") {
        addtitle = "新增基地";
        //keys = "base";
    }else if(this.props.item.type==="base") {
        addtitle = "新增地块";
        //keys = "land";
    }
      let edittitle = "编辑";
      if(this.props.item.type==="base") {
          edittitle = "编辑基地";
         // keys = "base";
      }else if(this.props.item.type==="land") {
          edittitle = "编辑地块";
          //keys = "land";
      }
    return (
        <div>{(Com.hasRole(this.props.securityKeyWord, 'base_update', 'update') || Com.hasRole(this.props.securityKeyWord, 'land_update', 'update') || Com.hasRole(this.props.securityKeyWord, 'base_add', 'insert') || Com.hasRole(this.props.securityKeyWord, 'land_add', 'insert'))?<Popover content={
                <div className='sildemenu'>
                {((this.props.item.type==="company" && Com.hasRole(this.props.securityKeyWord, 'base_add', 'insert')) || (this.props.item.type==="base" && Com.hasRole(this.props.securityKeyWord, 'land_add', 'insert')))? <Tooltip placement="top" title={addtitle}><span
                                        onClick={this.addmodel.bind(this,this.props.item)}><i
                                    className='iconfont icon-jiahao'></i></span></Tooltip>:''}
                {((this.props.item.type==="base" && Com.hasRole(this.props.securityKeyWord, 'base_update', 'update')) || (this.props.item.type==="land" && Com.hasRole(this.props.securityKeyWord, 'land_update', 'update'))) ?<Tooltip placement="top" title={edittitle}><span
                                        onClick={this.editor.bind(this,this.props.item)}><i
                                    className='iconfont icon-xiugai07'></i></span></Tooltip>:''}
                </div>
            } title={false} trigger="hover" placement="right" onMouseEnter={this.onmouseenter.bind(this)}>
                {this.props.searchValue?<p>{this.props.beforeStr}<i className="search-value" style={{color:'#9cd0a0'}}>{this.props.searchValue}</i>{this.props.afterStr}</p>:<p>{itemTitle}</p>}
            </Popover>:<Tooltip title={itemTitle}><p>{itemTitle}</p></Tooltip>}
           </div>
    );
  }
}
const mapStateprops = (state) => {
    const {scrollnum} = state.rightSideModel_;
    return {
        scrollnum
    };
};
export default connect(mapStateprops, action)(RightPopover);
