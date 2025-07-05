const fs = require('fs');
const path = require('path');

// Définir les extensions de fichiers que vous souhaitez inclure
const FILE_EXTENSIONS = ['.js', '.jsx', '.ts', '.tsx', '.html', '.css', '.py', '.sh', '.conf', '.json'];

// Définir les dossiers à exclure
const EXCLUDED_DIRS = ['node_modules', '.git', 'dist', 'build', 'venv', '.venv', 'env', 'benchmark', '__pycache__', 'profiles', 'crx'];

// Le chemin de départ est le répertoire où la commande est lancée
const START_DIR = process.cwd();

// Le chemin du fichier TXT de sortie sera dans ce même répertoire
const OUTPUT_FILE = path.join(START_DIR, 'all_code_extract.txt');

// Fonction pour vérifier si un dossier doit être exclu
function isExcludedDir(dirName) {
  return EXCLUDED_DIRS.some(excludedDir => excludedDir.toLowerCase() === dirName.toLowerCase());
}

// Fonction pour vérifier si un fichier doit être inclus
function isValidFile(fileName) {
  return FILE_EXTENSIONS.includes(path.extname(fileName));
}

// Fonction récursive pour parcourir les dossiers et collecter les fichiers
function traverseDirectory(dir, fileList = []) {
  let files;
  try {
    files = fs.readdirSync(dir);
  } catch (err) {
    console.error(`Erreur lors de la lecture du dossier ${dir}:`, err);
    return fileList;
  }

  files.forEach((file) => {
    const filePath = path.join(dir, file);
    let stat;
    try {
      stat = fs.statSync(filePath);
    } catch (err) {
      console.error(`Erreur lors de l'obtention des informations de ${filePath}:`, err);
      return;
    }

    if (stat.isDirectory()) {
      if (!isExcludedDir(file)) {
        traverseDirectory(filePath, fileList);
      }
    } else if (stat.isFile()) {
      // On s'assure de ne pas inclure notre propre fichier de sortie
      if (isValidFile(file) && filePath !== OUTPUT_FILE) {
        fileList.push(filePath);
      }
    }
  });

  return fileList;
}

// Fonction récursive pour générer l'arborescence
function generateTree(dir, prefix = '', treeLines = []) {
  let files;
  try {
    files = fs.readdirSync(dir);
  } catch (err) {
    console.error(`Erreur lors de la lecture du dossier ${dir}:`, err);
    return treeLines;
  }

  const entries = files.filter(file => !isExcludedDir(file)).sort();

  entries.forEach((file, index) => {
    const filePath = path.join(dir, file);
    
    // On ignore notre propre fichier de sortie dans l'arborescence
    if(filePath === OUTPUT_FILE) return;

    let stat;
    try {
      stat = fs.statSync(filePath);
    } catch (err) {
      console.error(`Erreur lors de l'obtention des informations de ${filePath}:`, err);
      return;
    }

    const isLast = index === entries.length - 1;
    const pointer = isLast ? '└── ' : '├── ';
    treeLines.push(prefix + pointer + file);

    if (stat.isDirectory()) {
      const newPrefix = prefix + (isLast ? '    ' : '│   ');
      generateTree(filePath, newPrefix, treeLines);
    }
  });

  return treeLines;
}

// Fonction principale pour extraire le code et générer l'arborescence
function extractCodeAndTree() {
  console.log(`Analyse du répertoire : ${START_DIR}`);
  
  const allFiles = traverseDirectory(START_DIR);
  const tree = generateTree(START_DIR);

  let outputData = '';

  // Ajouter l'arborescence au début
  outputData += '===== Arborescence du Projet =====\n\n';
  outputData += path.basename(START_DIR) + '\n'; // Affiche le nom du dossier racine
  outputData += tree.join('\n') + '\n\n';

  // Ajouter le contenu des fichiers
  outputData += '===== Contenu des Fichiers =====\n\n';
  allFiles.forEach((filePath) => {
    const relativePath = path.relative(START_DIR, filePath);
    let fileContent;
    try {
      fileContent = fs.readFileSync(filePath, 'utf8');
    } catch (err) {
      console.error(`Erreur lors de la lecture du fichier ${filePath}:`, err);
      fileContent = '// Erreur de lecture du fichier\n';
    }

    outputData += `\n\n--- START OF FILE ${relativePath} ---\n\n`;
    outputData += fileContent;
    outputData += `\n\n--- END OF FILE ${relativePath} ---\n\n`;
  });

  // Écrire le contenu dans le fichier TXT
  try {
    fs.writeFileSync(OUTPUT_FILE, outputData, 'utf8');
    console.log(`\nExtraction terminée ! Le fichier se trouve ici : ${OUTPUT_FILE}`);
  } catch (err) {
    console.error(`\nErreur lors de l'écriture du fichier de sortie :`, err);
  }
}

// Exécuter la fonction principale
extractCodeAndTree();