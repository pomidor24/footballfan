App.Workflow = {}


App.Workflow.init = function() {

	App.TimeEngine.registerRecurrent('RecurrentTime', App.Cfg.printDateTU, function() {
		App.Print.date()
		App.Game.TUCount = App.TimeEngine.TUCount
		App.Game.currDate = App.TimeEngine.currDate
		App.Game.prevDate = App.TimeEngine.prevDate
	})	
	
	App.TimeEngine.registerRecurrent('RecurrentLoyalty', App.Cfg.loyaltyStepTU, function() {
		App.PlayerManager.decLoyaltyPerHour()
		App.GameManager.checkIfLost()
	})

	App.TimeEngine.registerCalendar('CalendarPub', App.Pub.calendarInterval, function(shouldBeOpen) {
		if (App.PubManager.isOpen()) {
			if (!shouldBeOpen) {
				App.PubManager.close()
			}
		} else {
			if (shouldBeOpen) {
				App.PubManager.open()
			}
		}
	})
	

	App.Emitter.listen('GameStarted', function(data) {
		if (App.Game.isPubOpen) {
			App.PubManager.open()
		} else {
			App.PubManager.close()
		}
	})

	App.Emitter.listen('GameLost', function(data) {
		App.Engine.stopTime()
		App.Go.gameLost(data.type)
	})

	App.Emitter.listen('PubOpened', function() {
		App.Print.pubOpen()
	})

	App.Emitter.listen('PubClosed', function() {
		App.Print.pubClose()
	})

	App.Emitter.listen('LoyaltyChanged', function() {
		App.Print.loyalty()
	})

	App.Emitter.listen('MoneyChanged', function() {
		App.Print.money()
	})

	App.Emitter.listen('ExperienceDaysChanged', function() {
		App.Print.job()
	})

	App.Emitter.listen('ExperienceHoursChanged', function() {
		App.Print.job()
	})

	App.Emitter.listen('JobTaken', function(data) {
		App.TimeEngine.deregisterHours('HoursJob')
		App.TimeEngine.registerHours('HoursJob', data.job.calendar, function() {
			App.PlayerManager.addMoneyAndExperiencePerHour()
		})
		App.Print.job()
	})

	App.Emitter.listen('JobQuitted', function(data) {
		App.TimeEngine.deregisterHours('HoursJob')
		App.Print.job()
	})
}

