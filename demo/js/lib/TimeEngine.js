
function TimeEngine(initialTU, TUMillisec, TUinMins, prevDate, currDate) {

	this.currDate = currDate
	this.prevDate = prevDate
	this.TUCount = initialTU
	this.TUinMins = TUinMins
	this.TUMillisec = TUMillisec


	this.intervalId = null

	this.recurrent = {}
	this.calendar = {} // week
	this.hours = {} // week


	this.registerRecurrent = function(name, timeUnit, handler) {
		this.recurrent[name] = {
			'timeUnit': timeUnit,
			'handler': handler
		}
	}

	this.deregisterRecurrent = function(name) {
		delete this.recurrent[name]
	}

	this.registerCalendar = function(name, calendar, handler) {
		this.calendar[name] = {
			'calendar': calendar,
			'handler': handler
		}
	}

	this.deregisterCalenda = function(name) {
		delete this.calendar[name]
	}

	this.registerHours = function(name, hours, handler) {
		this.hours[name] = {
			'hours': hours,
			'handler': handler
		}		
	}

	this.deregisterHours = function(name) {
		delete this.hours[name]
	}

	this.handleRecurrent = function() {
		for (var name in this.recurrent) {
			var record = this.recurrent[name]

			if (this.TUCount % record.timeUnit == 0) {
				var handler = record.handler
				handler()
			}
		}
	}

	this.handleHours = function() {
		if (this.currDate.minutes() != 0) {
			return
		}

		var currDay = this.currDate.day() || 7
		var currHour = this.currDate.hours()

		for (var name in this.hours) {
			var record = this.hours[name]
			var handler = record.handler
			var dayRec = record.hours[currDay-1]
			if (dayRec.indexOf(currHour) != -1) {
				handler()
			}
		}
	}

	this.handleCalendar = function() {
		var currTimeWeek = (this.currDate.day() || 7) * 10000 + this.currDate.hours() * 100 + this.currDate.minutes()

		for (var name in this.calendar) {
			var record = this.calendar[name]
			var handler = record.handler

			var dates = record.calendar

			var found = false
			for (var i in dates) {
				var timeArray = dates[i]
				var t1 = timeArray[0]
				var t2 = timeArray[1]
				if (currTimeWeek >= t1 && currTimeWeek < t2) {
					found = true
					break
				}
			}

			handler(found)
		}
	}

	this.isStarted = function() {
		return (this.intervalId != null)
	}

	this.startIfNot = function() {
		if (this.intervalId == null) {
			this.start()
		}
	}

	this.start = function() {
		var obj = this

		this.intervalId = setInterval(function() {

			obj.TUCount++
			obj.prevDate = moment(obj.currDate)
			obj.currDate.add('minutes', obj.TUinMins)

			obj.handleRecurrent()
			obj.handleCalendar()
			obj.handleHours()

		}, this.TUMillisec)
	}

	this.stop = function() {
		clearInterval(this.intervalId)
		this.intervalId = null
	}

}