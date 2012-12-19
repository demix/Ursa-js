$(document).ready(function() {

    module("Ursa functions Test");
    
    test("Ursa/function/range", function() {
        var tpl = '{{range(1,10)}}';
        var test = Ursa.compile(tpl,'test3');
        var test2 = test({type: 1});
        equal(test2, "1,2,3,4,5,6,7,8,9" , tpl + ' ok');
        
        tpl = '{{range(10,1)}}';
        test = Ursa.compile(tpl,'test3');
        test2 = test({});
        equal(test2, "10,9,8,7,6,5,4,3,2" , tpl + ' ok');
        
    });
    
    test("Ursa/function/join", function() {
        var tpl = '{{range(1,10)|join}}';
        var test = Ursa.compile(tpl,'test3');
        var test2 = test({type: 1});
        equal(test2, "1,2,3,4,5,6,7,8,9" , tpl + ' ok');
        
        tpl = '{{range(10,1)|join()}}';
        test = Ursa.compile(tpl,'test3');
        test2 = test({});
        equal(test2, "10,9,8,7,6,5,4,3,2" , tpl + ' ok');
        
        tpl = '{{range(10,1)|join(\'-\')}}';
        test = Ursa.compile(tpl,'test3');
        test2 = test({});
        equal(test2, "10-9-8-7-6-5-4-3-2" , tpl + ' ok');
        
    });
    
    test("Ursa/function/slice", function() {
        var tpl = '{{range(1,10)|slice(0, 1)}}';
        var test = Ursa.compile(tpl,'test3');
        var test2 = test({type: 1});
        equal(test2, "1" , tpl + ' ok');
        
        tpl = '{{range(10,1)|slice(2, 4)}}';
        test = Ursa.compile(tpl,'test3');
        test2 = test({});
        equal(test2, "8,7,6,5"  , tpl + ' ok');
        
    });
    
    
    test("Ursa/function/format", function() {
        var tpl = '{{"hello, Mr %s, my name is %s"|format(\'Smith\',\'Skipper\')}}';
        var test = Ursa.compile(tpl,'test3');
        var test2 = test({type: 1});
        equal(test2, "hello, Mr Smith, my name is Skipper", tpl + ' ok')
        
    });
    
    
    test("Ursa/function/replace", function() {
        var tpl = '{{"hello, Mr %he%, my name is %me%. I\'m %age% years old."|replace({\'%he%\':\'Smith\',\'%me%\':\'Skipper\',\'%age%\':24})}}';
        var test = Ursa.compile(tpl,'test3');
        var test2 = test({type: 1});
        equal(test2, "hello, Mr Smith, my name is Skipper. I'm 24 years old." , tpl + ' ok');
        
    });
    
    test("Ursa/function/sort", function() {
        var tpl = '{{range(10, 1)|sort}}';
        var test = Ursa.compile(tpl,'test3');
        var test2 = test({type: 1});
        equal(test2, "2,3,4,5,6,7,8,9,10" , tpl + ' ok');
        
    });
    
    
    test("Ursa/function/escape", function() {
        var tpl = '{{"<a>nihao</a>"}}';
        var test = Ursa.compile(tpl,'test3');
        var test2 = test({type: 1});
        equal(test2, "&lt;a&gt;nihao&lt;/a&gt;"  , tpl + ' ok');
        
        
        tpl = '{{"<a>nihao</a>"|escape(\'none\')}}';
        test = Ursa.compile(tpl,'test3');
        test2 = test({type: 1});
        equal(test2, "<a>nihao</a>"   , tpl + ' ok');
        
        
        tpl = '{{"\'ni hao\'"|escape(\'js\')}}';
        test = Ursa.compile(tpl,'test3');
        test2 = test({type: 1});
        equal(test2, "\\'ni hao\\'"  , tpl + ' ok');
        
        // 扩展转义
        Ursa.escapeType = Ursa.escapeType || {};
        Ursa.escapeType['number'] = function(str) {
            return str ? str.replace(/[^0-9\.]/g, '') : 0;
        }
        tpl = '{{"\'ni1234 hao\'"|escape(\'number\')}}';
        test = Ursa.compile(tpl,'test3');
        test2 = test({type: 1});
        equal(test2, "1234"   , "自定义转义 " + tpl + ' ok');
        
    });
});
