export type Language =
  | 'markup'
  | 'bash'
  | 'clike'
  | 'c'
  | 'cpp'
  | 'css'
  | 'javascript'
  | 'jsx'
  | 'coffeescript'
  | 'actionscript'
  | 'css-extr'
  | 'diff'
  | 'git'
  | 'go'
  | 'graphql'
  | 'handlebars'
  | 'json'
  | 'less'
  | 'makefile'
  | 'markdown'
  | 'objectivec'
  | 'ocaml'
  | 'python'
  | 'reason'
  | 'sass'
  | 'scss'
  | 'sql'
  | 'stylus'
  | 'tsx'
  | 'typescript'
  | 'wasm'
  | 'yaml';

const fileExtensionRegex = [
  { lang: 'bash', regex: /\.sh$/i },
  { lang: 'c', regex: /\.cpp$|\.c$/i },
  { lang: 'cpp', regex: /\.cpp$|\.cc$/i },
  { lang: 'css', regex: /\.css$/i },
  { lang: 'javascript', regex: /\.js$/i },
  { lang: 'jsx', regex: /\.jsx$/i },
  { lang: 'coffeescript', regex: /\.coffee$/i },
  { lang: 'coffeescript', regex: /\.as$/i },
  { lang: 'diff', regex: /\.diff$/i },
  { lang: 'go', regex: /\.go$/i },
  { lang: 'graphql', regex: /\.graphql$/i },
  { lang: 'handlebars', regex: /\.hbs$/i },
  { lang: 'json', regex: /\.json$|.babelrc$/i },
  { lang: 'less', regex: /\.less$/i },
  { lang: 'markdown', regex: /\.md$/i },
  { lang: 'ocaml', regex: /\.ml$|.mli/i },
  { lang: 'python', regex: /\.py$/i },
  { lang: 'reason', regex: /\.re$/i },
  { lang: 'sass', regex: /\.sass$/i },
  { lang: 'scss', regex: /\.scss$/i },
  { lang: 'sql', regex: /\.sql|.mysql|.pgsql$/i },
  { lang: 'typescript', regex: /\.ts$/i },
  { lang: 'typescript', regex: /\.tsx$/i },
  { lang: 'wasm', regex: /\.wasm$/i },
  { lang: 'yaml', regex: /\.yaml$|.yml$/i },
];

const isSupportedLanguage = (language?: string): language is Language => {
  if (!language) return false;
  return language.includes(language);
};

export const getLanguage = (filename: string): Language | undefined => {
  const language = fileExtensionRegex.find((ext) =>
    ext.regex.test(filename),
  )?.lang;
  if (isSupportedLanguage(language)) {
    return language;
  }
};
