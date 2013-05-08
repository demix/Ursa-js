var __ssjs__ = typeof exports == 'undefined' ? false : true;
if (__ssjs__) {
    var Ursa = {varType:{}, escapeType:{}};
}
	
(function() {
    if (!__ssjs__) {
        if (typeof Ursa != 'undefined' && typeof Ursa.render != 'undefined') return;
        window.Ursa = window.Ursa || {varType:{}, escapeType:{}};
    };
	
	/*
		所有语法必须由 starter + type starter + statement + type ender + ender组成
	 */
	var config = {
			starter: '{',
			ender  : '}',
			commentStarter: '#',
			commentEnder: '#',
			opStarter: '{',
			opEnder: '}',    
			statementStarter: '%',
			statementEnder  : '%'
		}
		, starter = config.starter
		, ender   = config.ender
		, commentStarter = config.commentStarter
		, commentEnder = config.commentEnder
		, opStarter = config.opStarter
		, opEnder = config.opEnder
		, statementStarter = config.statementStarter
		, statementEnder   = config.statementEnder
		, endStartReg = new RegExp('[' + opEnder + commentEnder + statementEnder + ']', 'g');
		
	function setConfig(conf) {
		for(var i in conf) {
			if(config[i]) config[i] = conf[i];
		}
		starter = config.starter
		, ender   = config.ender
		, commentStarter = config.commentStarter
		, commentEnder = config.commentEnder
		, opStarter = config.opStarter
		, opEnder = config.opEnder
		, statementStarter = config.statementStarter
		, statementEnder   = config.statementEnder;
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
        if(rge instanceof Array) {
            for (var i = 0, len = rge.length; i < len; i++) {
                callback && callback(rge[i], i, i);
            }
        } else if(rge instanceof Object) {
            var index = 0;
            for (var key in rge) {
                if (typeof rge[key] != 'function') {
                    callback && callback(rge[key], key, index);
                    index++;
                }
            }
        }
    };

    /**
     * @method dumpError
     */
    function dumpError(code, tplString, pointer, matches) {
        var msg;
        switch(code) {
            case 1:  msg = '错误的使用了\\，行数:' + getLineNumber(tplString, pointer);break;
            case 2:  msg = '缺少结束符}"，行数:' + getLineNumber(tplString, pointer);break;
            case 3:  msg = '缺少"{","#"或者"%"，行数:' + getLineNumber(tplString, pointer);break;
            case 4:  msg = '未闭合的{，,行数:' + getLineNumber(tplString, pointer);break;
            case 5:  msg = '以下标签未闭合' + matches.join(',');break;
            case 6:  msg = '创建模板失败' + tplString;break;
            case 7:  msg = '缺少"' + matches.replace('end', '') + ',行数:' + getLineNumber(tplString, pointer);break;
            case 8: msg = '缺少结束符}' + tplString;break;
            default: msg = '出错了';break;
        }
        throw new Error(msg);
    };
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
        if (rge instanceof Array) return rge.length;
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
        if(rge instanceof Array) {
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
        if(vars instanceof Array) return vars.join(typeof div != 'undefined' ? div : ',');
        return vars;
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
        if(typeof str == 'undefined' || str == null) return '';
        if(str && (str.safe == 1)) return str.str;
        var str = str.toString();
        // js
        if(type == 'js') return str.replace(/\'/g, '\\\'').replace(/\"/g, '\\"');
        // none
        if(type == 'none') return {str:str, safe: 1};
        
        if(Ursa.escapeType && Ursa.escapeType[type]) return Ursa.escapeType[type](str);
        // default is html
        return str.replace(/<|>/g, function(m){
            if(m == '<') return '&lt;';
            return '&gt;';
        })
    };
    // escape none
    function _raw(str) {
        return {
            safe: 1,
            str: str    
        }    
    };
    // 截取字符串
    function _truncate(str, len, killwords, end) {
        if(typeof str == 'undefined') return '';   
        var str = new String(str);
        var killwords = killwords || false;
        var end = typeof end == 'undefined' ? '...' : '';
        if(killwords) return (typeof len == 'undefined' ? str.substr(0, str.length) : str.substr(0, len) + (str.length <= len ? '' : end));
        return end;
    };
    function _substring(str, start, end) {
        if(typeof str == 'undefined') return '';   
        var str = new String(str);
        var end = typeof end != 'undefined' ? end : str.length;
        return str.substring(start, end);
    };
    function _upper(str) {
        if(typeof str == 'undefined') return '';   
        return new String(str).toUpperCase();
    };
    function _lower(str) {
        if(typeof str == 'undefined') return '';   
        return new String(str).toLowerCase();
    };
    // filter and function area end
    
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
        var str = SyntaxGetter(tplString);
        try{
            eval('Ursa._tpl["' + tplName + '"] = ' + str);
        } catch(e) {
            dumpError(6, e);
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
                        , _args
                        , _value = _args
                        , _key = args
                        // 被循环的对象
                        , context = statement.replace(new RegExp('^' + args + '[\\s]+in[\\s]+', 'g'), '');
                    if(args.indexOf(',') != -1){
                        args = args.split(',');
                        if(args.length > 2) dumpError('多余的","在' + args.join(','), 'tpl');
                        _key = args[0];
                        _value = args[1];
                        _args = args.reverse().join(',');
                    } else {
                        _key = '_key';    
                        _value = args;
                        _args = args + ',' + '_key';
                    }
                    return '(function() {' +
                                'var loop = {' +
                                    'index:0,' +
                                    'index0:-1,' +
                                    'length: _length(' + context + ')' +
                                '}; ' +
                            'if(loop.length > 0) {' +
                                'each(' + context +', function(' + _args + ') {' + 
                                    'loop.index ++;' +
                                    'loop.index0 ++;' +
                                    'loop.key = ' + _key + ';' +
                                    'loop.value = ' + _value + ';' +
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
    function redoGetStrings(str, bark) {
        each(bark, function(value, key) {
            str = str.replace(new RegExp(key, 'g'), value);
        });
        return str;
    };
    
    function compileOperator(opstatement) {
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
        return opstatement;
    };
    function output(source) {
        source = source.split('|');
        var str = compileOperator(source[0]);
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
        return '__output.push(_escape(' + str + '));';
    };
    // get error line number
    function getLineNumber(tplString, pointer) {
        return tplString ? (tplString.substr(0,pointer + 1).match(/\n/g) || []).length + 1 : 0; 
    }
    function setKeyV(obj, value) {
        var k = Math.random() * 100000 >> 0;
        while(!obj['__`begin`__' + k + '__`end`__']) {
            k ++;
            obj['__`begin`__' + k + '__`end`__'] = value;
        }
        return '__`begin`__' + k + '__`end`__';
    };
    /*
        转换产出
        将语法识别和编译替换拆分
     */
    // 模板头编译产物
    Ursa.ioStart = function() {
        return 'function (__context) {var __output = [];with(__context) {';
    };
    // 模板尾编译产物
    Ursa.ioEnd = function() {
        return '};return __output.join("");}';
    };
    // 模板html片段编译产物
    Ursa.ioHTML= function(ins) {
        return '__output.push("' + _escape(ins, 'js') + '");'
    };
    /*
     模板语法的编译需要完成对表达式内filter,function,and not in等操作符的编译替换
     */
    // 输出语句编译产物
    Ursa.ioOutput = function(ins) {
        return output(ins);
    };
    // 不包含tag的语句编译产物
    Ursa.ioOP = function(ins) {
        return compileOperator(ins) + ';'
    };
    // 包含tag的语句编译产物
    Ursa.ioMerge = function(matches, sourceObj, flag) {
        return merge(tagsReplacer[matches], sourceObj, flag);
    };
    /*
     end
     */
    Ursa.set = function(key, value) {
        Ursa[key] = value;
    };
    /**
     * 解析器
     *
     * @return function.
     * @param string tplString 模板源.
     */
	function SyntaxGetter(tplString) {
		var pointer = -1
			, tplString = cleanWhiteSpace(tplString)
			, character
			, stack = ''
			, statement = ''
			, endType = ''
			, tree = []
			, oldType
			, result = Ursa.ioStart()
			, tagStack = []
			, tagStackPointer = []
			, strDic = {}
			, type  = false;  

		while((character = tplString.charAt(++pointer)) != '') { 
			id = tagStackPointer.length;
			// 注释
			if(type == 3) {
				// 注释结束标记
				if(character == commentEnder) {
					character = tplString.charAt(++pointer);
					// 语法结束标记 
					if(character == ender) {
						type = false;
					}
				} 
				continue;
			}
			// 字符串常量
			if(type % 3 == 1 && (character == '\'' || character == '"')) {
				var start = tplString.charAt(pointer)
					, tmpStr = start;
				//stack.push(start);
				while((character = tplString.charAt(++pointer)) && (character != start)) {
					if(character == '\\') {
						tmpStr += '\\';
						character = tplString.charAt(++pointer);
					}
					tmpStr += character;
				}
				tmpStr += start;
				//stack += tmpStr;
				stack += setKeyV(strDic, tmpStr);
				//stack += '__string__';
			// 转义
			} else if(character == '\\') {
				character = tplString.charAt(++pointer);    
				stack += character;
			// 语法起始符
			} else if(character == starter) {
				character = tplString.charAt(++pointer);
				oldType = type;
				switch(character) {
					case commentStarter: type = 3;break;
					case opStarter:      type = 4;break;
					case statementStarter:type = 1;break; 
					default:/*可能是字符串常量开始，回退一个字符*/stack += starter;if(character.match(/[\'\"]/g)) {pointer--;} else {stack += character};continue;break;
				}
				// 非语法出栈
				if(oldType == 2) {
					//tree.push(stack);
					result += Ursa.ioHTML(stack);
					stack = '';
				// 出错
				} else if(character == ender){
					//stack = ''; 
					//dumpError(2, tplString, pointer);
				}
			// 语法结束
			} else if(endType = character.match(endStartReg)) {
				// 结束标记起始，语句 or 输出
				endType = endType[0];
				if(type != 2) {
					character = tplString.charAt(++pointer); 
					// 语法结束
					if(character == ender) {
						// 输出结束
						if(endType == opEnder) {
							/*
							tree.push({
								type: 4,
								id: id + 1,
								v   : stack
							}) 
							*/
							result += Ursa.ioOutput(_trim(stack));
						// 语句
						} else {
							var start = tagStackPointer[tagStackPointer.length - 1]
								, matches
								, flag = start && start.type
								, source = _trim(stack)
								, id = 1;
							if((matches = source.match(tags))) {
								matches = matches[0];
								// 结束标签，出栈
								if(matches.indexOf('end') == 0) {
									id = tagStackPointer.length;
									// 主要为for服务，检查是否存在forelse
									flag = tagStack.splice(start.p, tagStack.length - start.p).length > 1;
									tagStackPointer.splice(tagStackPointer.length - 1, 1);
								// 需要进栈的标签
								} else if(matches != 'set') {
									tagStack.push(matches);
									if(matches == 'if' || matches == 'for') tagStackPointer.push({p: tagStack.length - 1, type: matches});
									id = tagStackPointer.length;
								}
								
								result += Ursa.ioMerge(matches, {statement: source.replace(new RegExp('^' + matches + '[\\s]*', 'g'), '')}, flag);
							} else {
								result += Ursa.ioOP(source);
							}
							/*
							tree.push({
								type: 1,
								id: id, 
								elif: flag,
								v:    stack    
							})    
							*/
						} 
						type = false;
						stack = '';
						continue;
					}
					stack += endType + character;
				} else {
					stack += endType;
				}
			} else {
				if(!type) {
					type = 2    
				}    
				stack += character;
			}
		}
		if(stack) {
			if(type == 2) {
				//tree.push(stack);    
				result += Ursa.ioHTML(stack); 
				stack = null;
			} else {
				// 出错    
				dumpError(8, stack);
			}
		}
		result += Ursa.ioEnd();
		// 标签未闭合，可以加个自动修复，哈哈
		if(tagStack.length) dumpError(5, tplString, pointer, tagStack);
		// 移除换行符，并反字符串转义
		return redoGetStrings(result.replace(/\n/g, ''), strDic);
	};
	Ursa.parse = SyntaxGetter;
	Ursa.setConfig = setConfig;
})();

if(__ssjs__) {
    exports.Ursa = Ursa;
} else {
    if(window['define']){
        define(function(){
            return Ursa;
        });
    }
}
