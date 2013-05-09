Ursa-js
=======

为Ursa服务的javascript模板,语法是Jinja(python,php),twig(php)的子集，不依赖任何框架，可运行在浏览器端和node环境

亮点

1，逐字符编译-可以更精确的捕捉到错误出现的行数，方便调试

2，语法识别和编译替换分离，只要重写Ursa的编译替换逻辑，就可以编译输出为其他语言，比如php,jsp等，Ursa只实现了对js的支持

3，jinja的子集，理论上，前端模板可以迁移到后端运行，其中Ursa-powerfull.js已经基本上达到jinja,twig所实现了功能，除了一些filter以及macro标签未实现外，继承、模块已经实现，只需要根据需要重写Ursa.tplLoader

不足和bug【问题1和2已经在Ursa-powerfull.js以及Ursa-new.js内修复，基本可以使用任意复杂的运算表达式】:

1，is 和 in 语法的支持不够用，存在一些语法上的限制和bug，由于js本身对is 和 in 并不支持或者支持的不好，因此在使用这两个operator时必须简单，并且符合某种规范，如下：

   禁用三元操作符：a is funcType ? "yes" : "no" - 三元运算，funcType后面一定要跟一个空格，作为funcType的结束表示符，另外funcType内不能包含空格，以上要求同样适用于in
   

2，输出语句对过滤器的支持不够，限制了一个输出语句内只能对一个参数或者语句执行filter操作，例如：

   range|sort|slice(0,2)|join('-') + otherStatment 要求最后一个filter操作后面需用一个空格和其他语句隔开，并且其他语句是不能再适用filter操作，例如：
   range|sort + other|join('-') 将会导致错误的解析

3，由于循环语法比较强大，带来一个问题就是编译后的js函数在执行循环逻辑的时候比其他前端模板引擎慢1-3倍(100条数据运行10000次)

###1，语法特征

    Jinja和twig的子集

    {%%} - 语句

    {{}} - 输出 输出语句内不能出现对多个变量进行filter操作，这会导致引擎无法正确解析,
    例如{{range(10,1)|sort|join('-')}}是没有问题的，但是{{range(1,10)|join + range(2,10)|join}}将无法正确解析

    {##} - 注释
   
    关键字转义 - html内的出现的第一个"{"[其后面跟着"{","%","#"时必须转义]必须转义为"\{"，
    语句内可以出现"{","%","#","}"以及他们的组合，可以选择转义或者不转义

###2，支持的tag

    {%if elif else endif%} 条件判断

    {%for key,value in else endfor%} 循环

    {%set var = exper%} 声明一个变量


    new - 模板的路径之类通过实现Ursa.tplLoader来自行配置，默认的是在页面内获取id=tplName的元素的innerHTML。如果是textarea将获取value属性

    {% extends 'tplName' %} 继承一个模板，在非block或者父级模板没有定义的block外的输出将被忽略，而非输出语句将会被注入到父模板头部

    {% include 'tplName' %} 包含一个模板，被引用模板可以访问模板内的变量，但是模板不能访问被引用模板内的变量

    {% block blockName %} - {% endblock %} 定义一个模块，可以被继承重写，也可以默认输出，block不能嵌套

###3，支持的操作符

    in - a in b - a是否在数组或者字符串b内 

    is - a is b - a是否b指定的类型，除语法自带类型之外，还可以开发扩展类型判断函数

    not - not a | a is not b - 非

    and - a and b - a && b

    or - a or b - a || b

    +

    -

    *

    /

    >

    <

    =

    >=

    <=

    ==
    
    【new】
    
    **
    
    //

###4，支持的函数

    range - range(start, end, size) - 返回一个数组，start开始，以size递增，不包含end

    each  - each(vars, function(value, key, index0) {}) - 在模板内可以引用的循环,index0是循环次数

###5，自带过滤器，可以开发扩展过滤器，默认会对所有输出escape('html')操作,可以escape('none')取消默认转义

    slice - vars|slice(start, length) - 返回数组vars的子集

    sort - array|sort - 对数组升序排序

    join - array|join('-') - 链接数组

    length - vars|length - 返回vars的length

    replace - str|replace(obj) - 用obj内的value替换出现在str内的key

    format - str|format(v1,v2,v3...) - 用出现的参数，逐次替换出现在str内的"%s"

    abs - num|abs - 返回num的绝对值

    default - vars|default('vars is not defined') - 给vars指定一个默认值

    escape - var|escape[('js' or 'none')] - 对vars进行转义，默认会对所有输出进行转义，转义类型也可以开发扩展函数
    
###6，扩展is类型判断 
   Ursa.varType['hot'] = function(vars){return xxx};

###7，扩展escape类型 
   Ursa.escapeType['number'] = function(str){return xxx};

###8，修改语法界定符 所有语法必须由 starter + type starter + statement + type ender + ender组成

   starter + commentStarter comment commentEnder + ender - 注释语法
   
   starter + opStarter statement opEnder + ender - 输出语法
   
   starter + statementStarter statement statementEnder + ender - 语句

###9, 在非语句内，一律将\当成字符串常量，因此如果需要输出语法界定符，只能通过语句来实现，比如 {{'\\{\\{\\}\\}'}},而不能通过\\{\\{\\}\\}，在语句内，\则充当正常的转义关键词



