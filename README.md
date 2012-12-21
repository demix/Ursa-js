Ursa-js
=======

为Ursa服务的javascript模板,语法是Jinja(python,php),twig(php)的子集，不依赖任何框架，可运行在浏览器端和node环境

不足和bug:

1，is 和 in 语法的支持不够用，存在一些语法上的限制和bug，由于js本身对is 和 in 并不支持或者支持的不好，因此在使用这两个operator时必须简单，并且符合某种规范，如下：

   a is funcType ? "yes" : "no" - 三元运算，funcType后面一定要跟一个空格，作为funcType的结束表示符，另外funcType内不能包含空格，以上要求同样适用于in
    
2，输出语句对过滤器的支持不够，限制了一个输出语句内只能对一个参数或者语句执行filter操作，例如：

   range|sort|slice(0,2)|join('-') + otherStatment 要求最后一个filter操作后面需用一个空格和其他语句隔开，并且其他语句是不能再适用filter操作，例如：
   range|sort + other|join('-') 将会导致错误的解析

###1，语法特征

    Jinja和twig的子集

    {%%} - 语句

    {{}} - 输出 输出语句内不能出现对多个变量进行filter操作，这会导致引擎无法正确解析,例如{{range(10,1)|sort|join('-')}}是没有问题的，但是{{range(1,10)|join + range(2,10)|join}}将无法正确解析

    {##} - 注释


###2，支持的tag

    {%if elif else endif%} 条件判断

    {%for key,value in else endfor%} 循环

    {%set var = exper%} 声明一个变量

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

###4，支持的函数

    range - range(start, end, size) - 返回一个数组，start开始，以size递增，不包含end

    each  - each(vars, function(value, key, index0) {}) - 在模板内可以引用的循环,index0是循环次数

###5，自带过滤器，可以开发扩展过滤器

    slice - vars|slice(start, length) - 返回数组vars的子集

    sort - array|sort - 对数组升序排序

    join - array|join('-') - 链接数组

    length - vars|length - 返回vars的length

    replace - str|replace(obj) - 用obj内的value替换出现在str内的key

    format - str|format(v1,v2,v3...) - 用出现的参数，逐次替换出现在str内的"%s"

    abs - num|abs - 返回num的绝对值

    default - vars|default('vars is not defined') - 给vars指定一个默认值

    escape - var|escape[('js' or 'none')] - 对vars进行转义，默认会对所有输出进行转义，转义类型也可以开发扩展函数






