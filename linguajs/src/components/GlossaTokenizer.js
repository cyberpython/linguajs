/*
 * MIT License
 * 
 * Copyright (c) 2025 Georgios Migdos
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE. 
 */

const GlossaTokensProvider = {
  ignoreCase: true,

  defaultToken: 'invalid',

  keywords: ["προγραμμα", "πρόγραμμα", 
             "αρχη", "αρχή", 
             "τελος_προγραμματος", "τέλος_προγράμματος", "τέλος_προγραμματος", "τελος_προγράμματος", 
             "γραψε", "γράψε", 
             "διαβασε", "διάβασε", 
             "σταθερες", "σταθερές", 
             "μεταβλητες", "μεταβλητές",
             "διαδικασια", "διαδικασία",
             "τελος_διαδικασιας", "τέλος_διαδικασίας", "τέλος_διαδικασιας", "τελος_διαδικασίας",
             "συναρτηση", "συνάρτηση",
             "τελος_συναρτησης", "τέλος_συνάρτησης", "τέλος_συναρτησης", "τελος_συνάρτησης",
             "καλεσε", "κάλεσε",
             "αν", "τοτε", "τότε", "αλλιως", "αλλιώς", "αλλιως_αν", "αλλιώς_αν", "τελος_αν", "τέλος_αν",
             "επιλεξε", "επίλεξε", "περιπτωση", "περίπτωση", "τελος_επιλογων", "τέλος_επιλογών", "τέλος_επιλογων", "τελος_επιλογών",
             "οσο", "όσο", "επαναλαβε", "επανάλαβε", "τελος_επαναληψης", "τέλος_επανάληψης", "τέλος_επαναληψης", "τελος_επανάληψης",
             "αρχη_επαναληψης", "αρχή_επανάληψης", "αρχή_επαναληψης", "αρχη_επανάληψης",
             "μεχρις_οτου", "μέχρις_ότου", "μέχρις_οτου", "μεχρις_ότου",
             "για", "απο", "από", "μεχρι", "μέχρι", "με", "βημα", "βήμα", "με_βημα", "με_βήμα",
             "αληθης", "αληθής", "ψευδης", "ψευδής" ],

  typeKeywords: [
    "ακεραια", "ακέραια", "ακεραιες", "ακέραιες",
    "πραγματικη", "πραγματική", "πραγματικες", "πραγματικές",
    "χαρακτηρας", "χαρακτήρας", "χαρακτηρες", "χαρακτήρες",
    "λογικη", "λογική", "λογικες", "λογικές" ],

  operatorKeywords: [ "και", "ή", "οχι", "όχι", "div", "mod" ],
              
  operators: ["+", "-", "*", "<-", "/", "^", ">", "<", "=", ">=", "<=", "<>"],
  
  delimiters: [":", "..", ",", "&"],

  tokenizer: {
    root: [

      [/((και)|(ή)|(όχι)|(οχι)|(div)|(mod))/, { cases: { '@operatorKeywords': 'operator'} }],

      // identifiers and keywords
      [/([a-z_$]|[^\x00-\x7F])([\w$]|[^\x00-\x7F])*/, { cases: { '@typeKeywords': 'keyword',
        '@keywords': 'keyword',
        '@default': 'identifier' } }],

      
      
      // whitespace
      { include: '@whitespace' },

      // delimiters and operators
      [/[()\[\]]/, '@brackets'],
      [/[=><:.,&+\-*\/\^]+/, { cases: { '@operators': 'operator',
                                        '@delimiters': 'delimiter', 
                                        "@default": 'operator'} }],

      // numbers
      [/\d+\.\d+/, 'number.float'],
      [/\d+/, 'number'],

      // strings
      [/"([^"\\]|\\.)*$/, 'string.invalid' ],  // non-teminated string
      [/'([^'\\]|\\.)*$/, 'string.invalid' ],  // non-teminated string
      [/"/,  { token: 'string.quote', bracket: '@open', next: '@string_double' } ],
      [/'/,  { token: 'string.quote', bracket: '@open', next: '@string_single' } ],
    ],

    comment: [
      [/[^!*]+/, 'comment' ],
      [/\/\*/,    'comment', '@push' ],    // nested comment
      ["\\*/",    'comment', '@pop'  ],
      [/[!*]/,   'comment' ]
    ],

    string_double: [
      [/[^\\"]+/,  'string'],
      [/\\./,      'string.escape.invalid'],
      [/"/,        { token: 'string.quote', bracket: '@close', next: '@pop' } ]
    ],

    string_single: [
      [/[^\\']+/,  'string'],
      [/\\./,      'string.escape.invalid'],
      [/'/,        { token: 'string.quote', bracket: '@close', next: '@pop' } ]
    ],

    whitespace: [
      [/[ \t\r\n]+/, 'white'],
      [/\!.*$/,    'comment'],
    ],
  },
};


export default GlossaTokensProvider;