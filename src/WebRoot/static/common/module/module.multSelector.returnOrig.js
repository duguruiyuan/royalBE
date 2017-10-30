/**
 * Created by lianhy on 2017/5/8.
 * 选择器返回的字段中扩充源数据字段
 * 依赖文件common下的module.multSelector.js
 */


(function (factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD规范
        define(['jquery','helper','module.multSelector'], factory);
    } else {
        if (typeof module === 'object' && module.exports) {
            // Node/CommonJS
            module.exports = factory(require('jquery'), require('helper'), require('module.multSelector'));
        } else {
            //未引入requirejs、commonjs等
            window.module = window.module || {};
            if(!window.module.multSelector) {console.log('未能找到multSelector插件请先引入');}
            window.module.multSelector = factory(window.jQuery, window.helper, window.module.multSelector);
        }
    }
}(function ($, helper, multSelector) {
    // var data = {
    //     extendKeyMap:[]
    // };
    // $.extend(true,module.multSelector.prototype.defaultOptions, data);
    /**
     * 构建每一个树叶子的数据,对插件的方法进行修改
     * @param dataItem
     * @param isTreeFlag
     * @param deep
     * @param state
     * @param data
     * @return {{key: *, value: *, text: *}}
     * @private
     */
    multSelector.prototype._convertTreeDataItem = function (dataItem, isTreeFlag, deep, state, data){
        var item = {
            "key": dataItem[isTreeFlag ? "key" : this.keyC],
            "value": dataItem[isTreeFlag ? "value" : this.valueC],
            "text": dataItem[isTreeFlag ? "value" : this.valueC],
            "originData": dataItem      //这里是新增的代码
        };
        //$.extend(true,item, dataItem);
        // console.log(this.extendKeyMap)
        // if(this.extendKeyMap) {
        //     for(var i=0;i<dataItem.length;i++){
        //         for(var j=0;j<this.extendKeyMap.length;j++){
        //             if(dataItem[this.extendKeyMap[j]])
        //                 item.push(dataItem[this.extendKeyMap[j]])
        //         }
        //     }
        // }

        //console.log(item);
        // $.extend(true,item, dataItem);
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
     * 全选事件
     * @param el
     * @param event
     */
    multSelector.prototype.nodeSelectedAll = function (el, event) {
        var tree = $("#" + this.el.treeUnSelected);
        var data = tree.treeview("getUnHide");
        for(var i = 0; i < data.length; i++){
            if(data[i].parentId == undefined){
                if(data[i].nodes){
                    this._removeExistChild(this.selectedData, data.nodes);
                }
                //this.selectedData.push({key: data[i].key, value: data[i].value});
                this.selectedData.push(data[i]);//这里是修改的代码
                this.selectedTreeData.push(this._convertTreeDataItem(data[i], true, false, {checked: true}));
            }
        }

        tree.treeview("hideAll", { silent: true});
        this._buildSelectedTree();
        this._judgeEmptyMsg();
    };
    /**
     * 选中或选择某一选项时触发
     * @param el
     * @param event
     * @param data
     */
    multSelector.prototype.nodeSelected = function (el, event, data) {
        $("#" + this.el.treeUnSelected).treeview("unselectNode",[data.nodeId, { silent: true}])
            .treeview("uncheckNode", [data.nodeId, {silent: true}])
            .treeview("hideNode", [data.nodeId, {silent: true}]);

        if(data.nodes){
            this._removeExistChild(this.selectedData, data.nodes);
        }

        //this.selectedData.push({key: data.key, value: data.value});
        this.selectedData.push(data);//这里是修改后的代码
        this.selectedTreeData.push(this._convertTreeDataItem(data, true, false, {checked: true}));
        this._buildSelectedTree();
        this._judgeEmptyMsg();
    };

    return multSelector;
}));