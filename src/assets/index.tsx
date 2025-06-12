import logo1Src from "./logo1.png";
import logo2Src from "./logo2.png";
import logo3Src from "./logo3.png";

import React from "react";

export const Logo1 = (props: React.ImgHTMLAttributes<HTMLImageElement>) => (
  <img src={logo1Src} alt="Logo 1" {...props} />
);

export const Logo2 = (props: React.ImgHTMLAttributes<HTMLImageElement>) => (
  <img src={logo2Src} alt="Logo 2" {...props} />
);

export const Logo3 = (props: React.ImgHTMLAttributes<HTMLImageElement>) => (
  <img src={logo3Src} alt="Logo 3" {...props} />
);
