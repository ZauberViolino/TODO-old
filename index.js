//<nowiki>
mw.loader.using( ['mediawiki.util', 'mediawiki.api', 'ext.gadget.site-lib'/* ,'ext.gadget.HanAssist'*/ ], function () {
  
function han(s, t) {
  return wgULS(s, t);
  //return HanAssist.localize( { hans: s, hant: t } );
}

var API = new mw.Api();
var cmt = "";
var user = mw.config.get('wgUserName');
var page = mw.config.get('wgPageName');
var dl
if (user === null)
    return;

var personallink = mw.util.addPortletLink('p-personal', '/wiki/Special:Mypage/TODO', 'TODO', 'pt-zv-todo', han('待办事项', '待辦事項'), null, '#pt-sandbox');
var link = mw.util.addPortletLink('p-cactions', '#', '+TODO', 'ca-zv-todo', han('列入待办事项', '列入待辦事項'));
$(link).click(function(event) {
    main();
});

function main() {
    cmt = "";
    
    var html =
    '<div id="zv-todo-dialog">' +
    '<p>' + han('备注', '備註') +
    '<textarea name="zv-todo-cmt" id="zv-todo-cmt" rows=2 placeholder=' + han('按下回车，自动保存','按下Enter，自動保存') + '></textarea>' +
    '</div>';

    if (dl) {
        dl.html(html).closest('.ui-dialog-content').dialog('destroy').remove();
        dl = null;
    }

    dl = $(html).dialog({
        title: han('加入待办事项', '加入待辦事項'),
        minWidth: 600,
        minHeight: 200,
        buttons: [
            {
                text: '保存',
                click: function () {
                    processCmt();
                    post();
                    $(this).dialog('close');
                }
            },
            {
                text: '取消',
                click: function () {
                    processCmt();
                    $(this).dialog('close');
                }
            }
        ]
    });

    $('#zv-todo-cmt').val(cmt);

    $('#zv-todo-cmt').keypress(function(e) {
        if (e.keyCode == $.ui.keyCode.ENTER) {
            processCmt();
            post();
            $('#zv-todo-dialog').dialog('close');
        }

    });

}

function post() {
    a = '\n# [[:' + page + ']]：' + cmt + '&nbsp;——~~~~~'
    pro = API.postWithToken('csrf', {
        action: 'edit',
        title: 'User:' + user + '/TODO',
        appendtext: a,
        summary: 'via [[User:魔琴/gadgets/todo|TODO]]'
    }).then(function () {
        mw.notify('添加成功');
        cmt = ""
    }, function (e) {
        mw.notify(e);
    });
}

function processCmt() {
    cmt = $('#zv-todo-cmt').val()
}

});

//</nowiki>
