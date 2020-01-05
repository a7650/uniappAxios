import {
	deepMerge,
	extend
} from '@/common/request/utils.js'
import Request from '@/common/request/core/request.js'
import defaults from '@/common/request/defaults.js'
import CancelToken from '@/common/request/core/cancelToken.js'

function createInstance(config) {
	const context = new Request(config)
	const instance = Request.prototype.request.bind(context)
	extend(instance, context)
	return instance
}

const request = createInstance(defaults)

request.create = function(config) {
	return createInstance(deepMerge(defaults, config))
}

request.CancelToken = CancelToken

export default request
