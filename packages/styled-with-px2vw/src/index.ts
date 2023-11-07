// eslint-disable-next-line
//@ts-nocheck
import styled from "styled-components";

const base64Re = /^data:\w+\/[a-zA-Z+\-.]+;base64,/i;

export const createStyledWithPx2vw = (
  targetChars?: string,
  designWidth?: number
) => {
  const TargetChars = targetChars || "pxvw";
  const DesignWidth = designWidth || 1920;

  const pxRe = new RegExp(`-?\\d*[.\\d]*${TargetChars}`, "g");

  const px2vw = (px: string) =>
    Number(px)
      ? `${Math.round((Number(px) / DesignWidth) * 100000 * 100) / 100000}vw`
      : "0";

  const convertStringPx2vw = (style: string) => {
    if (!style) return style;

    if (
      !base64Re.test(style) && // 非base64字符串
      pxRe.test(style) // 包含px单位
    ) {
      return style.replace(pxRe, (value) =>
        px2vw(value.replace(TargetChars, ""))
      );
    }

    return style;
  };

  const convertInterpolationPx2vw = (interpolation) => {
    if (
      Object.prototype.toString.call(interpolation) === "[object Object]" &&
      interpolation.constructor.name.toLowerCase() === "keyframes"
    ) {
      interpolation.rules = interpolation.rules.map(convertStringPx2vw);
      return interpolation;
    } else if (
      Object.prototype.toString.call(interpolation) === "[object Array]"
    ) {
      return convertStringPx2vw(interpolation.join(""));
    } else if (typeof interpolation !== "function") {
      return interpolation;
    }

    return (props) => {
      const result = interpolation(props);

      if (typeof result === "string") {
        return convertStringPx2vw(result);
      }

      if (Array.isArray(result)) {
        return result.map(convertStringPx2vw);
      }
      return result;
    };
  };

  const withTemplateFunc =
    (styled) =>
    (...props) =>
      withCss(styled(...props));

  const withCss = (styled) => {
    const interleave = (strings, ...interpolations) => {
      strings = strings.map(convertStringPx2vw);

      interpolations = interpolations.map(convertInterpolationPx2vw);

      return styled(strings, ...interpolations);
    };

    Object.keys(styled).forEach(
      (prop) => (interleave[prop] = withTemplateFunc(styled[prop]))
    );

    return interleave;
  };

  const obj = withTemplateFunc(styled) as typeof styled;

  Object.keys(styled).forEach((key) => {
    obj[key] = withCss(styled[key]);

    Object.keys(styled[key]).forEach(
      (prop) => (obj[key][prop] = withTemplateFunc(styled[key][prop]))
    );
  });

  return { styledWithPx2vw: obj, px2vw };
};
