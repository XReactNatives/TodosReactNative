const fs = require('fs');
const crypto = require('crypto');
const path = require('path');

const BUILD_TYPE = {
  COMMON: 'common',
  BUSINESS: 'business',
};

const MODULE_IDS_FILE = path.resolve(__dirname, '../../.metro/module_ids.json');

function getModuleKey(modulePath) {
  const projectRoot = path.resolve(__dirname, '../../');
  let relativePath = path.relative(projectRoot, modulePath);
  if (!relativePath || relativePath.startsWith('..')) {
    relativePath = modulePath;
  }
  return crypto.createHash('md5').update(relativePath).digest('hex');
}

function loadModuleIdsMap() {
  if (fs.existsSync(MODULE_IDS_FILE)) {
    try {
      return JSON.parse(fs.readFileSync(MODULE_IDS_FILE, 'utf-8'));
    } catch {
      return {};
    }
  }
  return {};
}

function saveModuleIdsMap(map) {
  const dir = path.dirname(MODULE_IDS_FILE);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, {recursive: true});
  }
  fs.writeFileSync(MODULE_IDS_FILE, JSON.stringify(map, null, 2));
}

function buildCreateModuleIdFactory(buildConfig) {
  let moduleIdsMap = loadModuleIdsMap();
  let nextId = 0;
  for (const key of Object.keys(moduleIdsMap)) {
    const id = moduleIdsMap[key].id;
    if (typeof id === 'number' && id > nextId) {
      nextId = id;
    }
  }

  return function createModuleIdFactory() {
    return function moduleIdFactory(modulePath) {
      const key = getModuleKey(modulePath);
      if (moduleIdsMap[key] == null) {
        nextId += 1;
        moduleIdsMap[key] = {
          id: nextId,
          type: buildConfig.type,
          path: path.relative(path.resolve(__dirname, '../../'), modulePath),
        };
        saveModuleIdsMap(moduleIdsMap);
      }
      return moduleIdsMap[key].id;
    };
  };
}

function buildProcessModuleFilter(buildConfig) {
  const moduleIdsMap = loadModuleIdsMap();

  return function processModuleFilter(module) {
    const modulePath = module.path;
    if (!fs.existsSync(modulePath)) {
      return true;
    }
    if (buildConfig.type === BUILD_TYPE.COMMON) {
      return true;
    }
    if (buildConfig.type === BUILD_TYPE.BUSINESS) {
      const key = getModuleKey(modulePath);
      const stored = moduleIdsMap[key];
      if (stored != null && stored.type === BUILD_TYPE.COMMON) {
        return false;
      }
      return true;
    }
    return true;
  };
}

module.exports = {
  BUILD_TYPE,
  MODULE_IDS_FILE,
  buildCreateModuleIdFactory,
  buildProcessModuleFilter,
};
