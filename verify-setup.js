const fs = require('fs');
const path = require('path');

console.log('\n🔍 Verificando configuración de Ofertonazos...\n');

let errors = 0;
let warnings = 0;

// Check .env.local
console.log('📋 Verificando variables de entorno...');
const envPath = path.join(__dirname, '.env.local');
if (!fs.existsSync(envPath)) {
  console.log('❌ Archivo .env.local no encontrado');
  errors++;
} else {
  const envContent = fs.readFileSync(envPath, 'utf8');
  
  if (!envContent.includes('NEXT_PUBLIC_SUPABASE_URL=')) {
    console.log('❌ NEXT_PUBLIC_SUPABASE_URL no configurada');
    errors++;
  } else if (envContent.includes('your_supabase_url_here')) {
    console.log('⚠️  NEXT_PUBLIC_SUPABASE_URL no tiene un valor real');
    warnings++;
  } else {
    console.log('✅ NEXT_PUBLIC_SUPABASE_URL configurada');
  }
  
  if (!envContent.includes('NEXT_PUBLIC_SUPABASE_ANON_KEY=')) {
    console.log('❌ NEXT_PUBLIC_SUPABASE_ANON_KEY no configurada');
    errors++;
  } else if (envContent.includes('your_supabase_anon_key_here')) {
    console.log('⚠️  NEXT_PUBLIC_SUPABASE_ANON_KEY no tiene un valor real');
    warnings++;
  } else {
    console.log('✅ NEXT_PUBLIC_SUPABASE_ANON_KEY configurada');
  }
}

// Check package.json dependencies
console.log('\n📦 Verificando dependencias...');
const packageJsonPath = path.join(__dirname, 'package.json');
if (!fs.existsSync(packageJsonPath)) {
  console.log('❌ package.json no encontrado');
  errors++;
} else {
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  
  const requiredDeps = [
    '@supabase/supabase-js',
    '@supabase/ssr',
    'next',
    'react',
    'react-dom'
  ];
  
  requiredDeps.forEach(dep => {
    if (packageJson.dependencies[dep]) {
      console.log(`✅ ${dep} instalado`);
    } else {
      console.log(`❌ ${dep} no encontrado`);
      errors++;
    }
  });
}

// Check node_modules
console.log('\n📁 Verificando instalación...');
const nodeModulesPath = path.join(__dirname, 'node_modules');
if (!fs.existsSync(nodeModulesPath)) {
  console.log('❌ node_modules no encontrado. Ejecuta: npm install');
  errors++;
} else {
  console.log('✅ node_modules encontrado');
}

// Check structure
console.log('\n🏗️  Verificando estructura del proyecto...');
const requiredPaths = [
  'app',
  'components',
  'hooks',
  'lib',
  'types',
  'utils',
  'middleware.ts'
];

requiredPaths.forEach(p => {
  const fullPath = path.join(__dirname, p);
  if (fs.existsSync(fullPath)) {
    console.log(`✅ ${p} existe`);
  } else {
    console.log(`❌ ${p} no encontrado`);
    errors++;
  }
});

// Check SQL files
console.log('\n🗄️  Verificando archivos SQL...');
const sqlFiles = ['supabase-schema.sql', 'supabase-queries.sql'];
sqlFiles.forEach(file => {
  const filePath = path.join(__dirname, file);
  if (fs.existsSync(filePath)) {
    console.log(`✅ ${file} encontrado`);
  } else {
    console.log(`⚠️  ${file} no encontrado`);
    warnings++;
  }
});

// Summary
console.log('\n' + '='.repeat(50));
console.log('📊 RESUMEN');
console.log('='.repeat(50));

if (errors === 0 && warnings === 0) {
  console.log('✅ Todo está perfecto! Puedes ejecutar: npm run dev');
  process.exit(0);
} else if (errors === 0) {
  console.log(`⚠️  ${warnings} advertencia(s) encontrada(s)`);
  console.log('\n🔄 Acciones sugeridas:');
  console.log('1. Configura las variables de entorno en .env.local');
  console.log('2. Sigue la guía: SETUP_RAPIDO.md');
  process.exit(0);
} else {
  console.log(`❌ ${errors} error(es) encontrado(s)`);
  console.log(`⚠️  ${warnings} advertencia(s) encontrada(s)`);
  console.log('\n🔧 Acciones requeridas:');
  if (!fs.existsSync(nodeModulesPath)) {
    console.log('1. Ejecuta: npm install');
  }
  console.log('2. Verifica que todos los archivos estén presentes');
  console.log('3. Configura .env.local con tus credenciales de Supabase');
  console.log('\n📖 Consulta: SETUP_RAPIDO.md para más ayuda');
  process.exit(1);
}
