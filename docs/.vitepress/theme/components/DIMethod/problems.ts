import type { DIProblem } from './types';

export const problems: DIProblem[] = [
  {
    id: 'x2-ex',
    title: '多项式 × 指数函数 (归零型)',
    latex: '\\int x^2 e^x \\mathrm{d}x',
    parts: { u: 'x^2', dv: 'e^x', trap: 'x' },
    type: 'terminating',
    steps: [
      { sign: '+', derivative: 'x^2', integral: 'e^x' },
      { sign: '-', derivative: '2x', integral: 'e^x' },
      { sign: '+', derivative: '2', integral: 'e^x' },
      { sign: '-', derivative: '0', integral: 'e^x', isTerminator: true }
    ],
    result: 'x^2 e^x - 2x e^x + 2e^x + C'
  },
  {
    id: 'x3-sinx',
    title: '多项式 × 三角函数 (归零型)',
    latex: '\\int x^3 \\sin x \\mathrm{d}x',
    parts: { u: 'x^3', dv: '\\sin x', trap: '3x^2' },
    type: 'terminating',
    steps: [
      { sign: '+', derivative: 'x^3', integral: '\\sin x' },
      { sign: '-', derivative: '3x^2', integral: '-\\cos x' },
      { sign: '+', derivative: '6x', integral: '-\\sin x' },
      { sign: '-', derivative: '6', integral: '\\cos x' },
      { sign: '+', derivative: '0', integral: '\\sin x', isTerminator: true }
    ],
    result: '-x^3 \\cos x + 3x^2 \\sin x + 6x \\cos x - 6 \\sin x + C'
  },
  {
    id: 'ex-sinx',
    title: '指数函数 × 三角函数 (循环型)',
    latex: '\\int e^x \\sin x \\mathrm{d}x',
    parts: { u: '\\sin x', dv: 'e^x', trap: '1' },
    type: 'cyclic',
    steps: [
      { sign: '+', derivative: '\\sin x', integral: 'e^x' },
      { sign: '-', derivative: '\\cos x', integral: 'e^x' },
      { sign: '+', derivative: '-\\sin x', integral: 'e^x' }
    ],
    result: '\\frac{1}{2} e^x (\\sin x - \\cos x) + C'
  }
];
