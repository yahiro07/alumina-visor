#!/usr/bin/env node
'use strict';

/* eslint-disable */

const path = require('path');
const chokidar = require('chokidar');
const { build, cliopts, glob } = require('estrella');
const fs = require('fs-extra');
const servor = require('servor');

// console.log('visor 0756');

const [opts] = cliopts.parse(
  ['serve', 'serve component catalog'],
  ['build', 'build component catalog'],
);
// const reqStart = opts['serve'];
// const reqBuild = opts['build'];
const reqStart = process.argv.includes('serve');
const reqBuild = process.argv.includes('build');

function readVisorConfig() {
  const configFilePath = '.visorrc.json';
  if (fs.existsSync(configFilePath)) {
    const obj = fs.readFileSync(configFilePath, { encoding: 'utf-8' });
    return JSON.parse(obj);
  }
}
const visorConfigObject = readVisorConfig();

// type IVisorEntry = {
//   filePath: string;
//   importPath: string;
//   importVariableName: string;
//   componentPath: string;
// };

const configs = {
  visorSrcDir: path.join(__dirname, 'src'),
  srcDir: `.visor/src`,
  distDir: `.visor/dist`,
  componentsRootDir: visorConfigObject?.sourceFolder || '.',
  htmlTemplateFilePath: visorConfigObject?.customHtmlTemplate,
  port: visorConfigObject?.port || 3000,
};

function enumerateVisorVisualEntries() {
  // console.log('enumerate visor files');
  const { srcDir, componentsRootDir } = configs;
  const visorFilePaths = glob(`${componentsRootDir}/**/*.visor.tsx`);
  // console.log({ visorFilePaths });

  const visorEntries = visorFilePaths.map((filePath) => ({
    filePath,
    importPath: path.join('../../', filePath.replace(/.tsx$/, '')),
    importVariableName: filePath
      .replace(`${componentsRootDir}/`, '')
      .replace(/.visor.tsx$/, '')
      .replace(/\//g, '_'),
    componentPath: filePath
      .replace(`${componentsRootDir}/`, '')
      .replace(/.visor.tsx$/, ''),
  }));

  const importLines = visorEntries.map(
    (ve) => `import ${ve.importVariableName} from '${ve.importPath}';`,
  );
  const exportLines = [
    `export default {`,
    ...visorEntries.map(
      (ve) => `  '${ve.componentPath}': ${ve.importVariableName},`,
    ),
    `}`,
  ];
  const codeText = [...importLines, '', ...exportLines].join('\r\n');

  const codeFilePath = `${srcDir}/visorEnumeratedEntries.ts`;
  fs.writeFileSync(codeFilePath, codeText);
}

function watchVisorFilesAddRemoves() {
  const { componentsRootDir } = configs;
  chokidar
    .watch(`${componentsRootDir}/**/*.visor.tsx`, {
      ignoreInitial: true,
      persistent: true,
    })
    .on('add', enumerateVisorVisualEntries)
    .on('unlink', enumerateVisorVisualEntries);
}

function watchVisorSourceCode() {
  const { visorSrcDir, srcDir } = configs;

  const copyFileToWorkDir = (fpath) => {
    const relPath = path.relative(visorSrcDir, fpath);
    const dstPath = path.join(srcDir, relPath);
    fs.copyFileSync(fpath, dstPath);
  };

  const removeFileFromWorkDir = (fpath) => {
    const relPath = path.relative(visorSrcDir, fpath);
    const dstPath = path.join(srcDir, relPath);
    fs.unlink(dstPath);
  };

  chokidar
    .watch(`${visorSrcDir}/**/*.{ts,tsx}`, {
      ignoreInitial: true,
      persistent: true,
    })
    .on('add', copyFileToWorkDir)
    .on('change', copyFileToWorkDir)
    .on('unlink', removeFileFromWorkDir);
}

function launchDebugServer(distDir) {
  servor({
    root: distDir,
    fallback: 'index.html',
    reload: true,
    browse: true,
    port: configs.port,
  });
  console.log(`server listening on http://localhost:${configs.port}`);
}

function buildCore(isRelease) {
  const { visorSrcDir, srcDir, distDir, htmlTemplateFilePath } = configs;
  fs.copySync(visorSrcDir, srcDir);
  fs.mkdirSync(distDir, { recursive: true });
  if (htmlTemplateFilePath) {
    const htmlSourceContent = fs.readFileSync(htmlTemplateFilePath, {
      encoding: 'utf-8',
    });
    const htmlModContent = htmlSourceContent.replace(
      '</body>',
      `<script src="./index.js"></script></body>`,
    );
    fs.writeFileSync(`${distDir}/index.html`, htmlModContent);
  } else {
    fs.copyFileSync(`${srcDir}/index.html`, `${distDir}/index.html`);
  }

  enumerateVisorVisualEntries();

  const opts = !isRelease
    ? {
        bundle: true,
        minify: false,
        watch: true,
        clear: false,
        tslint: false,
        sourcemap: true,
        sourcesContent: true,
      }
    : {
        bundle: true,
        minify: true,
        watch: false,
        clear: false,
        tslint: false,
        sourcemap: false,
        sourcesContent: false,
      };

  build({
    entry: `${srcDir}/index.tsx`,
    outfile: `${distDir}/index.js`,
    define: {
      'process.env.NODE_ENV': `"${process.env.NODE_ENV}"`,
    },
    ...opts,
  });

  if (!isRelease) {
    launchDebugServer(distDir);
    watchVisorFilesAddRemoves();
    watchVisorSourceCode();
  }
}

function entry() {
  if (reqStart) {
    buildCore(false);
  }
  if (reqBuild) {
    buildCore(true);
  }
}

entry();
