const ColorByAtomType = {
  H: 'rgb(246,246,246)',
  He: 'rgb(217,255,25)',
  Li: 'rgb(204,128,25)',
  Be: 'rgb(194,255,0)',
  B: 'rgb(255,181,181)',
  C: 'rgb(102,102,102)',
  N: 'rgb(12,12,255)',
  O: 'rgb(255,12,12)',
  F: 'rgb(128,179,255)',
  Ne: 'rgb(179,227,24)',
  Na: 'rgb(171,92,243)',
  Mg: 'rgb(138,255,0)',
  Al: 'rgb(191,166,16)',
  Si: 'rgb(128,153,15)',
  P: 'rgb(255,128,0)',
  S: 'rgb(179,179,0)',
  Cl: 'rgb(30,240,30)',
  Ar: 'rgb(128,209,22)',
  K: 'rgb(143,64,212)',
  Ca: 'rgb(61,255,0)',
  Sc: 'rgb(230,230,23)',
  Ti: 'rgb(191,194,19)',
  V: 'rgb(166,166,171)',
  Cr: 'rgb(138,153,19)',
  Mn: 'rgb(156,122,19)',
  Fe: 'rgb(225,102,51)',
  Co: 'rgb(240,143,16)',
  Ni: 'rgb(79,209,79)',
  Cu: 'rgb(199,128,51)',
  Zn: 'rgb(125,128,17)',
  Ga: 'rgb(194,143,14)',
  Ge: 'rgb(102,143,14)',
  As: 'rgb(189,128,22)',
  Se: 'rgb(255,161,0)',
  Br: 'rgb(166,40,40)',
  Kr: 'rgb(92,184,209)',
  Rb: 'rgb(112,46,176)',
  Sr: 'rgb(0,255,0',
  Y: 'rgb(148,255,255)',
  Zr: 'rgb(148,225,22)',
  Nb: 'rgb(115,194,20)',
  Mo: 'rgb(84,181,181)',
  Tc: 'rgb(58,158,158)',
  Ru: 'rgb(35,143,143)',
  Rh: 'rgb(10,125,140)',
  Pd: 'rgb(0,104,133)',
  Ag: 'rgb(225,225,22)',
  Cd: 'rgb(255,217,14)',
  In: 'rgb(166,117,11)',
  Sn: 'rgb(102,128,12)',
  Sb: 'rgb(158,99,181)',
  Te: 'rgb(212,122,0)',
  I: 'rgb(148,0,148)',
  Xe: 'rgb(66,158,176)',
  Cs: 'rgb(87,23,143)',
  Ba: 'rgb(0,202,0)',
  La: 'rgb(122,212,25)',
  Ce: 'rgb(255,255,19)',
  Pr: 'rgb(217,255,19)',
  Nd: 'rgb(199,255,19)',
  Pm: 'rgb(163,255,19)',
  Sm: 'rgb(143,255,19)',
  Eu: 'rgb(97,255,199)',
  Gd: 'rgb(69,255,199)',
  Tb: 'rgb(48,255,199)',
  Dy: 'rgb(30,255,199)',
  Ho: 'rgb(0,255,156)',
  Er: 'rgb(0,230,117)',
  Tm: 'rgb(0,212,81)',
  Yb: 'rgb(0,191,56)',
  Lu: 'rgb(0,171,35)',
  Hf: 'rgb(76,194,255)',
  Ta: 'rgb(76,166,255)',
  W: 'rgb(33,148,215)',
  Re: 'rgb(38,125,171)',
  Os: 'rgb(38,102,151)',
  Ir: 'rgb(23,84,135)',
  Pt: 'rgb(245,238,20)',
  Au: 'rgb(204,209,30)',
  Hg: 'rgb(181,181,19)',
  Tl: 'rgb(166,84,76)',
  Pb: 'rgb(87,89,97)',
  Bi: 'rgb(158,79,181)',
  Po: 'rgb(171,92,0)',
  At: 'rgb(117,79,69)',
  Rn: 'rgb(66,130,151)',
  Fr: 'rgb(66,0,102)',
  Ra: 'rgb(0,125,0',
  Ac: 'rgb(112,171,25)',
  Th: 'rgb(0,186,255)',
  Pa: 'rgb(0,161,255)',
  U: 'rgb(0,143,255)',
  Np: 'rgb(0,128,255)',
  Pu: 'rgb(0,107,255)',
  Am: 'rgb(84,92,243)',
  Cm: 'rgb(120,92,227)',
  Bk: 'rgb(138,79,227)',
  Cf: 'rgb(161,53,212)',
  Es: 'rgb(179,30,212)',
  Fm: 'rgb(179,30,186)',
  Md: 'rgb(179,12,166)',
  No: 'rgb(189,12,135)',
  Lr: 'rgb(199,0,102)',
  Rf: 'rgb(204,0,89)',
  Db: 'rgb(209,0,79)',
  Sg: 'rgb(217,0,69)',
  Bh: 'rgb(225,0,56)',
  Hs: 'rgb(230,0,46)',
  Mt: 'rgb(235,0,38)',
  Ds: 'rgb(238,0,35)',
  Rg: 'rgb(240,0,33)',
  Cn: 'rgb(243,0,30)',
  Nh: 'rgb(245,0,28)',
  Fl: 'rgb(253,0,20)',
  Mc: 'rgb(250,0,23)',
  Lv: 'rgb(253,0,20)',
  Ts: 'rgb(253,0,20)',
  Og: 'rgb(253,0,20)',
};

export type AtomType = keyof typeof ColorByAtomType;

export const getAtomColor = (type: AtomType) => {
  return ColorByAtomType[type] || '#ffffff';
};
