export const getUniqueSelector = (element: Element) => {
  if (element.id) return `#${element.id}`;
  const path = [];
  while (element.parentNode && element.tagName.toLowerCase() !== 'body') {
    let selector = element.tagName.toLowerCase();
    if (element.className) {
      selector += '.' + element.className.split(/\s+/).join('.');
    }
    const siblings = Array.from(element.parentNode.children);
    const sameTagSiblings = siblings.filter((e) => e.tagName === element.tagName);
    if (sameTagSiblings.length > 1) {
      const index = sameTagSiblings.indexOf(element) + 1;
      selector += `:nth-of-type(${index})`;
    }
    path.unshift(selector);
    element = element.parentNode as Element;
  }
  return path.join(' > ');
};
