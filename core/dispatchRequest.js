import {
	flattenHeaders
} from '@/common/request/utils.js'

export default function dispatchRequest(config) {
	procressConfig(config)
	return uniRequest(config).then(res => {
		return transformResponse(res, config)
	})
}

function procressConfig(config) {
	config.url = transformURL(config.baseURL, config.url)
	config.headers = transformHeaders(config)
	config.method = (config.method || 'GET').toUpperCase()
}

function transformURL(baseURL = '', url) {
	return baseURL + url
}

function transformHeaders(config) {
	let headers = flattenHeaders(config.headers, config.method)
	if (config.auth) {
		let authType = typeof config.auth
		let authStr = ''
		if (authType === 'string') {
			authStr = config.auth
		} else if (authType === 'function') {
			authStr = config.auth()
		}
		if (authStr && typeof authStr === 'string') {
			headers['Authorization'] = authStr
		}
	}
	return headers
}

function transformResponse(res, config) {
	res.config = config
	return res
}

function uniRequest(config) {
	return new Promise((resolve, reject) => {
		let {
			url,
			method,
			data,
			timeout,
			headers:header,
			dataType = 'json',
			responseType = 'text',
			cancelToken
		} = config
		let requestTask = uni.request({
			url,
			method,
			data,
			header,
			timeout,
			dataType,
			responseType,
			success: res => resolve(res),
			fail: err => reject(err),
			complete: () => {}
		});
		if (cancelToken) {
			cancelToken.promise.then(reason => {
				reject(reason)
				requestTask.abort()
			})
		}
	})
}
