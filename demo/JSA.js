/*
	JavaScript 同步加载类机制.
	Write By Wld, 1511569466@qq.com
	MIT Licensed.
	
	JSA , Base Framework
	1. 加载所有 JS --> PublicClassTable
	2. 运行 mainEntry --> new Application() And Run First Activity

	Test On Chrome , IE 7/8/9

	*类路径名为小写 -- 文件夹名字为小写
	*类名为大写开头 -- JS文件名为大写开头
	*如一个path: org.app.Activity, 则加载相对于index.html下的org/app/Activity.js.
	*相对路径修改使用Root(path);

	----------------------------------------------------------
	Class('name').Import( 'string' | ['name1','name2']).Import('string').Extends('father')
		.Implements('interface' | ['interface','interface']).Prop(function(){
			//当使用Class('jsa.app.Activity')的时候
			//会调用该匿名函数构造出一个Object返回.
			
			*私有函数区

			return {
				*属性区
				*公用函数区
				init : function(){
					*构造函数
				},
				//析构函数
				destroy:function(){
				
				}
			};
		});
		
	Tip:
		1.构造出来的类, 可以使用this.top(), 来调用父类中同名函数^_^
		2.init()作为默认的构造函数, 用来构造对象中的Object类型属性, 详情请查看rootObject构造文档.
		3.支持默认setAttr(),getAttr() [字母开头的属性]
		4.不要使用Class初始化一个静态变量(new Class() 除外), 可能造成嵌套初始化, 并且不能访问到Class中任何属性, 不同于Java.
		
	------------------------------------------------------------
	Interface('name').Prop({
		
		
	});
	Tip:
		如果一个类implements接口, 则默认提供一个空函数.
	------------------------------------------------------------

	//获取指定的类的构造函数 *该类已经加载到系统中
	Class('org.app.Activity');
	
	------------------------------------------------------------

	//类似于Instanceof
	Boolean  : Object.Instanceof(type);
	Usage: (new (Class('org.app.Activity'))).Instanceof('org.app.Activity'); //true
	Tip:
		动态类识别, 支持接口.
		
	//修改原型变量
	object.Prototype('name',value);
	Tip:
		用于修改静态变量的有力工具.
*/

(function(global){
	
	/*
		概念解析:
			Coffee : 一个Class类的状态对象, Class对象由Coffee构造出来
			Class  : 构造函数.
		基本流程:
			1. 加载所有Coffee文件到系统中
			2. 运行mainEntry.
			3. 当调用Class('jsa.app.Activity')函数获得Class对象的时候, 使用Coffee构建一个Class.
	*/
	//基本属性
	var
		loadedCoffeeCache = {}, //(Coffee)已加载到系统中的状态缓存 ^-^
		handleCoffeeQueue = [],//Coffee已经加载,当时还没有处理它,处理时机在process中(JS加载完)
		loadingCoffeeCache = {},//正在被加载的记录表
		
		classCache = {}, //类缓存
		interfaceCache = {}, //接口缓存

		mainEntry =  noop, //预置空入口.
		noop =  function(){},//空函数
		rootPath = './', //相对index.html路径
		classNameRe = /^[A-Za-z][A-Za-z\.]*[A-Za-z]*$/, //检测name是否符合规范 org.app.Activity
		doc = global.document,
		head = doc && (doc['head'] || doc.getElementsByTagName('head')[0]);
	
	//基本工具函数
	var isArray = function(obj){
		return Object.prototype.toString.call(obj) == "[object Array]" ;
	};
	
	var setRoot = function(path){
		rootPath = path;
	};

	var loadScript = function(className,process){
		
		var script = doc.createElement('script');
		var path = className.replace(/\./g, '/');
		path = rootPath + path + '.js';
		
		var done = false;
		script.onload = script.onreadystatechange = function() {
			if(!done && (!this.readyState  || this.readyState == 'loaded' || this.readyState == 'complete')) {
				done = true;   
				if(typeof process == 'function')
					process();
			}
		};
		
		script.src = path;
		//In IE 如果JS在Cache中会马上执行
		head.appendChild(script);
	};
	var isEmptyObject = function(obj) {
		for (var name in obj) {
			return false;
		}
		return true;
	};
	var checkName = function(name) {
		return classNameRe.test(name);
	};
	var checkStrList = function(array) {
		for (var i = 0; i < array.length; ++i) {
			if (typeof array[i] != 'string' && !checkName(array[i]))
				return false;
		}
		return true;
	};
	//系统处于加载Coffee阶段测试
	var isLoadingCoffeeState = function(){
		return !isEmptyObject(loadingCoffeeCache) || ! (handleCoffeeQueue.length == 0);
	
	};
	var writeIntoModules = function(array,obj){
		for(var i = 0 ; i < array.length ; ++i){
			obj[array[i]] = true;
		}
	};
	/* Simple JavaScript Inheritance
	* By John Resig http://ejohn.org/
	* By Wulongdong
	* MIT Licensed.
	*/
	//Inspired by base2 and Prototype
	/*
	be careful, the init Function is "Construct" In Class
	you can use top() in SubClass.function to Call the FatherClass's same name Function, Like Java keyword "super"
	Usage :  Class.extend(prop,interface,...)
				prop, interface type is "Object"
			In prop, you can't initializing(be careful) which's attr type is "Object"!!
			(在prop中, 如果创建Object引用类型的属性, 则这个属性会作为静态变量)
			Beacause, if one SubObject change the type is "object" attribute , will be affect other SubObject.
			(他会影响子对象和该对象)
			So,in prop, The type is "Object" attribute Like is Static Attribute in Java.
			You can initlizing type is "Object" attr in init() function.
			(在init()构造函数中,初始化该对象中的Object类型属性);
			
	Tip:
		1. 不要把Object类型的属性, 在prop中设置, 要在init()中进行初始化.
		2. 如果在prop中配置了Object类型的属性, 则会作为静态变量影响这个类和他的子类
		3. 可以在函数中使用top() 调用父类中同名函数.
		4. 最好不要在类中配置属性或者函数名字为top();
		5. 支持默认setAttr(), getAttr()函数支持, 免去手写set,get. 当然也可以自定义.(只支持字母开头的属性)
		6. 不要占用 _meta 这个名字, 它描述了该类的继承关系.
		7. 支持修改原型中的变量. instance.Prototype('name',value) | Class.Prototype('name',value);
		8. 动态识别类型instance.Instanceof('jsa.app.Activity');

	API :
		Object.extend('name',prop,{ 
				interfacename1 : InterfaceObject1,
				interfacename2 : InterfaceObject2
		});
		'name'       : 类名, 必须
		prop         : 类的属性, 必须
		{ interfacename : InterfaceObject} : 接口名字和接口
	*/
	//基本类
	var baseObject = (function(global) {
		var 
		initializing = false, 
		fnTest = /\btop\b/,
		//字母开头的属性测试
		attrTest = /^[a-z].*/i;
		
		var Object = noop;
		//避免BUG
		Object.prototype['top'] = noop;
		Object.prototype['init'] = noop;

		//元信息
		Object.prototype['_meta'] = {
			father: null,
			interfaces: null,
			className: 'Object',
			prop:{}
		};
		var Instanceof =  function(name) {
			var helper = function(_meta) {
				if (_meta == null)
					return false;
				if (_meta.className === name)
					return true;
				for (var i = 0; !!_meta.interfaces && i < _meta.interfaces.length; ++i) {
					if (_meta.interfaces[i] === name)
						return true;
				}
				return helper(_meta.father);
			};
			return helper(this._meta || this.prototype._meta);
		};
		//类似于instanceof操作符
		Object.prototype['Instanceof'] = Instanceof;
		/*
			修改或者查询"最近"原型中的属性
			查询到基础属性 _meta,
			Class.Prototype
			instance.Prototype
		*/
		var Prototype = function(name,value){
			if(name == undefined || typeof name != 'string' || /\s/.test(name))
				return null;
			//获得"最近"拥有该属性的原型类名
			var helper = function(_meta) {
				if (_meta == null)
					return null;
				if (name in _meta.prop)
					return _meta.className;
				return helper(_meta.father);
			};
			//this可能是一个实例, 也可能是一个类
			var classname =  helper(this._meta || this.prototype._meta);
			if(classname){
				//测试value是否有效
				if(arguments.length > 1){
					return Class(classname).prototype[name] = value;
				}
				return Class(classname).prototype[name];
			}
			return null;
		};
		Object.prototype['Prototype'] = Prototype;
		// Create a new Class that inherits from this class
		Object.extend = function(className, prop) {
			var superClass = this.prototype;

			// Instantiate a base class (but only create the instance,
			// don't run the init constructor)
			initializing = true;
			var prototype = new this();
			initializing = false;
			prototype['_meta'] = {
				father: this.prototype['_meta'],
				interfaces: null,
				className: className,
				prop:prop
			};

			// implements Interface
			if (arguments.length == 3 && typeof arguments[2] == 'object' && !isEmptyObject(arguments[2])) {
				//create interface array in _meta
				prototype['_meta']['interfaces'] = [];
				//arguments[2] = InterfaceObjects
				var interfaces = arguments[2];
				for (var interfacename in interfaces) {
					if (Util.type(interfaces[interfacename]) != 'object')
						throw 'Interface Type error!';
					//add to _meta
					prototype['_meta']['interfaces'].push(interfacename);
					for (var funName in interfaces[interfacename]) {
						prototype[funName] = function() {
						//do-none
						//you should implement the function
						}
					}
				}
			};
			
			//防止prop为null, undefined
			if (!!prop) {
				// Copy the properties over onto the new prototype
				for (var name in prop) {
					//setting gettting Support
					if(typeof prop[name] != 'function' && attrTest.test(name)){
						//如果不是函数,则添加setXXX, getXXX支持
						//如果prop中存在setXXX, getXXX则会被覆盖
						//不支持对__attr__的属性, 因为这些被认为是私有属性
						var setName = 'set'+name.charAt(0).toUpperCase()+ name.substr(1);
						var getName = 'get'+name.charAt(0).toUpperCase()+ name.substr(1);
						//如果原型或者prop中存在set,get该属性的方法, 则不进行设置
						if(!prototype[setName] && !prop[setName]){
							prototype[setName] =  (function(name){
								return function(){
									return this[name] = arguments[0];
								};
							})(name);
						}
						if(!prototype[getName] && !prop[getName]){
							prototype[getName] = (function(name){
								return function(){
									return this[name];
								};
							})(name);
						}
						
					};
					// Check if we're overwriting an existing function
					prototype[name] = 
						typeof prop[name] == "function" && typeof superClass[name] == "function" && fnTest.test(prop[name]) ? 
						(function(name, fn) {
							//rewrite original Function, add this._super() function to it
							//in the end, delete the this._super() function;
							return function() {
								var tmp = this.top;

								// Add a new ._super() method that is the same method
								// but on the super-class
								this.top = superClass[name];

								// The method only need to be bound temporarily, so we
								// remove it when we're done executing
								var ret = fn.apply(this, arguments);
								this.top = tmp;
								
								return ret;
							};
						})(name, prop[name]) : prop[name];
				}
			}
			// The dummy class constructor
			var Class = function () {
				// All construction is actually done in the init method
				if (!initializing && this.init && typeof this.init == 'function')
					this.init.apply(this, arguments);
			}
			//添加原型参数修改支持.
			Class.Prototype = Prototype;
			//添加对Class类型动态识别支持.
			Class.Instanceof = Instanceof;
			// Populate our constructed prototype object
			Class.prototype = prototype;

			// Enforce the constructor to be what we expect
			Class.prototype.constructor = Class;

			// And make this class extendable
			Class.extend = arguments.callee;
			
			return Class;
		};
		return Object;
	})();
	//Object, 所有类都继承于它.
	classCache['Object'] = baseObject;
	
	
	
	//关于加载阶段的所有方法
	var Mock = (function() {
		//每次加载完任何Coffee的时候, 都执行该函数
		var process = function(e){
			var coffee = null;
			while(coffee = handleCoffeeQueue.shift()){

				for(var name in coffee.modules){
					var flag  = (!loadedCoffeeCache[name] && !loadingCoffeeCache[name]);
					//测试是否已经加载或者正在加载
					if(flag){
						//添加正在加载标记
						loadingCoffeeCache[name] = true;
						//IE中, 加载完JavaScript会马上执行!
						loadScript(name,process);
					}
				}
			}
			if(!isLoadingCoffeeState()){
				//系统处于加载完毕状态,进入预定义main
				mainEntry();
				//main入口只能进入依次, 防止IE BUG
				mainEntry = noop;
			}
		};
		//以下是构造器Class的方法
		var Import = function(args) {
			var coffee = this.coffee;
			if (typeof args == 'undefined') {
				//no-do
			} else if (typeof args == 'string' && checkName(args)) {
				//string
				writeIntoModules([args],coffee.modules);
			} else if (isArray(args) && checkStrList(args)) {
				writeIntoModules(args, coffee.modules);
			} else
				throw 'Import args is error';
			return this;
		};
		var Extends = function(name) {
			var coffee = this.coffee;
			if (typeof name == 'undefined') {
			//
			} else if (typeof name == 'string' && checkName(name)) {
				coffee.fClass = name;
				writeIntoModules([name],coffee.modules);
			} else
				throw 'Extends args is error';
			delete this['Extends'];
			return this;
		};
		var Implements = function(args) {
			var coffee = this.coffee;
			if (typeof args == 'undefined') {
			//
			} else if (typeof args == 'string' && checkName(args)) {
				//string
				coffee.ifs = [args];
				writeIntoModules(coffee.ifs,coffee.modules);
			} else if (isArray(args) && checkStrList(args)) {
				coffee.ifs = args;
				writeIntoModules(coffee.ifs,coffee.modules);
			} else
				throw 'Implements args is error';
			delete this['Implements'];
			return this;
		};
		var Prop = function(obj) {
			var coffee = this.coffee;
			if (typeof obj == 'undefined') {
				//
			} else if ((typeof obj == 'function' && coffee.type == 'class') 
				|| (typeof obj == 'object' && coffee.type == 'interface') ){
				coffee.prop = obj;
			} else
				throw 'Prop args is error';
			delete this['Prop'];
			return this;
		};
		/*
			Coffee = {
				name      : 'string',    //类名
				fClass    : 'string' | 'Object'(class默认参数),    //父类
				ifs       : [],          //接口
				prop      : function(类) | {}(接口),           //类的自定义属性
				
				//状态[uninitialied, initializing, initialized]
				state     : 0 ,1,2, 
				modules   : {class:true} , //要导入的类(imports, fClass, interfaces)
				type      : 'interface'|'class' //类型
			}
	
		*/
		//如果运行createCoffee的话, 则表示name指定的coffee已经加载到系统中
		//但是没有处理该Coffee的导入Coffee
		var createCoffee = function(name, type) {
		
			if(!!loadedCoffeeCache[name])
				throw 'Duplic Name In CoffeeCache:' + name;
			var coffee = {
				name      : name,
				fClass    : 'Object',
				ifs       : [],      
				prop      : type == 'class' ? noop : {},
				state     : 0 ,
				modules   : [] , 
				type      : type 
			};
			
			//添加到cache中
			loadedCoffeeCache[name] = coffee;
			//删除该Coffee正在加载状态
			delete loadingCoffeeCache[name];
			//添加要处理的导入Coffee
			handleCoffeeQueue.push(coffee);
			
			return coffee;
		};
		//Class构造器
		var Class = function(name) {
			if (!checkName(name))
				throw 'error class name:' + name;
			var coffee = createCoffee(name,'class');
			//构建解析对象
			var Class = {};
			Class.coffee = coffee; //添加状态
			Class.Import = Import; //解析imports参数
			Class.Extends = Extends; //解析继承父类参数
			Class.Implements = Implements; //解析接口参数
			Class.Prop = Prop; //解析属性参数
			return Class;
		};
		//Interface构造器
		var Interface = function(name) {
			if (!checkName(name))
				throw 'error Interface name:' + name;
			var coffee = createCoffee(name,'class');
			
			//构建解析对象
			var Interface = {};
			Interface.coffee = coffee; //添加状态
			Interface.Prop = Prop; //解析属性参数
			return Interface;
		};
		//两个构造函数
		return {
			Class: Class,
			Interface: Interface,
			process :process
		}
	})();
	
	//执行阶段方法
	var Executor =( function(global){
		
		
		//初始化一个系统中未被初始化的类
		var initializeClass = function(name) {
			
			//证明系统还处于加载阶段
			if(isLoadingCoffeeState()){
				return false;
			}
			//开始初始化
			var coffee = loadedCoffeeCache[name];
			if(!coffee || coffee.type != 'class')
				throw 'coffee type is error Or no the Coffee :'+ name;
			//可能会造成循环嵌套初初始化BUG, 最好设置为 != 0.
			//when , it call Coffee.Prop() To Create A Typeof Object' Prop
			if(coffee.state != 0)
				throw 'The Coffee is  initialized :'+name;
			coffee.state =  1;
			//获得父类, 如果没有则初始化
			var fClass = classCache[coffee.fClass] || initializeClass(coffee.fClass);
			if (fClass == null)
				throw 'FatherClass don"t Import';
			//获得接口
			var interfaces = {};
			for (var i = 0; i < coffee.ifs.length; ++i) {
				var name = coffee.ifs[i];
				var ifobj = interfaceCache[name] ;
				if(!!ifobj){
					var ifCoffee =  loadedCoffeeCache[name];
					//不存在于interfaceCache中, 则在CoffeeCache中
					if(!ifCoffee)
						throw "Don't Load The Interface: " + name ;
					if(ifCoffee.type == 'class')
						throw 'The Interface is Class' + name;
					ifobj = ifCoffee.prop;
					interfaceCache[name] = ifObj;
				}
				interfaces[name] = ifobj;
			}
			//运行Class定义时候的Function
			var prop = coffee.prop.apply(global);
			var cls = fClass.extend(coffee.name, prop, interfaces);
			//状态修改
			coffee.state = 2;
			//注册到cache中
			classCache[name] = cls;
			return cls;
		};
		return {
			initializeClass:  initializeClass
		};
	})(global);
	
	
	
	
	/*
		构造器
		1. 查询classCache是否存在
		2. 查询loadedCoffeeCache是否存在对象, 如果有, 则构造解析Coffee的对象
		3. 返回基本构造器构造器
	*/
	var Class = function(name){
		return classCache[name] || Executor.initializeClass(name) || Mock.Class(name);
	};
	
	var Interface = function(){
		return Mock.Interface(name);
	};
	
	//外部接口
	global['Class'] = Class;
	global['Interface'] = Interface;
	global['Root'] = setRoot;
	
	/////////////////////////////////////////////运行配置///////////////////////////////////////////
	/**
		1. 加载预定义类 和 启动类(jsa.os.Launch)
		2. 全部加载完毕, 调用mainEntry
	*/
	//加载预定义类
	( loadingCoffeeCache['JSA'] = true )&&  (Class('JSA').Import(['PublicClassTable','jsa.os.Launch'])) &&  (Mock.process());

	//mainEntry 构建
	mainEntry = function(){
		//自动运行Launch中的闭包函数
		//new (Class('jsa.os.Launch'))();
		new (Class('jsa.os.Launch'))();

	};

})(window);