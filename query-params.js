function getQueryParams() {
  const urlSearchParams = new URLSearchParams(window.location.search);
  return Object.fromEntries(urlSearchParams.entries());
}

// use
const { lang = 'de' } = getQueryParams() 
