const torrentApi = 'http://localhost:8080';

chrome.webRequest.onHeadersReceived.addListener(details => {
	const {url, method, responseHeaders} = details;
	if (method !== 'GET') return;

	const getHeader = (responseHeaders, headerName) => responseHeaders.find(header => header.name === headerName);

	const checkHeader = (responseHeaders, headerVals) => {
		const header = getHeader(responseHeaders, headerVals[0]);
		if (header === undefined) return false;
		if (headerVals.length === 1) return header;
		if (headerVals.length === 2) return header.value === headerVals[1];
		return false;
	};

	const isTorrent = responseHeaders => checkHeader(responseHeaders, ['Content-Type', 'application/x-bittorrent']);
	const isApi = responseHeaders => url.startsWith(torrentApi) && checkHeader(responseHeaders, ['magnetURI']);

	if (isTorrent(responseHeaders)) {
		console.log(details);
		return {redirectUrl: `${torrentApi}/${url}`};
	}

	if (isApi(responseHeaders)) {
		console.log(getHeader(responseHeaders, 'magnetURI'));
		return {redirectUrl: getHeader(responseHeaders, 'magnetURI').value};
	}
},
{urls: ['<all_urls>']},
['blocking', 'responseHeaders']);
