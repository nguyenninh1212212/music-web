import axios from "axios";

export const getImageClass = (index: number, count: number) => {
  let classNames = "absolute object-cover";

  if (count === 1) {
    classNames += " w-full h-full top-0 left-0";
  } else if (count === 2) {
    classNames += ` w-1/2 h-full top-0 ${index === 0 ? "left-0" : "right-0"}`;
  } else if (count === 3) {
    if (index === 0) {
      classNames += " w-1/2 h-full top-0 left-0";
    } else if (index === 1) {
      classNames += " w-1/2 h-1/2 top-0 right-0";
    } else {
      classNames += " w-1/2 h-1/2 bottom-0 right-0";
    }
  } else {
    if (index === 0) {
      classNames += " w-1/2 h-1/2 top-0 left-0";
    } else if (index === 1) {
      classNames += " w-1/2 h-1/2 top-0 right-0";
    } else if (index === 2) {
      classNames += " w-1/2 h-1/2 bottom-0 left-0";
    } else {
      classNames += " w-1/2 h-1/2 bottom-0 right-0";
    }
  }
  return classNames;
};
export const formatDate = (isoString: string) => {
  const date = new Date(isoString);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
};

export const ipfsToHttp = (url: string) => {
  if (!url) return "";
  return url.replace("ipfs//:", "https://ipfs.io/ipfs/");
};
