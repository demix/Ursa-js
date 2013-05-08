$(document).ready(function() {

    module("Ursa operators Test");
    
    test("Ursa/Operator/in", function() {
        var tpl = '{{type in range(1,100)}}';
        var test = Ursa.compile(tpl,'test3');
        var test2 = test({type: 1});
        equal(test2, 'true' , tpl + ' ok');
        
        test2 = test({type: 0});
        equal(test2, 'false', tpl + 'in ok');
        
        tpl = '{{"a" in "abcd"}}';
        test = Ursa.compile(tpl,'test3');
        test2 = test({});
        equal(test2, 'true', tpl + ' ok');
        
        tpl = '{{"a" in ["a","b","c","d"]}}';
        test = Ursa.compile(tpl,'test3');
        test2 = test({});
        equal(test2, 'true', tpl + ' ok');
    });
    
    test("Ursa/Operator/is", function() {
        var tpl = '{{type is odd}}';
        var test = Ursa.compile(tpl,'test3');
        var test2 = test({type: 1});
        equal(test2, 'true' , tpl + ' ok');
        
        test2 = test({type: 0});
        equal(test2, 'false', tpl + ' ok');
        
        tpl = '{{type is defined}}';
        test = Ursa.compile(tpl,'test3');
        test2 = test({});
        equal(test2, 'false', tpl + ' ok');
        
        tpl = '{{2 is even}}';
        test = Ursa.compile(tpl,'test3');
        test2 = test({});
        equal(test2, 'true', tpl + ' ok');
        
        tpl = '{{19872 is divisibleby 2}}';
        test = Ursa.compile(tpl,'test3');
        test2 = test({});
        equal(test2, 'true', tpl + ' ok');
        
        Ursa.varType = Ursa.varType || {};
        Ursa.varType['hot'] = function(vars) {
            return vars > 10;
        }
        tpl = '{{19872 is hot}}';
        test = Ursa.compile(tpl,'test3');
        test2 = test({});
        equal(test2, 'true', '自定义类型判断 ' + tpl + ' ok');
    });
    
    test("Ursa/Operator/not", function() {
        var tpl = '{{not type}}';
        var test = Ursa.compile(tpl,'test3');
        var test2 = test({type: 1});
        equal(test2, 'false' , tpl + ' ok');
        
        test2 = test({type: 0});
        equal(test2, 'true', tpl + ' ok');
        
        tpl = '{{type is defined}}';
        test = Ursa.compile(tpl,'test3');
        test2 = test({});
        equal(test2, 'false', tpl + ' ok');
        
        tpl = '{{type is not defined}}';
        test = Ursa.compile(tpl,'test3');
        test2 = test({});
        equal(test2, 'true', tpl + ' ok');
    });
    
    test("Ursa/Operator/and", function() {
        var tpl = '{{type and 1}}';
        var test = Ursa.compile(tpl,'test3');
        var test2 = test({type: 1});
        equal(test2, '1' , tpl + ' ok');
        
        test2 = test({type: 0});
        equal(test2, '0', tpl + ' ok');
    });
    
    
    test("Ursa/Operator/or", function() {
        var tpl = '{{type or 1}}';
        var test = Ursa.compile(tpl,'test3');
        var test2 = test({type: 1});
        equal(test2, '1' , tpl + ' ok');
        
        test2 = test({type: 0});
        equal(test2, '1', tpl + ' ok');
    });
    
    test("Ursa/Operator/Math", function() {
        var tpl = '{{1 + 2 * 18 / 3 - 6 * (2 + 3 * (5 - 2))}}';
        var test = Ursa.compile(tpl,'test3');
        var test2 = test({type: 1});
        equal(test2, '-53' , tpl + ' ok');
        
    });
});
