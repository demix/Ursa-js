$(document).ready(function() {

    module("Ursa Tags Test");
    
    test("Ursa/Tag/comment", function() {
        var tpl = "{#这是个注释{%if 1%}this is a test{%else%}test start here{%endif%}#}";
        var test = Ursa.compile(tpl, 'test3');
        var test2 = test({type: 1});
        equal(test2, '', '注释语法"' + tpl + '"可以成功编译，渲染');
    });

    test("Ursa/Tag/set", function() {
        var tpl = "{%set obj={a:-10|abs}%}{{obj.a}}";
        var test = Ursa.compile(tpl, 'test3');
        var test2 = test({});
        equal(test2, '10', 'set语法"' + tpl + '"可以成功编译，渲染');
    });
    
    test("Ursa/Tag/if,elif,else,endif", function() {
        var tpl = "{%if type is defined%}{{type + 1}}{%elif myname is defined%}my name is {{myname}}{%else%}no{%endif%}"; 
        var test = Ursa.compile(tpl,'test3');
        var test2 = test({type: 1});
        equal(test2, 2, tpl + ' if ok');
        
        test2 = test({myname: 'skipper'});
        equal(test2, 'my name is skipper', tpl + ' elif ok');
        
        test2 = test({});
        equal(test2, 'no', tpl + ' else ok');
    });
    
    test("Ursa/Tag/for,loop,else,endfor", function() {
        var tpl = "{%for key,value in type%}{{key + '-' + value}}{%else%}no{%endfor%}";
        var test = Ursa.compile(tpl,'test3');
        var test2 = test({type: [1,2,3]});
        equal(test2, '0-11-22-3', tpl + ' for ok');
        
        test2 = test({type: []});
        equal(test2, 'no', tpl + ' for else ok');
        
        tpl = "{%for key,value in type%}{{loop.index0 + '-' + loop.index + '-' + loop.length}}{%else%}no{%endfor%}";
        test = Ursa.compile(tpl,'test3');
        test2 = test({type: [1,2,3]});
        equal(test2, '0-1-31-2-32-3-3', tpl + ' for loop ok');
    });
    
});
