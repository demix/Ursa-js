var __ssjs__ = typeof exports == 'undefined' ? false : true;
if (__ssjs__) {
    var Ursa = {};
}

(function() {
    if (!__ssjs__) {
        if (typeof Ursa != 'undefined' && typeof Ursa.render != 'undefined') return;
        window.Ursa = window.Ursa || {};
    };

    // filter and func area begin

    // func

    /**
     * 生成一个数组
     * @method func range
     *
     * @return [].
     * @param start 开始.
     * @param end   结束位置.
     * @param size  递增间隔.
     */
    function range(start, end, size) {
        var res = []
            , size = size || 1;
        if (start <= end) {
            while (start < end) {
                res.push(start);
                start += size * 1;
            }
        } else {
            while (start > end) {
                res.push(start);
                start = start - size;
            }
        }
        return res;
    };

    /**
     * 循环
     *
     * @method each
     * @param Array|Object range
     */
    function each(rge, callback) {
        var index = 0;
        for (var key in rge) {
            if (typeof rge[key] != 'function') {
                callback && callback(rge[key], key, index);
                index++;
            }
        }
    };

    /**
     * @method dumpError
     */
    function dumpError(msg, type) {
        throw new Error(msg);
    }
    var __undefinded;
    /**
     *
     * @method clear whitespace
     */
    function cleanWhiteSpace(result) {
        result = result.replace(/\t/g,   "    ");
        result = result.replace(/\r\n/g, "\n");
        result = result.replace(/\r/g,   "\n");
        result = result.replace(/^(\s*\S*(\s+\S+)*)\s*$/, '$1'); // Right trim by Igor Poteryaev.
        return result;
    }
    /**
     * 获取循环的length
     *
     * @method _length
     * @return Number.
     * @param Object|Array rge
     */
    function _length(rge) {
        if (!rge) return 0;
        if (rge.join) return rge.length;
        var length = 0;
        each(rge, function(item, i, index) {
            length = index + 1;
        });
        return length;
    };
    /**
     * 变量是否在指定的rge内
     *
     * @method _jsIn
     * @param * key
     * @param rge rge
     */
    function _jsIn(key, rge) {
        if(!key || !rge) return false;
        if(rge.join) {
            for(var i = 0, len = rge.length; i < len; i++) {
                if(key == rge[i]) return true;
            }    
        }    
        try{
            return rge.match(key) ? true : false;    
        }catch(e) {
            return false;    
        }
    };

    /**
     * 判断变量是否是指定的类型
     *
     * @method _jsIs
     * @param vars 变量名
     * @param type 指定的类型
     */
    function _jsIs(vars, type, args3, args4) {
        switch(type) {
            case 'odd':return vars % 2 == 1;break;
            case 'even':return vars % 2 == 0;break;
            case 'divisibleby': return vars % args3 == 0;break;
            case 'defined': return typeof vars != 'undefined';break;
            default:if(Ursa.varType && Ursa.varType[type]) {
                return Ursa.varType[type].apply(null, arguments);
            } else {
                return false
            };
        }
    };
    
    // filter
    var fdict = {
        'trim' : _trim,
        'escape': _escape
    };
    function trim() {
        return this.replace(/(^\s*)|(\s*$)/g, "");
    };
    
    function _trim(str) {
        return str ? (str + '').replace(/(^\s*)|(\s*$)/g, "") : '';
    };
     
    function _default(vars) {
        return vars;
    };
    
    function _abs(vars) {
        return Math.abs(vars);
    };
    
    function _format(vars) {
        if(!vars) return '';
        var placeHolder = vars.split(/%s/g);
        var str = ''
            , arg = arguments;
        each(placeHolder, function(item, key, i) {
            str += item + (arg[i + 1] ? arg[i + 1] : '');
        });
        return str;
    };
    
    function _join(vars, div) {
        if(!vars) return '';
        if(vars.join) return vars.join(div);
        return vars;
    };
    
    function _length(vars) {
        return vars ? vars.length : 0;
    };
    
    function _replace(str, replacer) {
        if(!str) return '';
        var str = str;
        each(replacer, function(value, key) {
            str = str.replace(new RegExp(key, 'g'), value);
        });
        return str;
    };
    
    function _slice(arr, start, length) {
        if(arr && arr.slice) {
            return arr.slice(start, start + length);
        } else {
            return arr;
        }
    };
    
    function _sort(arr) {
        if(arr && arr.sort) {
            arr.sort(function(a, b) {return a -b});
        }
        return arr;
    };
    
    function _escape(str, type) {
        if(!str) return '';
        var str = str.toString();
        // js
        if(type == 'js') return str.replace(/\'/g, '\\\'').replace(/\"/g, '\\"');
        // none
        if(type == 'none') return str;
        
        if(Ursa.escapeType && Ursa.escapeType[type]) return Ursa.escapeType[type](str);
        // default is html
        return str.replace(/<|>/g, function(m){
            if(m == '<') return '&lt;';
            return '&gt;';
        })
    };
    // filter and function area end


    // config
    Ursa.config = {
       'statementpfix': '{%', 
       'statementsfix': '%}', 
       'outputpfix'   : '{{', 
       'outputsfix'   : '}}', 
       'commentpfix'  : '{#',
       'commentsfix'  : '#}'
    };
    // cache tpl function
    Ursa._tpl = {};
    /**
     * 渲染模板
     *
     * @method render
     * @return html片段.
     * @param string tplName 模板名.
     * @param Object data 数据.
     * @param string [tplString] 模板源，可缺省.
     */
    Ursa.render = function(tplName, data, tplString) {
        if(!Ursa._tpl[tplName])Ursa.compile(tplString, tplName);
        return Ursa._tpl[tplName](data);
    };
    /**
     * 编译模板
     *
     * @method render
     * @return function 模板函数.
     * @param string tplString 模板源.
     * @param string [tplName] 模板名，可缺省.
     */
    Ursa.compile = function(tplString, tplName) {
        var str = parse(tplString);
        try{
            eval('Ursa._tpl["' + tplName + '"] = ' + str);
        } catch(e) {
            dumpError('创建模板失败' + e, 'tpl');
        }
        return Ursa._tpl[tplName];
    };

    var tags = 'for|endfor|if|elif|else|endif|set';
    var tagsReplacer = {
            'for': {
                'validate': /for[\s]+[^\s]+\sin[\s]+[\S]+/g,
                'pfixFunc': function(obj) {
                    var statement = obj.statement
                        // 形参
                        , args = statement.split(/[\s]+in[\s]+/g)[0]
                        // 被循环的对象
                        , context = statement.replace(new RegExp('^' + args + '[\\s]+in[\\s]+', 'g'), '');
                    if(args.indexOf(',') != -1){
                        args = args.split(',');
                        if(args.length > 2) dumpError('多余的","在' + args.join(','), 'tpl');
                        args = args.reverse().join(',');
                    }
                    return '(function() {' +
                                'var loop = {' +
                                    'index:0,' +
                                    'index0:-1,' +
                                    'length: _length(' + context + ')' +
                                '}; ' +
                            'if(loop.length > 0) {' +
                                'each(' + context +', function(' + args + ') {' + 
                                    'loop.index ++;' +
                                    'loop.index0 ++;' +
                                    'loop.first = loop.index0 == 0;' + 
                                    'loop.last = loop.index == loop.length;'
                }
            },
            'endfor': {
                'pfixFunc': function(obj, hasElse) {
                    // 是否存在forelse
                    return (hasElse ? '' : '})') + 
                        '}' + 
                        '})();' 
                }
            },
            'if': {
                'validate': /if[\s]+[^\s]+/g,
                'pfixFunc': function(obj) {
                    var statement = obj.statement;
                    var tests = compileOperator(statement);
                    return 'if(' + tests;
                },
                'sfix': ') {'
            },
            'elif': {
                'validate': /elif[\s]+[^\s]+/g,
                'pfixFunc': function(obj) {
                    var statement = obj.statement;
                    var tests = compileOperator(statement);
                    return '} else if(' + tests;
                },
                'sfix': ') {'
            },
            'else': {
                'pfixFunc': function(obj, start) {
                    // forelse
                    if(start == 'for') return  '})} else {';
                    return '} else {';
                } 
            },
            'endif': {
                'pfix': '}' 
            },
            'set': {
                'validate': /set[\s]+[^\s]+/g,
                'pfixFunc': function(obj) {
                    var statement = obj.statement;
                    var tests = compileOperator(statement);
                    return 'var ' + tests;
                },
                'sfix': ';' 
            }
        };

    var operator = '\\/\\/|\\*\\*|\\||in|is';
    var operatorReplacer = {
            '//': {
                'pfix': 'parseInt(',    
                'sfix': ')'
            },
            '**': {
                'pfixFunc': function() {
                    return 'Math.pow(';
                },
                'sfix': ')'    
            },
            '|': {
                'sfix': ')'   
            },
            'in': {
                'pfixFunc': function(vars) {
                    return  '_jsIn(((typeof ' + vars + ' != "undefined") ? ' + vars + ': __undefinded)';
                },
                'sfix': ')' 
            },
            'is': {
                'pfixFunc': function(vars) {
                    return '_jsIs(typeof ' + vars + ' != "undefined" ? ' + vars + ' : __undefinded';
                },
                'sfix': ')'                
            },
            'and': {
                'pfixFunc': function(obj) {
                    var statement = obj.statement;
                    return statement.replace(/[\s]*and[\s]*/g, ' && ');
                }    
            },
            'or': {
                'pfixFunc': function(obj) {
                    var statement = obj.statement;
                    return statement.replace(/[\s]*or[\s]*/g, ' || ');
                }      
            },
            'not': {
                'pfixFunc': function(obj) {
                    var statement = obj.statement;
                    return statement.replace(/[\s]*not[\s]*/g, '!');
                }    
            }
        };
    function merge(obj, opstatement, start) {
        return (obj.pfixFunc && obj.pfixFunc(opstatement, start) || obj.pfix || '') + (opstatement.sfix || obj.sfix || '');
    };
    //提取 is in的参数，后续不能包含空格
    function funcVars(str) {
        var str = str.replace(/\([\s]*\)/g,'').replace(/[\s\(]+/g, ',').replace(/\)$/g, '');
        var dot = str.indexOf(',');
        if(dot == -1) {
            str += '"';
        } else {
            str = str.substring(0, dot) + '"' + str.substring(dot);
        }
        return str;
    };
    function getStrings(opstatement) {
        // 处理字符串常量，字符串常量内包含 in，is not and or可能会影响后面的编译替换，但是又不能转义
        var p = 0
            , opstatement = opstatement
            // 字符串开始的位置
            , start
            // 字符串开始的符号， " or '
            , begin
            , strs = new String(opstatement).split('')
            // 将字符串常量，转存
            , bark = {}
            , randomNum = Math.random() * 100 >> 0;
        while(strs[p]) {
            // 转义，跳两位
            if(strs[p] == '\\') {
                p = p + 2;
                continue;
            } else if(strs[p].match(/[\'"]/)) {
                // 结束
                if(begin) {
                    if(begin == strs[p]) {
                        var __key = '_@_p' + p + randomNum + '_@_';
                        bark[__key] = strs.slice(start, p + 1).join('');
                        opstatement = opstatement.replace(bark[__key], __key);
                        begin = false;
                        start = false;
                    }
                // 开始
                } else {
                    begin = strs[p];
                    start = p;
                }
            }
            p++;
        }
        return [
            opstatement,
            bark
        ]
    };
    function redoGetStrings(str, bark) {
        each(bark, function(value, key) {
            str = str.replace(new RegExp(key, 'g'), value);
        });
        return str;
    };
    
    function compileOperator(opstatement, noNeedGetString) {
        // 就一个字符串常量
        if(opstatement.replace(/\\[\S]{1}/g, '').match(/(^\'[^\']+\'$)|(^\"[^\"]+\"$)/g)) {
            return opstatement;
        }
        
        if(!noNeedGetString) {
            var tmp = getStrings(opstatement)
                , opstatement = tmp[0];
        }
        
        // 需要特别处理的操作符
        
        var reg = new RegExp('(^(not)|[\\s]+(and|or|not))[\\s]+', 'g')
                , matches;
        // not => not vars or not ()
        opstatement = opstatement.replace(/[^\s\(\)]+[\s]+is[\s]+not[\s]+[^\s\(\)]+(\([^\)]*\))?/g, function(m) {
            var vars = m.split(/[\s]+is[\s]+not/);
            var str = '!' + operatorReplacer['is']['pfixFunc'](vars[0]);
            vars.splice(0, 1);
            vars = funcVars(_trim(vars.join('')));
            return str + (vars ? ', "' + vars + '' : '') + operatorReplacer['is']['sfix']
        })
        // is => var is func(type) or var is not func(type)
        opstatement = opstatement.replace(/[^\s\(\)]+[\s]+is[\s]+[^\s\(\)]+(\([^\)]*\))?/g, function(m) {
            var vars = m.split(/[\s]+is[\s]+/);
            var str = operatorReplacer['is']['pfixFunc'](vars[0]);
            vars.splice(0, 1);
            vars = funcVars(_trim(vars.join('is')));
            return str + (vars ? ', "' + vars + '' : '') + operatorReplacer['is']['sfix']
        })
        // in => var in range() or var in "string"
        var vars = opstatement.match(/[^\s]+[\s]+in[\s]+[^\s]+/g);
        if(vars) {
            for(var i = 0, len = vars.length; i < len; i++) {
                var varName = vars[i].split(/[\s]+/g);
                // 获取in的操作对象range，range内不能出现空格
                var rge = varName[varName.length - 1];
                // get 变量名
                varName = varName[0];
                opstatement = opstatement.replace(vars[i], operatorReplacer['in'].pfixFunc(varName) + ',' + rge + operatorReplacer['in'].sfix);
            }
        }
        
        // 替换and or not
        opstatement = opstatement.replace(reg, function(m) {
            var m = _trim(m);
            if(m == 'not') return '!';
            if(m == 'and') return '&&';
            if(m == 'or') return '||';
        });
        if(!noNeedGetString) {
            opstatement = redoGetStrings(opstatement, tmp[1]);
        }
        return opstatement;
    };
    function output(source) {
        //source = source.replace(/\\\|/g, '___zhuanyi___');
        // 对字符串常量进行转义
        var tmp = getStrings(source)
            , source = tmp[0];
        source = source.split('|');
        // 待输出变量，因为已经对字符串常量做了一次替换，因此不需要再做替换
        var str = compileOperator(source[0], 'noNeedGetString')
            , escapeDefault = 1;
        for(var i = 1, len = source.length; i< len; i ++) {
            var func = '_' + _trim(source[i]);
            var fs = func.split('(');
            var fname = _trim(fs[0]);
            fs.splice(0, 1);
            fs = _trim(fs.join('('));
            if(fname == '_default') {
                str = fname + '( typeof ' + str + ' == "undefined" ? ' + fs.replace(/\)$/g, '') + ' : ' + str + ')';
            } else {
                // 函数调用以(结束或者没有包含()
                str = fname + '(' + str + ((!fs || fs == ')')  ? ')' : ',' + fs);
            }
        }
        str = redoGetStrings(str, tmp[1]);
        if(str.match(/escape[^,]+,[\'"]+none[\'\"]+[^)]*\)/g)) escapeDefault = 0;
        //if(escapeDefault) return '__output.push(_escape(' + str.replace(/___zhuanyi___/g, '|') + '));';
        //return '__output.push(' + str.replace(/___zhuanyi___/g, '|') + ');';
        if(escapeDefault) return '__output.push(_escape(' + str + '));';
        return '__output.push(' + str + ');';
    };
    // get error line number
    function getLineNumber(tplString, pointer) {
        return tplString ? (tplString.substr(0,pointer + 1).match(/\n/g) || []).length + 1 : 0; 
    }
    /**
     * 解析器
     *
     * @return function.
     * @param string tplString 模板源.
     */
    function parse(tplString) {
        var body = cleanWhiteSpace(tplString).split('');
        // 逐字符编译
        var result = 'function (__context) {var __output = [];with(__context) {'
            , pointer = 0
            , statementpointer = 0
            , stack = []
            // 用来记录tag list，检测tag是否闭合，并且用来区分forelse 和 ifelse
            , tagStack = []
            , tagStackPointer = []
            // 3 注释语法， 1 语句语法， 2 非语法，4输出语法
            , isStatementInStack = false;

        
        while(pointer < body.length) {
            // 最先检测是否注释
            if(isStatementInStack == 3) {
                // 注释内，未检测到语法结束标记
                if(body[pointer] == '#' && (typeof body[pointer + 1] != 'undefined') && (body[pointer + 1] == '}')) {
                    isStatementInStack = false;
                    // 后移两位
                    pointer += 2;
                } else {
                    pointer++;
                    continue;
                }
            }
            // 碰到转义符，指针向后移多移动一位，将\后的字符push到站内
            if(body[pointer] == '\\') {
                pointer++; 
                if(typeof body[pointer] == undefined) dumpError('错误的使用了\\，行数:' + getLineNumber(tplString, pointer), 'tpl');
                // 语法内保留转义符
                if(isStatementInStack != 2)stack.push('\\');
                stack.push(body[pointer]);
            } else if((body[pointer] == '{') && (typeof body[pointer + 1] != 'undefined') && (body[pointer + 1].match(/[\{%#]/))) {
                // 非语法在堆栈内
                if(isStatementInStack == 2) {
                    result += '__output.push("' + _escape(stack.join(''), 'js') + '");'; 
                    isStatementInStack = false;
                    stack = [];
                // 语法在堆栈内，结束前检测到开始，抛出错误
                } else if(isStatementInStack) {
                    dumpError('缺少结束符}"，行数:' + getLineNumber(tplString, pointer), 'tpl');
                }
                // 碰到括号向后多移一位
                pointer++;
                if(typeof body[pointer] != undefined) {
                    switch(body[pointer]) {
                        case '{':isStatementInStack = 4;break;
                        case '#':isStatementInStack = 3;break;
                        case '%':isStatementInStack = 1;break;
                        default:dumpError('缺少"{","#"或者"%"，行数:' + getLineNumber(tplString, pointer), 'tpl');
                    }
                }
                /*
                // 未转义的{，如果后面没有发现 #, % {，抛出错误
                if(typeof body[pointer] != undefined) {
                    switch(body[pointer]) {
                        case '{':isStatementInStack = 4;break;
                        case '#':isStatementInStack = 3;break;
                        case '%':isStatementInStack = 1;break;
                        default:dumpError('缺少"{","#"或者"%"，行数:' + getLineNumber(tplString, pointer), 'tpl');
                    }
                } else {
                    dumpError('缺少"{","#"或者"%"，行数:' + getLineNumber(tplString, pointer), 'tpl');
                }
                */
                pointer++;
                if(typeof body[pointer] == undefined) dumpError('未闭合的{，,行数:' + getLineNumber(tplString, pointer), 'tpl');
                // 非注释语句进堆栈
                if(isStatementInStack != 3) stack.push(body[pointer]);
            } else if(typeof body[pointer] != 'undefined' && body[pointer].match(/[\}%]/g)){
                // 语法结束标记
                if((isStatementInStack != 2) && (typeof body[pointer + 1] != 'undefined') && (body[pointer + 1] == '}')) {
                    // 输出
                    if(body[pointer] == '}') {
                        var source = _trim(stack.join(''));
                        result += output(source);
                    // 语句
                    } else {
                        // 判断当前的语句是否在一个if或者for单元内
                        var start = tagStackPointer[tagStackPointer.length - 1];
                        // 额，容错太牛逼了，elseaa居然是合法的
                        var reg = new RegExp('^(' + tags + ')[\\s]*', 'g')
                            , matches
                            , flag = start && start.type
                            , source = _trim(stack.join(''));
                        if((matches = source.match(reg))) {
                            matches = _trim(matches[0]);
                            // 结束标签，出栈
                            if(matches.indexOf('end') == 0) {
                                // 没有开始标签，就出现结束标签
                                if(!start) dumpError('缺少"' + matches.replace('end', '') + ',行数:' + getLineNumber(tplString, pointer), 'tpl');
                                // 主要为for服务，检查是否存在forelse
                                flag = tagStack.splice(start.p, tagStack.length - start.p).length > 1;
                                tagStackPointer.splice(tagStackPointer.length - 1, 1);
                            // 需要进栈的标签
                            } else if(matches != 'set'){
                                tagStack.push(matches);
                                // 开始标签，将tagStack指针指向栈顶，并标明当前开始标签的类型
                                if(matches == 'if' || matches == 'for') tagStackPointer.push({p: tagStack.length - 1, type: matches});
                            }
                            result += merge(tagsReplacer[matches], {statement: source.replace(new RegExp('^' + matches + '[\\s]*', 'g'), '')}, flag);
                        } else {
                            dumpError('不存在的标签:' + source.split(' ')[0] + ',行数:' + getLineNumber(tplString, pointer), 'tpl');
                        }
                    }
                    stack = [];
                    // 语法操作完毕，将标志位置为false
                    isStatementInStack = false;
                    pointer++;
                } else {
                    stack.push(body[pointer]);
                }
            // 普通字符
            } else {
                if(!isStatementInStack) {
                    isStatementInStack = 2;
                }
                stack.push(body[pointer]);
            }
            pointer ++;
        }
        // 非语法一开始是由语法开始标记触发，编译最后需要检测一下stack内是否有遗留内容
        if(stack.length) {
            result += '__output.push("' + _escape(stack.join(''), 'js') + '");'; 
            stack = [];
        } 
        result += '};return __output.join("");}';
        // 标签未闭合，可以加个自动修复，哈哈
        if(tagStack.length) dumpError('以下标签未闭合' + tagStack.join(','), 'tpl');
        // 移除换行符
        //console.log(result.replace(/\n/g, '\\n'));
        return result.replace(/\n/g, '\\n');
    };
})();

if (__ssjs__)exports.Ursa = Ursa;
