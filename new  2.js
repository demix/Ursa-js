
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
        // ע��
        if(type == 3) {
            // ע�ͽ������
            if(character == commentEnder) {
                character = tplString.charAt(++pointer);
                // �﷨������� 
                if(character == ender) {
                    type = false;
                }
            } 
            ++pointer;
            continue;
        }
        // �ַ�������
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
        // ת��
        } else if(character == '\\') {
            character = tplString[++pointer];    
            stack += character;
        // �﷨��ʼ��
        } else if(character == starter) {
            character = tplString[++pointer];
            oldType = type;
            switch(character) {
                case commentStarter: type = 3;break;
                case opStarter:      type = 4;break;
                case statementStarter:type = 1;break; 
                default:stack += starter + character;continue;break;
            }
            // ���﷨��ջ
            if(oldType == 2) {
                //tree.push(stack);
				result += Ursa.ioHTML(stack);
                stack = '';
            // ����
            } else {
                //stack = ''; 
				dumpError(2, tplString, pointer);
            }
        // �﷨����
        } else if(endType = character.match(endStartReg)) {
            endType = endType[0];
            if(type != 2) {
                character = tplString[++pointer]; 
                // �﷨����
                if(character == ender) {
                    // �������
                    if(endType == opEnder) {
                        /*
						tree.push({
                            type: 4,
                            id: id + 1,
                            v   : stack
                        }) 
						*/
                        result += Ursa.ioOutput(_trim(stack));
                    // ���
                    } else {
                        var start = tagStackPointer[tagStackPointer.length - 1]
                            , matches
                            , flag = start && start.type
                            , source = _trim(stack)
                            , id = 1;
                        if((matches = source.match(tags))) {
                            matches = matches[0];
                            // ������ǩ����ջ
                            if(matches.indexOf('end') == 0) {
                                id = tagStackPointer.length;
                                // ��ҪΪfor���񣬼���Ƿ����forelse
                                flag = tagStack.splice(start.p, tagStack.length - start.p).length > 1;
                                tagStackPointer.splice(tagStackPointer.length - 1, 1);
                            // ��Ҫ��ջ�ı�ǩ
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
			// ����    
			dumpError(8, stack);
        }
    }
	result += Ursa.ioEnd();
	// ��ǩδ�պϣ����ԼӸ��Զ��޸�������
	if(tagStack.length) dumpError(5, tplString, pointer, tagStack);
	// �Ƴ����з��������ַ���ת��
	return redoGetStrings(result.replace(/\n/g, ''), strDic);
    return result;
};



