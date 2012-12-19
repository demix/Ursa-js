$(document).ready(function() {

    module("Ursa Templates Test");
    
    // add type
    Ursa.varType = Ursa.varType || {};
    Ursa.varType['hot'] = function(vars) {
        return vars > 10;
    }
    
    test("Ursa/compile,render", function() {
        // only compile
        var test = Ursa.compile(document.getElementById('t2').value, 'test');
        equal(typeof test, 'function', 'Ursa.compile可以成功编译复杂模板');
        
        // re compile and render
        test = Ursa.render('test2',{names:[1,2,3]},document.getElementById('t2').value);
        equal(typeof test, 'string', 'Ursa.render可以成功编译和渲染复杂模板');
        $('#res').html('<pre>' + test + '</pre>');
    });
});
