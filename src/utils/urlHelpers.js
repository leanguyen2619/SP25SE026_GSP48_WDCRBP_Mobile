export const extractRealImageUrl = (url) => {
    try {
      const urlObj = new URL(url);
      const realUrl = urlObj.searchParams.get('url');
      if (realUrl && realUrl.startsWith('http')) {
        return decodeURIComponent(realUrl);
      }
    } catch (e) {
      // Invalid URL or doesn't have "url" param
    }
    return url;
  };
  