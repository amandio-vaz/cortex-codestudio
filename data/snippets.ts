import { BashSnippet } from '../types';

export const BASH_SNIPPETS: BashSnippet[] = [
  {
    id: 'header',
    nameKey: 'snippet_header_name',
    descriptionKey: 'snippet_header_desc',
    content: `#!/bin/bash

# --- Verificação de Versão do Bash ---
# Garante que o script está sendo executado com Bash 5.0 ou superior.
if [ -z "$BASH_VERSION" ] || [ "\${BASH_VERSINFO[0]}" -lt 5 ]; then
  echo "Erro: Este script requer Bash na versão 5.0 ou superior para ser executado." >&2
  echo "Por favor, execute-o com 'bash' ou atualize sua versão do shell." >&2
  if [ -n "$BASH_VERSION" ]; then
    echo "Versão atual do Bash: $BASH_VERSION" >&2
  fi
  exit 1
fi

set -euo pipefail
IFS=$'\\n\\t'

# --- Validação de Entrada ---
# Adicione aqui a lógica para validar os argumentos de entrada do script.
validate_input() {
  # Exemplo: Verificar se o número correto de argumentos foi passado.
  # if [ "$#" -ne 2 ]; then
  #   echo "Uso: $0 <argumento1> <argumento2>" >&2
  #   exit 1
  # fi

  # Exemplo: Verificar se um argumento não está vazio.
  # if [ -z "$1" ]; then
  #   echo "Erro: O primeiro argumento não pode ser vazio." >&2
  #   exit 1
  # fi

  # Exemplo: Verificar se um argumento é um número.
  # if ! [[ "$2" =~ ^[0-9]+$ ]]; then
  #   echo "Erro: O segundo argumento deve ser um número inteiro." >&2
  #   exit 1
  # fi

  # Exemplo: Verificar se um arquivo existe e é legível.
  # if [ ! -r "$1" ]; then
  #   echo "Erro: O arquivo '$1' não existe ou não pode ser lido." >&2
  #   exit 1
  # fi
  
  # Se todas as validações passarem, o script continua.
  : # No-op, apenas para ter um corpo de função válido.
}

validate_input "$@"

# --- Script Body ---

`,
  },
  {
    id: 'if-else',
    nameKey: 'snippet_if_else_name',
    descriptionKey: 'snippet_if_else_desc',
    content: `if [[ "condition" ]]; then
  # code to run if condition is true
  echo "Condition is true"
else
  # code to run if condition is false
  echo "Condition is false"
fi`,
  },
  {
    id: 'for-loop',
    nameKey: 'snippet_for_loop_name',
    descriptionKey: 'snippet_for_loop_desc',
    content: `for (( i=0; i<10; i++ )); do
  echo "Iteration: $i"
done`,
  },
  {
    id: 'for-in-loop',
    nameKey: 'snippet_for_in_loop_name',
    descriptionKey: 'snippet_for_in_loop_desc',
    content: `items=("item1" "item2" "item3")
for item in "\${items[@]}"; do
  echo "Processing: $item"
done`,
  },
  {
    id: 'while-loop',
    nameKey: 'snippet_while_loop_name',
    descriptionKey: 'snippet_while_loop_desc',
    content: `count=0
while [[ $count -lt 5 ]]; do
  echo "Count: $count"
  ((count++))
done`,
  },
  {
    id: 'function',
    nameKey: 'snippet_function_def_name',
    descriptionKey: 'snippet_function_def_desc',
    content: `my_function() {
  local param1="$1"
  echo "Hello, $param1"
}

my_function "World"`,
  },
  {
    id: 'case',
    nameKey: 'snippet_case_statement_name',
    descriptionKey: 'snippet_case_statement_desc',
    content: `option="$1"
case "$option" in
  start)
    echo "Starting service..."
    ;;
  stop)
    echo "Stopping service..."
    ;;
  restart)
    echo "Restarting service..."
    ;;
  *)
    echo "Usage: $0 {start|stop|restart}"
    exit 1
    ;;
esac`,
  },
  {
    id: 'getopts',
    nameKey: 'snippet_getopts_name',
    descriptionKey: 'snippet_getopts_desc',
    content: `usage() {
  echo "Usage: $0 [-f <filename>] [-v]"
  exit 1
}

verbose=0
filename=""

while getopts ":f:v" opt; do
  case "$opt" in
    f)
      filename="\${OPTARG}"
      ;;
    v)
      verbose=1
      ;;
    \\?)
      usage
      ;;
  esac
done

echo "Filename: $filename"
echo "Verbose: $verbose"`,
  },
];