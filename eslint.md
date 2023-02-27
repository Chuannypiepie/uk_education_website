文档名词解析
  "error":通常表示错误等级 0不报错 1警告 2报错
  "singleline": 表示 始标签和终止标签在同一行的时候 
  "multiline": 表示 始标签和终止标签不在同一行的时候 
rules
  // 强制每行最大属性数
  vue/max-attributes-per-line:["error", {
    "singleline":  单行最大属性数(num)
    "multiline": { //多行
      "max": 最大属性数(num)
      "allowFirstLine": 是否允许属性和起始标签同一行(bool)
    }
  }]
  singleline-html-element-content-newline:此规则在单行元素的内容之前和之后强制换行
  multiline-html-element-content-newline:此规则在单行元素的内容之前和之后强制换行
  vue/name-property-casing: [error,驼峰 | - 间隔] //组件名
  camelcase 变量名驼峰检测相关
  "vue/html-self-closing": [2, { //标签是否要求有闭合标签
      "html": {
        "void": "always", // void 要求<xx />
        "normal": "never", // 常规 要求 <xx></xx>
        "component": "always" // 组件 <xx />
      },
      "svg": "always",//要求<xx />
      "math": "always"//要求<xx />
    }],
  'accessor-pairs': 要求set get同时出现
  arrow-spacing: 箭头函数前后空格
  block-spacing: 代码块(花括号)前后应该要有空格
  brace-style: 代码块风格
    allowSingleLine: 是否允许代码块起始在一行
  comma-dangle 数组,对象,等... 是否尾随","
  comma-spacing 尾随逗号是否前后加上空格
  comma-style 逗号样式
  constructor-super 继承类是否要求构造父类
  curly 对if while 等语句 是否要求代码块限制
  dot-location 对象引用点的位置  和属性同一行还是 和 对象同一行
  eqeqeq 是否强迫使用 ===
  no-cond-assign 禁止赋值符号出现在if语句
  generator-star-spacing es6 遍历器 * 的前后空格
  handle-callback-err 当函数出现关键词的时候强制要求进行处理 常用于错误回调
  indent 缩进
  jsx-quotes 强制使用单双引号
  key-spacing 强制对象中的值 一样的间距
  keyword-spacing 关键词(if 这些)前后的空格
  new-cap new调用的函数要求大写开头 大写开头的函数要求通过new
  new-parens 当构造函数不需要参数时候强制后面加上括号
  no-array-constructor 不允许通过Array(item,item)的方式创建数组
  no-caller 递归调用的时候禁止使用arguments.callee的方式
  no-console 禁止使用控制台
  no-class-assign 禁止修改class名变量
  no-const-assign 禁止修改const名变量
  no-control-regex 禁止正则里面使用某些特殊字符no-delete-var 禁止删除变量
  no-dupe-args 不允许重复参数
  no-dupe-class-members 不允许类里面有重复名称
  no-dupe-keys 禁止重复键名
  no-duplicate-case case值不能重复
  no-empty-character-class 正则里面不能有空筛选
  no-empty-pattern: 禁止空赋值模式



**快速修复,vue项目**

```js
// 在 package.json中
"scripts": {
    "serve": "vue-cli-service serve",
    "dev": "vue-cli-service serve",
    "build": "vue-cli-service build",
    "build:report": "vue-cli-service build --report",
    "lint": "vue-cli-service lint",
     // 下面这一条
    "lint2": "eslint --fix --ext .js,.vue src"
  },
 //
 $ npm run lint2 
```

**编写过程保存自动修复 vscode  **

**安装  ESLint 修复用**

**安装 Prettier ESLint 修复用**

```json
// setting.json
"editor.codeActionsOnSave": {
	 	"source.fixAll.eslint": true
},
"editor.formatOnSave": true,
```

**小写驼峰命名 lowerCamelCase**

```js
//变量
'camelcase': [2, {
      'properties': 'always'
}],
```

**vue组件名应该始终是多个单词组成（大于等于 2），且命名规范为 KebabCase 格式。 这样做可以避免跟现有的以及未来的 HTML 元素相冲突，因为所有的 HTML 元素名称都是单个单词的。**

```js
// vue组件名 
"vue/name-property-casing": [2, "kebab-case"],
```



**统一使用单引号(')，不使用双引号(")。这在创建 HTML 字符串非常有好处**

```js
'quotes': [2, 'single', {
  'avoidEscape': true,
  'allowTemplateLiterals': true
}],
```



**下列关键字后必须有大括号（即使代码块的内容只有一行）：if, else, for, while, do, switch, try, catch, finally, with。**

```js
'curly': [2, 'all'],
```

**永远不要直接使用 undefined 进行变量判断；使用 typeof 和字符串'undefined'对变量进行判断。**

```js
'no-undefined':2,
```

**this 的转换命名**

```js
'consistent-this':[2,"self"],
```

**慎用 console.log(尽量多使用断点来调试)**

```js
'no-console': 1,  //这里我设置的warn级别 2是error 
```
