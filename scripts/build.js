#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

/**
 * 递归复制目录
 */
function copyDir(src, dest) {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }

  const entries = fs.readdirSync(src, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

/**
 * 复制文件
 */
function copyFile(src, dest) {
  const destDir = path.dirname(dest);
  if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true });
  }
  fs.copyFileSync(src, dest);
}

/**
 * 主构建函数
 */
function build() {
  console.log('开始构建 Angular Schematics...');

  // 1. 清理构建目录
  console.log('清理构建目录...');
  if (fs.existsSync('build')) {
    fs.rmSync('build', { recursive: true, force: true });
  }

  // 2. 编译 TypeScript
  console.log('编译 TypeScript...');
  try {
    execSync('tsc -p tsconfig.json', { stdio: 'inherit' });
  } catch (error) {
    console.error('TypeScript 编译失败');
    process.exit(1);
  }

  // 3. 复制并修复 collection.json
  console.log('复制并修复 collection.json...');
  const collectionContent = fs.readFileSync('src/collection.json', 'utf-8');
  const collection = JSON.parse(collectionContent);
  
  // 修复 schema 路径
  collection.$schema = "@angular-devkit/schematics/collection-schema.json";
  
  fs.writeFileSync('build/collection.json', JSON.stringify(collection, null, 2));

  // 4. 复制所有 schema.json 文件
  console.log('复制 schema.json 文件...');
  const srcDir = 'src';
  const buildDir = 'build';

  function findAndCopySchemas(dir, relativePath = '') {
    const fullPath = path.join(srcDir, relativePath);
    const entries = fs.readdirSync(fullPath, { withFileTypes: true });

    for (const entry of entries) {
      if (entry.isDirectory()) {
        findAndCopySchemas(dir, path.join(relativePath, entry.name));
      } else if (entry.name === 'schema.json') {
        const srcPath = path.join(fullPath, entry.name);
        const destPath = path.join(buildDir, relativePath, entry.name);
        console.log(`  复制: ${srcPath} -> ${destPath}`);
        copyFile(srcPath, destPath);
      }
    }
  }

  findAndCopySchemas(srcDir);

  // 5. 复制所有 files 目录
  console.log('复制 files 目录...');
  function findAndCopyFiles(dir, relativePath = '') {
    const fullPath = path.join(srcDir, relativePath);
    const entries = fs.readdirSync(fullPath, { withFileTypes: true });

    for (const entry of entries) {
      if (entry.isDirectory()) {
        if (entry.name === 'files') {
          const srcPath = path.join(fullPath, entry.name);
          const destPath = path.join(buildDir, relativePath, entry.name);
          console.log(`  复制目录: ${srcPath} -> ${destPath}`);
          copyDir(srcPath, destPath);
        } else {
          findAndCopyFiles(dir, path.join(relativePath, entry.name));
        }
      }
    }
  }

  findAndCopyFiles(srcDir);

  // 6. 创建 package.json 文件（用于标识这是一个 schematics 集合）
  console.log('创建构建目录的 package.json...');
  const originalPackage = JSON.parse(fs.readFileSync('package.json', 'utf-8'));
  const buildPackage = {
    name: originalPackage.name,
    version: originalPackage.version,
    description: originalPackage.description,
    schematics: './collection.json',
    dependencies: {
      '@angular-devkit/core': originalPackage.dependencies['@angular-devkit/core'],
      '@angular-devkit/schematics': originalPackage.dependencies['@angular-devkit/schematics']
    }
  };

  fs.writeFileSync(
    'build/package.json', 
    JSON.stringify(buildPackage, null, 2)
  );

  console.log('构建完成！');
  console.log('构建输出位于: build/');
  
  // 7. 显示构建结果
  console.log('\n构建内容:');
  function listBuildContents(dir, prefix = '') {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      console.log(`${prefix}${entry.isDirectory() ? '📁' : '📄'} ${entry.name}`);
      if (entry.isDirectory()) {
        listBuildContents(path.join(dir, entry.name), prefix + '  ');
      }
    }
  }
  
  listBuildContents('build');
}

if (require.main === module) {
  build();
}

module.exports = { build };