import reducers from '@/app/reducers';
import {context, IO} from '@/app/io';
//配置接口参数
context.create('cropMaintenance', {
    listByPagedata: {
        mockUrl: '/proxy/astCategory/listByPage',
        url: '/astCategory/listByPage',
        method: 'POST'
    },
    Adddata: {
        mockUrl: '/proxy/astCategory/add',
        url: '/astCategory/add',
        method: 'POST'
    },
    deleteData: {
        mockUrl: ''
    },
    Modifydata: {
        mockUrl: '/proxy/astCategory/update',
        url: '/astCategory/update',
        method: 'POST'
    },
    GetOne: {
        mockUrl: '/proxy/astCategory/getById/:id',
        url: '/astCategory/getById/:id',
        method: 'GET',
        rest: true
    },
    CheckName: {
        mockUrl: '/proxy/astCategory/checkNameUnique',
        url: '/astCategory/checkNameUnique',
        method: 'GET'
    },
    ListInGroup: {
        mockUrl: '/proxy/astCategory/getCategoryByParentId',
        url: '/astCategory/getCategoryByParentId',
        method: 'GET'
    },
    ListInGroupAll: {
        mockUrl: '/proxy/astCategory/getCategoryByParentIdAll',
        url: '/astCategory/getCategoryByParentIdAll',
        method: 'GET'
    },
    TreeData: {
        mockUrl: ''
    }
});
//封装页面reducer、action
const farmingModel = {
    reducer: (defaultState = {
        EditData: {},
        Alldate: [],
        Data2: {},
        total: null,
        parentname: null,
        PID: null,
        Psize: 10,
        Cur: 1,
        fields: {},
        TreeD: [],
        addflag: false,
        modalflag: false,
        modaltype: '',
        modalTwoflag: false,
        modalTwotype: '',
        parentID: null,
        slideID: -1,
        modifyID: null,
        chooseCUR: 1,
        chooseSIZE: 10,
        slideparentID: -1,
        slideName: '基地'
    }, action) => {
        const fields = action.data;
        switch (action.type) {
            case 'CATEGORY_ALL_DATA': {
                const Alldate = action.data;
                const total = action.total;
                return Object.assign({}, defaultState, {
                    Alldate: Alldate,
                    total: total,
                    chooseflag: false
                });
            }
            case 'CATEGORY_QUERY_ALL': {
                const queryAlls = action.data;
                const querytotal = action.querytotal;
                return Object.assign({}, defaultState, {
                    Alldate: queryAlls,
                    total: querytotal
                });
            }
            case 'CATEGORY_GET_ONE': {
                const queryAlls = action.data;
                return Object.assign({}, defaultState, {
                    EditData: queryAlls
                });
            }
            case 'CATEGORY_MENU_ALL':
                return Object.assign({}, defaultState, {
                    Alldate: action.arr,
                    total: action.num
                    //chooseflag:true
                });
//        case 'BASE_CHOOSE_ALL': {
//          const chooseAlls = action.chooseall;
//          const choosetotal = action.choosetotal;
//          return Object.assign({}, defaultState, {
//            Alldate:chooseAlls,
//            total:choosetotal
//          });
//        }
            case 'CATEGORY_SUPERIOR_NAME':
                return Object.assign({}, defaultState, {
                    parentname: action.Name
                });
            case 'CATEGORY_RES_PAGE':
                return Object.assign({}, defaultState, {
                    Cur: action.cur,
                    Psize: action.psize
                });
            case 'CATEGORY_CHANGE_DATA2':
                return Object.assign({}, defaultState, {
                    Data2:action.data
                });
            case 'CATEGORY_MODAL':
                return Object.assign({}, defaultState, {
                    modalflag: action.modalflag,
                    modaltype: action.modaltype
                });
            case 'CATEGORY_MODAL_TWO':
                return Object.assign({}, defaultState, {
                    modalTwoflag: action.modalflag,
                    modalTwotype: action.modaltype
                });
            case 'CATEGORY_DEFAULTFIELD':
                return Object.assign({}, defaultState, {fields: fields});
            case 'CATEGORY_TREE_DATAs':
                return Object.assign({}, defaultState, {
                    TreeD: action.tree
                });
            case 'CATEGORY_SLIDEID':
                return Object.assign({}, defaultState, {
                    slideID: action.num,
                    slideName: action.slideName,
                    slideparentID: action.slideparentID
                });
            case 'CATEGORY_PARENTID':
                return Object.assign({}, defaultState, {
                    parentID: action.parentid,
                    modifyID: action.modifyid
                });
            case 'CATEGORY_CHOOSEPAGE':
                return Object.assign({}, defaultState, {
                    chooseCUR: action.chooseCUR,
                    chooseSIZE: action.chooseSIZE
                });
        }
        return defaultState;
    },
    action: (dispatch) => {
        return {
            superiorName: (parent) => {  //点击左边树的数据
                dispatch({
                    type: "CATEGORY_SUPERIOR_NAME",
                    Name: parent.name,
                    parentid: parent.parentID,
                    pID: parent.parentLeftID
                });
            },
            //    查询
            Alldatas: (page) => {  //进入页面的列表数据
                page.companyId = 1;
                IO.cropMaintenance.listByPagedata(page).then((res) => {
                    const data = res.data.rows || [];
                    const total = res.data.total;
                    dispatch({
                        type: "CATEGORY_ALL_DATA",
                        data,
                        total
                    });
                }).catch();
            },
            queryAll: (req) => {  //筛选的列表数据
                req.companyId = 1;
                IO.cropMaintenance.listByPagedata(req).then((res) => {
                    const querytotal = res.data.total;
                    const data = res.data.rows;
                    dispatch({
                        type: "CATEGORY_QUERY_ALL",
                        data,
                        querytotal
                    });
                }).catch();
            },
            getOne: async (req) => {  //编辑单个时获取数据
                const res = await IO.cropMaintenance.GetOne(req);
                const data = res.data;
                if (data.stauts === 0) {
                    data.stauts = '正常';
                } else if (data.stauts === 1) {
                    data.stauts = '禁用';
                }
                dispatch({
                    type: "CATEGORY_GET_ONE",
                    data
                });

            },
            page: (obj) => {  //分页页码
                dispatch({
                    type: "CATEGORY_RES_PAGE",
                    cur: obj.current,
                    psize: obj.pageSize
                });
            },
            changeData2:(obj) => {  //子表格数据改变
                dispatch({
                    type: "CATEGORY_CHANGE_DATA2",
                    data:obj
                });
            },
            choosepage: (obj) => {
                dispatch({
                    type: "CATEGORY_CHOOSEPAGE",
                    chooseCUR: obj.current,
                    chooseSIZE: obj.pageSize
                });
            },
            // 创建
            defaultFields: (data) => {  //弹出框的数据
                dispatch({
                    type: "CATEGORY_DEFAULTFIELD",
                    data
                });
            },
            modal: (obj) => {  //弹出框是否显示
                dispatch({
                    type: "CATEGORY_MODAL",
                    modalflag: obj.modalFlag,
                    modaltype: obj.modeltype
                });
            },
            modalTwo: (obj) => {  //弹出框是否显示
                dispatch({
                    type: "CATEGORY_MODAL_TWO",
                    modalflag: obj.modalFlag,
                    modaltype: obj.modeltype
                });
            }
        };
    }
};

reducers.assemble = {cropMaintenanceReducer: farmingModel.reducer};
const action = farmingModel.action;
const IOModel = {
    listByPagedata: IO.cropMaintenance.listByPagedata,
    TreeMOdel: IO.cropMaintenance.TreeData,
    Delete: IO.cropMaintenance.deleteData,
    Adddata: IO.cropMaintenance.Adddata,
    Modifydata: IO.cropMaintenance.Modifydata,
    CheckName: IO.cropMaintenance.CheckName,
    ListInGroup: IO.cropMaintenance.ListInGroup,
    ListInGroupAll: IO.cropMaintenance.ListInGroupAll
};
export {
    action,
    IO,
    IOModel
};
