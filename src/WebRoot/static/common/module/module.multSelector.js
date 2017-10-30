/**
 * Created by xiegy on 2017/4/28.
 * 选择器组件，可自定义包含各种类型的选择器
 * 依赖文件lib下的jQuery、bootstrap、treeview、layer，common下的helper.js
 */
(function (factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD规范
        define(['base','jquery','helper','layer','treeview'], factory);
    } else {
        if (typeof module === 'object' && module.exports) {
            // Node/CommonJS
            module.exports = factory(require('base'), require('jquery'), require('helper'), require('layer'), require('treeview'));
        } else {
            //未引入requirejs、commonjs等
            window.module = window.module || {};
            window.module.multSelector = factory(null, window.jQuery, window.helper, window.layer);
        }
    }
}(function (bs, $, helper, layer) {
    function noop() {}
    //对象拦截
    function callFun(fun, _this, _arg) {
        return function () {
            var arg = [];
            arg.push(this);
            arg.push.apply(arg, arguments);
            arg.push.apply(arg, _arg);
            return fun.apply(_this, arg);
        }
    }

    var selector = function (options) {
        this._r = (new Date()).valueOf();
        $.extend(true, this, this.defaultOptions, options);

        //页面相关元素
        this.el = {
            divPanel: "divPanel" + this._r,
            txtUnSelected: "txtUnSelected" + this._r,
            btnUnSelected: "btnUnSelected" + this._r,
            treeUnSelected: "treeUnSelected" + this._r,
            btnCancel: "btnCancel" + this._r,
            btnSelectAll: "btnSelectAll" + this._r,
            btnUnSelectAll: "btnUnSelectAll" + this._r,
            txtSelected: "txtSelected" + this._r,
            btnSelected: "btnSelected" + this._r,
            treeSelected: "treeSelectedh" + this._r,
            btnSave: "btnSave" + this._r
        };

        this.layer = null;
        this.load = null;
        this.init();
    };

    /**
     * 初始化
     */
    selector.prototype.init = function () {
        this._buildView();
        this._buildEvents();

        this._getData();
    };

    /**
     * 构造视图界面
     */
    selector.prototype._buildView = function () {
        var template = this._getTemplate();
        this.layer = layer.open({
            type: 1,
            title: this.title,
            skin: 'layui-layer-rim', //加上边框
            area: ['90%', '90%'], //宽高
            scrollbar: false,
            content: template,
            success: callFun(this._resize, this),
            cancel: callFun(this.saveSelected, this)
        });

        $(window).resize(callFun(this._resize, this));
    };

    /**
     * 初始化绑定事件
     * @private
     */
    selector.prototype._buildEvents = function () {
        //搜索事件
        $("#" + this.el.txtUnSelected).keyup(callFun(this.unSelectedInput, this));
        $("#" + this.el.btnUnSelected).click(callFun(this.unSelectedSearch, this));
        $("#" + this.el.txtSelected).keyup(callFun(this.selectedInput, this));
        $("#" + this.el.btnSelected).click(callFun(this.selectedSearch, this));

        //全选与非全选
        $("#" + this.el.btnSelectAll).click(callFun(this.nodeSelectedAll, this));
        $("#" + this.el.btnUnSelectAll).click(callFun(this.nodeUnSelectAll, this));
        //保存与取消
        $("#" + this.el.btnSave).click(callFun(this.saveSelected, this));
        $("#" + this.el.btnCancel).click(callFun(this.cancelSelected, this));
    };

    /**
     * 构建选择树
     * @private
     */
    selector.prototype._buildTree = function () {
        //数据构造
        this._buildData();

        //构建未选中的树
        this._buildUnSelectedTree();

        //构建选中的树
        this._buildSelectedTree();

        this._judgeEmptyMsg();
    };

    /**
     * 构建未选中的树
     * @private
     */
    selector.prototype._buildUnSelectedTree = function () {
        var tree = $("#" + this.el.treeUnSelected);
        tree.treeview({
            data: this.treeData,
            multiSelect: true,
            levels: 2,
            showTags: helper.isExistOrTrue(this.tagsC),
            showBorder: false,
            showCheckbox: true
        }).on("nodeSelected", callFun(this.nodeSelected, this)).
        on("nodeChecked", callFun(this.nodeSelected, this));

        var nodes = tree.treeview("getHide");
        for(var i = 0; i < this.selectedTreeData.length; i++){
            //将未选择树与选中的树的引用关系quoto进行关联
            for(var j = 0; j < nodes.length; j++){
                if(this.selectedTreeData[i].key == nodes[j].key){
                    this.selectedTreeData[i].quoto = nodes[j].nodeId;
                    break
                }
            }
        }
    };

    /**
     * 构建选中的树
     * @private
     */
    selector.prototype._buildSelectedTree = function () {
        var tree = $("#" + this.el.treeSelected);

        tree.treeview({
            data: this.selectedTreeData,
            multiSelect: true,
            levels: 2,
            showTags: helper.isExistOrTrue(this.tagsC),
            showBorder: false,
            showCheckbox: true
        }).on("nodeSelected", callFun(this.nodeUnSelected, this)).
        on("nodeUnchecked", callFun(this.nodeUnSelected, this));
    };

    /**
     * 构造无内容或已全选的提醒
     * @private
     */
    selector.prototype._judgeEmptyMsg = function () {
        var tree1 = $("#" + this.el.treeUnSelected);
        var tree2 = $("#" + this.el.treeSelected);

        if(tree1.treeview("getUnHide").length == 0)
            tree1.children(".list-group").before('<p class="text-warning m">找不到记录或已全选</p>')
        else
            tree1.children("p").remove();

        if(tree2.treeview("getUnHide").length == 0)
            tree2.children(".list-group").before('<p class="text-warning m">您还没选中任何记录</p>')
        else
            tree2.children("p").remove();
    };


    //事件相关start
    /**
     * 动态设置树窗口大小
     * @private
     */
    selector.prototype._resize = function () {
        var height = $("#" + this.el.divPanel).height() - $("#" + this.el.txtUnSelected).parent().outerHeight() - $("#" + this.el.btnCancel).outerHeight() - 20;
        $("#" + this.el.treeUnSelected).height(height);
        $("#" + this.el.treeSelected).height(height);
    };

    /**
     * 搜索输入框回车执行搜索
     * @param el
     * @param event
     */
    selector.prototype.unSelectedInput = function (el, event) {
        if(event.keyCode == 13)
            this.unSelectedSearch(el, event);
    };

    /**
     * 搜索输入框回车执行搜索
     * @param el
     * @param event
     */
    selector.prototype.selectedInput = function (el, event) {
        if(event.keyCode == 13)
            this.selectedSearch(el, event);
    };

    /**
     * 未选中树的搜索
     * @param el
     * @param event
     */
    selector.prototype.unSelectedSearch = function (el, event) {
        var keyword = $("#" + this.el.txtUnSelected).val();
        if(keyword != this.keyword) {
            this.keyword = keyword;
            if(this.searchType == 1){
                //服务端搜索
                this._getData();
                return;
            }

            //客户端搜索
            $("#" + this.el.treeUnSelected).treeview("collapseAll", {silent: true})
                .treeview("search", [keyword, {ignoreCase: true, exactMatch: false, revealResults: true}]);
        }
    };

    /**
     * 选中树的搜索
     * @param el
     * @param event
     */
    selector.prototype.selectedSearch = function (el, event) {
        var keyword = $("#" + this.el.txtSelected).val();
        $("#" + this.el.treeSelected).treeview("search", [keyword, {ignoreCase: true, exactMatch: false, revealResults: true}]);
    };

    /**
     * 选中或选择某一选项时触发
     * @param el
     * @param event
     * @param data
     */
    selector.prototype.nodeSelected = function (el, event, data) {
        $("#" + this.el.treeUnSelected).treeview("unselectNode",[data.nodeId, { silent: true}])
            .treeview("uncheckNode", [data.nodeId, {silent: true}])
            .treeview("hideNode", [data.nodeId, {silent: true}]);

        if(data.nodes){
            this._removeExistChild(this.selectedData, data.nodes);
        }

        this.selectedData.push({key: data.key, value: data.value, data: data});
        this.selectedTreeData.push(this._convertTreeDataItem(data, true, false, {checked: true}));
        this._buildSelectedTree();
        this._judgeEmptyMsg();
    };


    /**
     * 将去除选中的某一项后触发
     * @param el
     * @param event
     * @param data
     */
    selector.prototype.nodeUnSelected = function (el, event, data) {
        $("#" + this.el.treeSelected).treeview("unselectNode",[data.nodeId, { silent: true}])
            .treeview("hideNode", [data.nodeId, {silent: true}]);
        for(var i = 0; i < this.selectedData.length; i++){
            if(this.selectedData[i].key == data.key){
                this.selectedData.splice(i, 1);
                this.selectedTreeData.splice(i, 1);
                break;
            }
        }

        if(data.quoto != undefined)
            $("#" + this.el.treeUnSelected).treeview("unHideNode", [data.quoto, {silent: true}]);

        this._judgeEmptyMsg();
    };

    /**
     * 全选事件
     * @param el
     * @param event
     */
    selector.prototype.nodeSelectedAll = function (el, event) {
        var tree = $("#" + this.el.treeUnSelected);
        var data = tree.treeview("getUnHide");
        for(var i = 0; i < data.length; i++){
            if(data[i].parentId == undefined){
                if(data[i].nodes){
                    this._removeExistChild(this.selectedData, data.nodes);
                }
                this.selectedData.push({key: data[i].key, value: data[i].value, data: data[i]});
                this.selectedTreeData.push(this._convertTreeDataItem(data[i], true, false, {checked: true}));
            }
        }

        tree.treeview("hideAll", { silent: true});
        this._buildSelectedTree();
        this._judgeEmptyMsg();
    };

    /**
     * 删除全部选择事件
     * @param el
     * @param event
     */
    selector.prototype.nodeUnSelectAll = function (el, event) {
        this.selectedData = [];
        this.selectedTreeData = [];

        $("#" + this.el.treeSelected).treeview("hideAll", { silent: true});
        $("#" + this.el.treeUnSelected).treeview("unHideAll", { silent: true});
        this._judgeEmptyMsg();
    };

    /**
     * 保存选择
     * @param el
     * @param event
     */
    selector.prototype.saveSelected = function (el, event) {
        if(this.callback && this.callback instanceof Function){
            this.callback(this.selectedData);
        }
        layer.close(this.layer);
    };

    /**
     * 取消选择
     * @param el
     * @param event
     */
    selector.prototype.cancelSelected = function (el, event) {
        layer.close(this.layer);
    };
    //事项相关end


    /**
     * 数据构造
     */
    selector.prototype._buildData = function () {
        this.selectedTreeData = this._convertSelectedTreeData();
        this.treeData = this._convertTreeData();
    };


    /**
     * ajax获取数据
     * @private
     */
    selector.prototype._getData = function () {
        if(this.url){
            var params = {};
            params[this.keywordC] = this.keyword;
            this.load = layer.load(2,{offset:["20%","20%"]});

            var _this = this;
            $.ajax({
                url: this.url,
                data: params,
                type: this.method,
                dataType: "json",
                success: function (ret) {
                    _this.data = _this.dataC ? ret[_this.dataC] : ret;
                    _this._buildTree();
                },
                error: function () {

                },
                complete: function () {
                    layer.close(_this.load);
                }
            });

            return;
        }

        //构建树
        this._buildTree();
    };

    /**
     * 将已选中的数据切换成树所用的数据
     * @private
     */
    selector.prototype._convertSelectedTreeData = function (data) {
        data = data ? data : this.selectedData;
        var treeData = [];
        var state;

        for(var i = 0; i < this.selectedData.length; i++){
            state = {checked: true};
            treeData.push(this._convertTreeDataItem(data[i], true, false, state));
        }

        return treeData;
    };

    /**
     * 从指定的数据中转换成树所用的数据，该方法顺序固定为树展开式的读法，不符合该规则无法顺利读取
     * @param data  指定数据
     * @param pkey  父级key
     * @param objI  引用类型传递
     * @private
     */
    selector.prototype._convertTreeData = function (data, pkey, objI) {
        data = data ? data : this.data;
        objI = objI ? objI : {i: 0};
        var selectedJson = this._convertKV(this.selectedTreeData, true);

        var treeData = [];
        var di,treeItem,state;
        for(objI.i; objI.i < data.length; objI.i++){
            di = data[objI.i];
            if(!helper.isExistOrTrue(pkey) && helper.isExistOrTrue(di[this.pkeyC]))
                break;
            if((helper.isExistOrTrue(pkey) && di[this.pkeyC] != pkey))
                break;

            objI.i++;
            //如果已被选择，则待选择树数据里设为隐藏
            state = selectedJson[di[this.keyC]] ? {hide: true} : null;

            //构造树节点并递归调用
            treeItem = this._convertTreeDataItem(di, false, objI, state, data);

            treeData.push(treeItem);
            objI.i--;
        }

        return treeData;
    };

    /**
     * 构建每一个树叶子的数据
     * @param dataItem
     * @param isTreeFlag
     * @param deep
     * @param state
     * @param data
     * @return {{key: *, value: *, text: *}}
     * @private
     */
    selector.prototype._convertTreeDataItem = function (dataItem, isTreeFlag, deep, state, data) {
        var item = {
            "key": dataItem[isTreeFlag ? "key" : this.keyC],
            "value": dataItem[isTreeFlag ? "value" : this.valueC],
            "text": dataItem[isTreeFlag ? "value" : this.valueC]
        };

        if(this.tagsC) {
            item.tags = isTreeFlag ? dataItem["tags"] : dataItem[this.tagsC];
            if(typeof item.tags == "string")
                item.tags = item.tags.split(",");
        }

        if (state)
            item.state = {
                "selected": state ? helper.isExistOrTrue(state.selected) : false,
                "checked": state ? helper.isExistOrTrue(state.checked) : false,
                "disabled": state ? helper.isExistOrTrue(state.disabled) : false,
                "hide": state ? helper.isExistOrTrue(state.hide) : false
            };

        if(deep){
            item.nodes = this._convertTreeData(data, dataItem[isTreeFlag ? "key" : this.keyC], deep);
            //无子节点
            if(!item.nodes.length)
                delete item.nodes;
        }

        //从未选中 -> 选中
        if(dataItem.nodeId != undefined)
            item.quoto = dataItem.nodeId;
        return item;
    };

    /**
     * 将键值对的数组，变更成hashMap类型的json数据
     * @param data
     * @param isTreeFalg
     * @return {{}}
     * @private
     */
    selector.prototype._convertKV = function (data, isTreeFalg) {
        if(!(data instanceof Array)) return;

        var json = {};
        var item;
        for(var i = 0; i < data.length; i++){
            item = data[i];
            json[item[isTreeFalg ? "key" : this.keyC].toString()] = item[isTreeFalg ? "value" : this.valueC];
        }

        return json;
    };


    /**
     * 递归删除指定选中数据中包含在nodes及其子元素中的数据
     * @param selData
     * @param nodes
     * @param selTreeData
     * @return {boolean}  存在并删除成功返回true，不存在返回false
     * @private
     */
    selector.prototype._removeExistChild = function (selData, nodes) {
        if(!nodes || !selData)
            return false;

        var i;
        if(selData instanceof Array){
            for(i = selData.length - 1; i >= 0; i--){
                if(this._removeExistChild(selData[i], nodes)){
                    if(this.selectedTreeData[i].quoto)
                        $("#" + this.el.treeUnSelected).treeview("unHideNode", [this.selectedTreeData[i].quoto, {silent: true}]);
                    selData.splice(i, 1);
                    this.selectedTreeData.splice(i, 1);
                }
            }

            return true;
        }

        for(i = 0; i < nodes.length; i++){
            if(nodes[i].key == selData.key)
                return true;
            if(this._removeExistChild(selData, nodes[i].nodes))
                return true;
        }

        return false;
    };


    /**
     * 数据模板
     * @return {String}
     * @private
     */
    selector.prototype._getTemplate = function () {
        var template = '<div id="{divPanel}" class="wrapper wrapper-content animated full-height"><div class="row">'
            +'<div class="col-sm-5">'
            +'<div class="input-group m-b">'
            +'<input id="{txtUnSelected}" type="text" class="form-control" placeholder="输入关键字搜索待选择项，按回车键搜索" />'
            +'<span class="input-group-btn"><button id="{btnUnSelected}" class="btn btn-primary"><i class="glyphicon glyphicon-search"></i></button></span>'
            +'</div>'
            +'<div id="{treeUnSelected}" style="border-top-left-radius: 4px;border-top-right-radius: 4px;border: 1px solid #e7eaec;overflow-y: auto"></div>'
            +'<div class="row m-t"><button id="{btnCancel}" class="btn btn-warning btn-lg right btn-block"><i class="glyphicon glyphicon-remove"></i>&nbsp;取消选择</button></button></div>'
            +'</div>'

            +'<div class="col-sm-2">'
            +'<div class="row" style="margin-top: 200px;">'
            +'<button id="{btnSelectAll}" class="btn btn-primary btn-outline btn-block">添加全部&nbsp;<i class="glyphicon glyphicon-chevron-right"></i></button>'
            +'<button id="{btnUnSelectAll}" class="btn btn-warning btn-outline btn-block"><i class="glyphicon glyphicon-chevron-left"></i>&nbsp;删除全部</button>'
            +'</div></div>'

            +'<div class="col-sm-5">'
            +'<div class="input-group m-b">'
            +'<input id="{txtSelected}" type="text" class="form-control" placeholder="输入关键字搜索已选择项，按回车键搜索" />'
            +'<span class="input-group-btn">'
            +'<button id="{btnSelected}" class="btn btn-primary"><i class="glyphicon glyphicon-search"></i></button></span></div>'
            +'<div id="{treeSelected}" style="border-top-left-radius: 4px;border-top-right-radius: 4px;border: 1px solid #e7eaec;overflow-y: auto"></div>'
            +'<div class="row m-t"><button id="{btnSave}" class="btn btn-primary btn-lg left btn-block"><i class="glyphicon glyphicon-ok"></i>&nbsp;保存选择</button></button></div>'
            +'</div>'
            +'</div></div>';
        return template.Format(this.el);
    };


    /**
     * 默认配置
     * @type {{url: string, searchType: number, keyword: string, method: string, dataC: string, keywordC: string, keyC: string, valueC: string, pkeyC: string, data: Array, selectedData: Array, treeData: Array, selectedTreeData: Array, callback: noop}}
     */
    selector.prototype.defaultOptions = {
        url: "",        //获取数据的ajax url
        searchType: 0,  //搜索类型，1：服务端搜索，0：客户端搜索
        keyword: "",    //搜索的关键字
        method: "POST", //ajax请求的方法，GET 或 POST

        dataC: "",      //数据存放在返回值的哪个字段中
        keywordC: "",   //关键字搜索对应的，关键字的字段
        keyC: "",       //获取到的数据源中，key的字段
        valueC: "",     //获取到的数据源中，value的字段
        tagsC: "",      //获取到的数据源中，tags的字段（辅助显示标签的）
        pkeyC: "",      //获取到的数据源中，parentKey的字段

        title: "请选择",
        data: [],       //源数据
        selectedData: [],   //选中的源数据
        treeData: [],       //树视图的源数据
        selectedTreeData: [],   //选中的树视图的源数据
        callback: noop  //点击确定按钮后的回调函数
    };

    return selector;
}));