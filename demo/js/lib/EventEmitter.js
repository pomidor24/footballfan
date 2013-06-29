
function EventEmitter() {

	this.events = {}

	this.listen = function(eventName, handler) {
		if (!this.events[eventName]) {
			this.events[eventName] = []
		}
		this.events[eventName].push(handler)
	}


	this.off = function(eventName) {
		delete this.events[eventName]
	}

	this.emit = function(eventName, data) {
		var arr = this.events[eventName]
		if (arr) {
			for (var i = 0; i < arr.length; i++) {
				var handler = arr[i]
				handler(data)
			}
		}
	}

}
