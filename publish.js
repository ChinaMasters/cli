const fs = require('fs');
const path = require('path');
const process = require('process');
// 导入执行控制台命令的方法
const exec = require('child_process').execSync;
// 保存根路径
const rootPath = __dirname;
const dirnames = fs.readdirSync(__dirname);
const consoleLogPath = path.join(rootPath, 'log');

dirnames.forEach(fName => {
	const dPath = path.join(__dirname, fName);
	const stat = fs.statSync(dPath);
	if (stat.isDirectory()) {
		const modulePath = path.join(dPath, 'node_modules');
		if (!fs.existsSync(modulePath)) return;
		const statModules = fs.statSync(modulePath);
		if (statModules.isDirectory()) {
			const res = fs.readdirSync(modulePath)
			getVersion(res, consoleLogPath, modulePath, fName)
		}
	}
})

function getVersion(result, logPath, modulePath, fName) {
	result.forEach(item => {
		// 拼接当前包路径
		const dPath = path.join(modulePath, item);
		// 获取路径的stat
		const stat = fs.statSync(dPath);
		// 判断该包路径是否为目录
		if (stat.isDirectory()) {
			// 如果是目录，则执行下述操作
			// 当前包目录下的package.json文件路径
			const packageJsonPath = path.join(dPath, 'package.json');
			if (fs.existsSync(packageJsonPath)) {
				// 读取当前包目录下的package.json文件的内容，返回字符串
				const packageJsonContentString = fs.readFileSync(packageJsonPath, 'utf8');
				// 解析package.json文件的内容成json格式的对象
				const parsedPackJson = JSON.parse(packageJsonContentString);
				if (parsedPackJson.scripts && Object.keys(parsedPackJson.scripts).length !== 0) {
					parsedPackJson.scripts = {};
					fs.writeFileSync(packageJsonPath, JSON.stringify(parsedPackJson));
				}
				// 把当前的目录切换到当前包路径下
				process.chdir(dPath);
				// 在包路径下执行cmd控制台命令 npm publish
				try {
					exec('npm publish');
				} catch {
					console.log(`包${fName}:${item}已发布`);
				}
				// 操作执行完成，则把当前路径切换到原来的根目录
				process.chdir(rootPath);
				console.log(fName, parsedPackJson.name, parsedPackJson.version)
				// 记录日志
				fs.appendFileSync(logPath, `${fName} / ${parsedPackJson.name} /@${parsedPackJson.version}\n`);
			}
		}
	})
}
