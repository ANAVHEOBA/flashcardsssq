export interface LanguageKeywords {
  name: string;
  slug: string;
  keywords: string[];
}

export const languageKeywords: LanguageKeywords[] = [
  {
    name: 'Python',
    slug: 'python',
    keywords: [
      'False', 'None', 'True', 'and', 'as', 'assert', 'async', 'await',
      'break', 'class', 'continue', 'def', 'del', 'elif', 'else', 'except',
      'finally', 'for', 'from', 'global', 'if', 'import', 'in', 'is',
      'lambda', 'nonlocal', 'not', 'or', 'pass', 'raise', 'return', 'try',
      'while', 'with', 'yield'
    ],
  },
  {
    name: 'JavaScript',
    slug: 'javascript',
    keywords: [
      // Always reserved
      'break', 'case', 'catch', 'class', 'const', 'continue', 'debugger', 'default',
      'delete', 'do', 'else', 'export', 'extends', 'false', 'finally', 'for',
      'function', 'if', 'import', 'in', 'instanceof', 'new', 'null', 'return',
      'super', 'switch', 'this', 'throw', 'true', 'try', 'typeof', 'var',
      'void', 'while', 'with',
      // Strict mode & contextual
      'let', 'static', 'yield', 'await', 'enum',
      // Strict mode future reserved
      'implements', 'interface', 'package', 'private', 'protected', 'public',
      // Contextual identifiers
      'as', 'async', 'from', 'get', 'of', 'set'
    ],
  },
  {
    name: 'Java',
    slug: 'java',
    keywords: [
      'abstract', 'assert', 'boolean', 'break', 'byte', 'case', 'catch', 'char',
      'class', 'const', 'continue', 'default', 'do', 'double', 'else', 'enum',
      'extends', 'final', 'finally', 'float', 'for', 'goto', 'if', 'implements',
      'import', 'instanceof', 'int', 'interface', 'long', 'native', 'new', 'package',
      'private', 'protected', 'public', 'return', 'short', 'static', 'strictfp', 'super',
      'switch', 'synchronized', 'this', 'throw', 'throws', 'transient', 'try', 'void',
      'volatile', 'while'
    ],
  },
  {
    name: 'TypeScript',
    slug: 'typescript',
    keywords: [
      // JavaScript keywords
      'break', 'case', 'catch', 'class', 'const', 'continue', 'debugger', 'default',
      'delete', 'do', 'else', 'export', 'extends', 'false', 'finally', 'for',
      'function', 'if', 'import', 'in', 'instanceof', 'new', 'null', 'return',
      'super', 'switch', 'this', 'throw', 'true', 'try', 'typeof', 'var',
      'void', 'while', 'with', 'let', 'static', 'yield', 'await', 'enum',
      'implements', 'interface', 'package', 'private', 'protected', 'public',
      'as', 'async', 'from', 'get', 'of', 'set',
      // TypeScript-specific
      'abstract', 'any', 'boolean', 'declare', 'infer', 'is', 'keyof', 'module',
      'namespace', 'never', 'number', 'object', 'readonly', 'require', 'string',
      'symbol', 'type', 'undefined', 'unique', 'unknown'
    ],
  },
  {
    name: 'C++',
    slug: 'cpp',
    keywords: [
      // Core keywords
      'alignas', 'alignof', 'and', 'and_eq', 'asm', 'auto', 'bitand', 'bitor',
      'bool', 'break', 'case', 'catch', 'char', 'char8_t', 'char16_t', 'char32_t',
      'class', 'compl', 'concept', 'const', 'consteval', 'constexpr', 'constinit',
      'const_cast', 'continue', 'co_await', 'co_return', 'co_yield', 'decltype',
      'default', 'delete', 'do', 'double', 'dynamic_cast', 'else', 'enum', 'explicit',
      'export', 'extern', 'false', 'float', 'for', 'friend', 'goto', 'if',
      'inline', 'int', 'long', 'mutable', 'namespace', 'new', 'noexcept', 'not',
      'not_eq', 'nullptr', 'operator', 'or', 'or_eq', 'private', 'protected', 'public',
      'register', 'reinterpret_cast', 'requires', 'return', 'short', 'signed', 'sizeof',
      'static', 'static_assert', 'static_cast', 'struct', 'switch', 'template', 'this',
      'thread_local', 'throw', 'true', 'try', 'typedef', 'typeid', 'typename', 'union',
      'unsigned', 'using', 'virtual', 'void', 'volatile', 'wchar_t', 'while', 'xor',
      'xor_eq'
    ],
  },
  {
    name: 'Go',
    slug: 'go',
    keywords: [
      'break', 'case', 'chan', 'const', 'continue', 'default', 'defer', 'else',
      'fallthrough', 'for', 'func', 'go', 'goto', 'if', 'import', 'interface',
      'map', 'package', 'range', 'return', 'select', 'struct', 'switch', 'type',
      'var'
    ],
  },
  {
    name: 'Rust',
    slug: 'rust',
    keywords: [
      // Strict keywords (all editions)
      'as', 'break', 'const', 'continue', 'crate', 'else', 'enum', 'extern',
      'false', 'fn', 'for', 'if', 'impl', 'in', 'let', 'loop', 'match',
      'mod', 'move', 'mut', 'pub', 'ref', 'return', 'self', 'Self', 'static',
      'struct', 'super', 'trait', 'true', 'type', 'unsafe', 'use', 'where',
      'while',
      // 2018+ edition
      'async', 'await', 'dyn',
      // Reserved for future use
      'abstract', 'become', 'box', 'do', 'final', 'macro', 'override', 'priv',
      'typeof', 'unsized', 'virtual', 'yield', 'try', 'gen',
      // Weak keywords
      'union', 'raw'
    ],
  },
  {
    name: 'C',
    slug: 'c',
    keywords: [
      // C89/C90 keywords
      'auto', 'break', 'case', 'char', 'const', 'continue', 'default', 'do',
      'double', 'else', 'enum', 'extern', 'float', 'for', 'goto', 'if',
      'int', 'long', 'register', 'return', 'short', 'signed', 'sizeof', 'static',
      'struct', 'switch', 'typedef', 'union', 'unsigned', 'void', 'volatile', 'while',
      // C99 keywords
      'inline', 'restrict', '_Bool', '_Complex', '_Imaginary',
      // C11 keywords
      '_Alignas', '_Alignof', '_Atomic', '_Generic', '_Noreturn', '_Static_assert', '_Thread_local',
      // C23 keywords
      '_BitInt', 'typeof', 'typeof_unqual', '_BitInt', '_Decimal128', '_Decimal32', '_Decimal64',
      'true', 'false', '_Bool', 'alignas', 'alignof', 'bool', 'static_assert', 'thread_local'
    ],
  },
  {
    name: 'Kotlin',
    slug: 'kotlin',
    keywords: [
      // Hard keywords
      'as', 'break', 'class', 'continue', 'do', 'else', 'false', 'for',
      'fun', 'if', 'in', 'interface', 'is', 'null', 'object', 'package',
      'return', 'super', 'this', 'throw', 'true', 'try', 'typealias', 'typeof',
      'val', 'var', 'when', 'while',
      // Soft keywords
      'by', 'catch', 'constructor', 'delegate', 'dynamic', 'field', 'file', 'finally',
      'get', 'import', 'init', 'param', 'property', 'receiver', 'set', 'setparam',
      'value', 'where',
      // Modifier keywords
      'abstract', 'actual', 'annotation', 'companion', 'const', 'crossinline', 'data', 'enum',
      'expect', 'external', 'final', 'infix', 'inline', 'inner', 'internal', 'lateinit',
      'noinline', 'open', 'operator', 'out', 'override', 'private', 'protected', 'public',
      'reified', 'sealed', 'suspend', 'tailrec', 'vararg'
    ],
  },
  {
    name: 'Solidity',
    slug: 'solidity',
    keywords: [
      // Basic data types
      'address', 'bool', 'string', 'bytes', 'int', 'uint', 'fixed', 'ufixed',
      // Contract elements
      'contract', 'interface', 'library', 'struct', 'enum', 'event', 'error', 'constructor', 'function', 'modifier', 'fallback', 'receive',
      // Visibility
      'public', 'private', 'internal', 'external',
      // Function modifiers
      'pure', 'view', 'payable', 'virtual', 'override',
      // State & Variable
      'mapping', 'storage', 'memory', 'calldata', 'constant', 'immutable',
      // Logic & Control
      'if', 'else', 'for', 'while', 'do', 'break', 'continue', 'return', 'returns', 'emit', 'revert', 'require', 'assert', 'try', 'catch',
      // Global variables & symbols
      'msg', 'block', 'tx', 'now', 'this', 'super', 'selfdestruct', 'type',
      // Assembly
      'assembly', 'let'
    ],
  },
];

// Get keywords by language slug
export const getKeywordsBySlug = (slug: string): string[] => {
  const language = languageKeywords.find((lang) => lang.slug === slug);
  return language ? language.keywords : [];
};

// Get all supported languages
export const getSupportedLanguages = (): LanguageKeywords[] => {
  return languageKeywords;
};
