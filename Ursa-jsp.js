    Ursa.ioStart = function() {
        return '';
    }
    // 模板尾编译产物
    Ursa.ioEnd = function() {
        return ''; 
    };
    // 模板html片段编译产物
    Ursa.ioHTML= function(ins) {
        return ins; 
    };
    /*
     模板语法的编译需要完成对表达式内filter,function,and not in等操作符的编译替换
     */
    // 输出语句编译产物
    Ursa.ioOutput = function(ins) {
        return ins;
    };
    // 不包含tag的语句编译产物
    Ursa.ioOP = function(ins) {
        return '';
    };
    function compileOp(obj) {
        if(obj.statement.indexOf(' ') == -1) return 'empty ' + obj.statement;
        return obj.statement;   
    };
    // 包含tag的语句编译产物
    Ursa.ioMerge = function(matches, sourceObj, flag) {
        if(matches == 'if') {
            var res = '<c:choose>';
            res += '<c:when test="${';
            res += compileOp(sourceObj);
            res += '}">';
            return res;
        } else if(matches == 'endif') {
            return (flag ? '' : '</c:when>') + (flag ? '</c:otherwise>': '') + '</c:choose>';    
        } else if(matches == 'else') {
            return '</c:when><c:otherwise>';    
        }
    };
