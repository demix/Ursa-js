    // 模板开始头编译产物，例如js版本需要返回一个"function(context){"
    Ursa.ioStart = function() {
        return '';
    }
    // 模板尾编译产物，比如js版本会返回一个"}"
    Ursa.ioEnd = function() {
        return ''; 
    };
    // 模板html片段编译产物，一般都只需要原字符串返回
    Ursa.ioHTML= function(ins) {
        return ins; 
    };
    /*
     模板语法的编译需要完成对表达式内filter,function,and not in等操作符的编译替换
     */
    // 输出语句编译产物，转换成目标语言的输出逻辑，例如php的可能就是： {{vars}} => <?php echo $vars;?>
    Ursa.ioOutput = function(ins) {
        return '<%=' + ins + '>';
    };
    // 不包含tag的语句编译产物，转换成目标语言的表达式逻辑，例如: {%vars=2%} => <?php $vars=2;?>
    Ursa.ioOP = function(ins) {
        return '<%=' + ins + '>';
    };
    // 可以抽离的出来的表达式替换逻辑，将模板语法表达式转换为目标语言的表达式，其复杂程度由支持的语法数量决定
    function compileOp(obj) {
        if(obj.statement.indexOf(' ') == -1) return 'empty ' + obj.statement;
        return obj.statement;   
    };
    // 包含tag的语句编译产物，转换成目标语言的逻辑，例如： {%if a is defined%} => <?php if(isset($a)){?>
    // {%endif%} => <?php }?>
    // {%for key,value in list%} => <?php foreach($list as $key=>$value){?>
    // etc.
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
        } else if(matches == 'set') {
			return '';
		}
    };
