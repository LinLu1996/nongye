import reducers from '@/app/reducers';
import {context, IO} from '@/app/io';
//配置接口参数
context.create('workOperations', {
  listByPagedata: {
   mockUrl: '/proxy/workType/listByPage',
   url: '/workType/listByPage'
  },
  Adddata: {
    mockUrl: '/proxy/workType/add',
    url: '/workType/add',
    method: 'POST'
  },
  Modifydata: {
    mockUrl: '/proxy/workType/update',
    url: '/workType/updata',
    method: 'POST'
  },
  delete: {
    url: '/workType/delete/:id',
    mockUrl: '/proxy/workType/delete/:id',
    rest: true
  }
});
//封装页面reducer、action
const workTypeModel = {
  reducer: (defaultState = {
    Alldate:[],
    total:null,
    fields:{},
    addflag:false,
    modalflag:false,
    modaltype:''
  }, action) => {
    const fields = action.data;
    switch (action.type) {
      case 'WORKTYPE_ALL_DATA': {
        const Alldate = action.data;
        const total = action.total;
        return Object.assign({}, defaultState, {
          Alldate:Alldate,
          total:total,
          chooseflag:false
        });
      }
        case 'WORKTYPE_MODAL':
        return Object.assign({}, defaultState, {
          modalflag:action.modalflag,
          modaltype:action.modaltype
        });
        case 'WORKTYPE_DEFAULTFIELD':
        return Object.assign({}, defaultState, {fields: fields});
    }
    return defaultState;
  },
  action: (dispatch) => {
      return {
          //    查询
          Alldatas: ( page ) => {  //进入页面的列表数据
              page.companyId = 1;
              IO.workOperations.listByPagedata(page).then((res) => {
                  const data=res.data.rows||[];
                  const total=res.data.total;
                  dispatch({
                      type: "WORKTYPE_ALL_DATA",
                      data,
                      total
                  });
              }).catch();
          },
          // 创建
          defaultFields:(data) => {  //弹出框的数据
              dispatch({
                  type: "WORKTYPE_DEFAULTFIELD",
                  data
              });
          },
          modal:(obj) => {  //弹出框是否显示
              dispatch({
                  type: "WORKTYPE_MODAL",
                  modalflag:obj.modalFlag,
                  modaltype:obj.modeltype
              });
          }
      };
  }
};

reducers.assemble = {workTypeReducer: workTypeModel.reducer};
const action = workTypeModel.action;
const IOModel = {
  Adddata:IO.workOperations.Adddata,
  Modifydata:IO.workOperations.Modifydata,
  delete:IO.workOperations.delete
};
export {
  action,
  IO,
  IOModel
};
