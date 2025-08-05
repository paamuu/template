#!/usr/bin/env node

const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

/**
 * 运行 Angular Schematics 的 Node.js 脚本
 * 
 * 使用方法:
 * node scripts/run-schematic.js <schematic-name> [options]
 * 
 * 示例:
 * node scripts/run-schematic.js my-schematic
 * node scripts/run-schematic.js my-full-schematic --name=test --index=5
 * node scripts/run-schematic.js my-full-schematic --name=test --index=5 --dry-run
 */

function main() {
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    console.error('错误: 请提供 schematic 名称');
    console.log('使用方法: node scripts/run-schematic.js <schematic-name> [options]');
    console.log('');
    console.log('可用的 schematics:');
    console.log('  - my-schematic');
    console.log('  - my-full-schematic');
    console.log('  - my-other-schematic');
    console.log('  - my-extend-schematic');
    console.log('');
    console.log('示例:');
    console.log('  node scripts/run-schematic.js my-schematic');
    console.log('  node scripts/run-schematic.js my-full-schematic --name=test --index=5');
    console.log('  node scripts/run-schematic.js my-full-schematic --name=test --index=5 --dry-run');
    process.exit(1);
  }

  const schematicName = args[0];
  const options = args.slice(1).join(' ');

  try {
    // 确保项目已构建
    console.log('正在构建项目...');
    execSync('npm run build', { stdio: 'inherit' });

    // 创建输出目录（如果不存在）
    const outputDir = path.join(process.cwd(), 'output');
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    // 构建 schematics 命令 - 使用绝对路径
    const buildPath = path.join(process.cwd(), 'build');
    const command = `npx schematics ${buildPath}:${schematicName} ${options}`;
    
    console.log(`正在执行: ${command}`);
    console.log('输出目录:', outputDir);
    console.log('集合路径:', buildPath);
    console.log('---');

    // 在输出目录中执行 schematic
    execSync(command, { 
      stdio: 'inherit',
      cwd: outputDir
    });

    console.log('---');
    console.log('Schematic 执行完成!');
    console.log('生成的文件位于:', outputDir);

  } catch (error) {
    console.error('执行 schematic 时出错:', error.message);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = { main };