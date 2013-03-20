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
    , endStartReg = new RegExp('[' + opEnder + commentEnder + statementEnder + ']', 'g')
    , tags = new RegExp('for|endfor|if|elif|else|endif|set', 'g');
function SyntaxGetter(tplString) {
    var pointer = -1
        , character
        , stack = ''
        , statement = ''
        , endType = ''
        , tree = []
        , oldType
        , tagStack = []
        , tagStackPointer = []
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
            ++pointer;
            continue;
        }
        // 字符串常量
        if(type % 3 == 1 && (character == '\'' || character == '"')) {
            var start = tplString[pointer]
                , tmpStr = start;
            //stack.push(start);
            while((character = tplString[++pointer]) && (character != start)) {
                if(character == '\\') {
                    tmpStr += '\\';
                    character = tplString[++pointer];
                }
                tmpStr += character;
            }
            tmpStr += start;
            //stack += tmpStr;
            stack += '__string__';
        // 转义
        } else if(character == '\\') {
            character = tplString[++pointer];    
            stack += character;
        // 语法起始符
        } else if(character == starter) {
            character = tplString[++pointer];
            oldType = type;
            switch(character) {
                case commentStarter: type = 3;break;
                case opStarter:      type = 4;break;
                case statementStarter:type = 1;break; 
                default:stack += starter + character;continue;break;
            }
            // 非语法出栈
            if(oldType == 2) {
                tree.push(stack);
                stack = '';
            // 出错
            } else {
                stack = ''; 
            }
        // 语法结束
        } else if(endType = character.match(endStartReg)) {
            endType = endType[0];
            if(type != 2) {
                character = tplString[++pointer]; 
                // 语法结束
                if(character == ender) {
                    // 输出结束
                    if(endType == opEnder) {
                        tree.push({
                            type: 4,
                            id: id + 1,
                            v   : stack
                        }) 
                    // 语句
                    } else {
                        var start = tagStackPointer[tagStackPointer.length - 1]
                            , matches
                            , flag = start && start.type
                            , source = trim(stack)
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
                        }
                        tree.push({
                            type: 1,
                            id: id, 
                            elif: flag,
                            v:    stack    
                        })    
                    } 
                    type = false;
                    stack = '';
                    continue;
                }
            }
            stack += endType + character;
        } else {
            if(!type) {
                type = 2    
            }    
            stack += character;
        }
    }
    if(stack) {
        if(type == 2) {
            tree.push(stack);    
        } else {
        // 出错    
        }
    }
    return tree;
};
function trim(str) {
    return str ? str.replace(/^[\t\n\s]+|[\t\n\s]+$/g,'') : '';   
};
function strToObj(str) {
    var str = str.split('.')
        , k = 0
        , obj = {}
        , p = obj;
    while(k < str.length) {
        p[str[k]] = {};
        k++;
    }
};
/*
 * 根据语句构建数据树
 * */
function dataBuilder(statementTree) {
    var root = {}
        , node
        , nodePos = {}
        , nodes = statementTree;
    for(var i = 0, len = nodes.length; i < len; i++) {
        console.log(nodes[i]);
        if(nodes[i].id == 1) {
                
        }
        /*
        var v = trim(nodes[i].v || nodes[i]).replace(/\[\"[^\"]+\"\]|\[\'[^\']+\'\]/g, function(str) {
                    return str.replace(/\[\"|\[\'/g, '.').replace(/\'\]|\"\]/g, '')
                })
            , tag = v.match(/^[^\s]+/g);
        switch(nodes[i].type) {
            // 输出
            case 4:
            ;break;
            // 语句
            case 1:
                console.log(nodes[i]);
                if(tag == 'set') {
                    
                // 循环一律反解为以数字做key的object
                } else if(tag == 'for') {
                    v = trim(v.replace(/^for\s+/g, '').replace(/\s+in\s+|range\([^\)]+\)/g, ' ')).split(/,\s+|\s+|,/g);
                    if(v.length < 2) {
                        continue;    
                    } else { 
                        var p = nodes[i].id == 1 ? root : {}
                            , n = v.length == 2 ? v[1] : v[2]
                             cn = v.length == 2 ? v[0] : v[1];
                        node = {
                            //_n: n,
                            //_p: p,
                            '0': {
                                _n: cn
                            }
                        }    
                        p[n] = node;
                        //node['0']._p = node;
                        nodePos[cn + '' + nodes[i].id] = node[0]
                    }

                } else if(tag == 'extend') {
                    
                } else if(tag == 'block' || tag == 'endblock') {
                    
                } else if(tag == 'if' || tag == 'elif') {
                    
                }
            ;break;
            default:continue; 
        
        }
    */
    }
    return root;
};






