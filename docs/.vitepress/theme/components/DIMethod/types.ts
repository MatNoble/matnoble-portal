export interface DIStep {
  sign: '+' | '-';
  derivative: string; // LaTeX
  integral: string;   // LaTeX
  isTerminator?: boolean; // 是否是导数为 0 的行
}

export interface DIProblem {
  id: string;
  title: string;
  latex: string;      // 完整题目 LaTeX
  parts: {
    u: string;        // 初始 u (D列)
    dv: string;       // 初始 dv (I列)
    trap: string;     // 干扰项 (Distractor)
  };
  steps: DIStep[];
  result: string;     // 最终结果 LaTeX
  type: 'terminating' | 'cyclic';
}
