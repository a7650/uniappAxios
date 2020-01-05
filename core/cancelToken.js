export default class CancelToken {
	constructor(executor) {
		let resolvePromise = null
		this.promise = new Promise(resolve => {
			resolvePromise = resolve
		})
		executor(message => {
			if (this.reason) return
			this.reason = message || 'canceled'
			resolvePromise(this.reason)
		})
	}
}
