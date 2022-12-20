// prettier-ignore
const hexColorTable = [
    '#FF0000', '#00FF00', '#00FFFF', '#FFFF00', '#00FFFF', '#FF00FF',
    '#FFEFD5', '#0000CD', '#CD853F', '#D2B48C', '#66CDAA', '#000080',
    '#008B8B', '#2E8B57', '#FFE4E1', '#6A5ACD', '#DDA0DD', '#E9967A',
    '#A52A2A', '#FFFAFA', '#9370DB', '#DA70D6', '#4B0082', '#FFB6C1',
    '#3CB371', '#FFEBCD', '#FFE4C4', '#DAA520', '#008080', '#BC8F8F',
    '#FF69B4', '#FFDAB9', '#DEB887', '#7FFF00', '#8B4513', '#7CFC00',
    '#FFFFE0', '#4682B4', '#006400', '#EE82EE', '#EEE8AA', '#F0FFF0',
    '#F5DEB3', '#B8860B', '#20B2AA', '#FF1493', '#191970', '#708090',
    '#228B22', '#F8F8FF', '#F5FFFA', '#FFA07A', '#90EE90', '#ADFF2F',
    '#4169E1', '#FF6347', '#FAF0E6', '#800000', '#32CD32', '#F4A460',
    '#FFFFF0', '#7B68EE', '#FFA500', '#ADD8E6', '#FFC0CB', '#7FFFD4',
    '#FF8C00', '#8FBC8F', '#DC143C', '#FDF5E6', '#FFFAF0', '#00CED1',
    '#00FF7F', '#800080', '#FFFACD', '#FA8072', '#9400D3', '#B22222',
    '#FF7F50', '#87CEEB', '#6495ED', '#F0E68C', '#FAEBD7', '#FFF5EE',
    '#6B8E23', '#87CEFA', '#00008B', '#8B008B', '#F5F5DC', '#BA55D3',
    '#FFE4B5', '#FFDEAD', '#00BFFF', '#D2691E', '#FFF8DC', '#2F4F4F',
    '#483D8B', '#AFEEEE', '#808000', '#B0E0E6', '#FFF0F5', '#8B0000',
    '#F0FFFF', '#FFD700', '#D8BFD8', '#778899', '#DB7093', '#48D1CC',
    '#FF00FF', '#C71585', '#9ACD32', '#BDB76B', '#F0F8FF', '#E6E6FA',
    '#00FA9A', '#556B2F', '#40E0D0', '#9932CC', '#CD5C5C', '#FAFAD2',
    '#5F9EA0', '#008000', '#FF4500', '#E0FFFF', '#B0C4DE', '#8A2BE2',
    '#1E90FF', '#F08080', '#98FB98', '#A0522D',
  ];

type RGB = [number, number, number];

type RGBA = [number, number, number, number];

const rgbColorTable: RGB[] = hexColorTable.map((hexColor) => [
  parseInt(hexColor.slice(1, 3), 16),
  parseInt(hexColor.slice(3, 5), 16),
  parseInt(hexColor.slice(5, 7), 16),
]);

const getHEXByLabel = (label: number): string => {
  if (label === 0) return '#000000';

  return hexColorTable[(label - 1) % 130];
};
const getRGBByLabel = (label: number): RGBA => {
  if (label === 0) return [0, 0, 0, 0];

  const [r, g, b] = rgbColorTable[(label - 1) % 130];

  return [r, g, b, 255];
};

export { getHEXByLabel, getRGBByLabel };
