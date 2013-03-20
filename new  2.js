
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
            stack += tmpStr;
			stack += setKeyV(strDic, tmpStr);
            //stack += '__string__';
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
                //tree.push(stack);
				result += Ursa.ioHTML(stack);
                stack = '';
            // 出错
            } else {
                //stack = ''; 
				dumpError(2, tplString, pointer);
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
    return result;
};



