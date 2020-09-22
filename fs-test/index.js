const fs = require('fs')
const path = require('path')
const fileNames = fs.readdirSync(__dirname)
// 导入执行控制台命令的方法
const exec = require('child_process').execSync;
/**
 * 1： 通过fs修改file目录底下的package.json内容
 * 2： 执行package.json中的 script内容
 */
fileNames.forEach(file => { 
  const fPath = path.resolve(__dirname, file)
  const stat = fs.statSync(fPath)
  if(stat.isDirectory()){
    const dirs = fs.readdirSync(fPath)
    dirs.forEach(item => {
      const cPath = path.join(fPath, item, 'package.json')
      if(fs.existsSync(cPath)){
        fs.readFile(cPath, function (err, data) {
          let json = JSON.parse(data)
          json.description = "creatd by masters"
          // 2 代表格式化缩进2位数
          fs.writeFileSync(cPath, JSON.stringify(json, null, 2))
          // 把当前的目录切换到当前文件路径下
          process.chdir(path.join(fPath, item));
          // 在包路径下执行cmd控制台命令 npm publish
          try {
            //exec(json.scripts.dev); 
            // 或者 
            exec('npm run dev')
          } catch {
            console.log(`文件执行：${item} 报错`);
          }
          // 操作执行完成，则把当前路径切换到原来的根目录
				  process.chdir(process.cwd());
        });
      }
    })
  }
})
