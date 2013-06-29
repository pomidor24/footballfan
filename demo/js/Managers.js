

/* --- JOB MANAGER --- */

App.JobManager = {}

App.JobManager.getRecordByIdx = function(idx) {
	return {idx: idx, job: App.Jobs[idx]}
}

App.JobManager.getRecordById = function(id) {
	for (var i = 0; i < App.Jobs.length; i++) {
		var job = App.Jobs[i]
		if (job.id == id) {
			return {idx: i, job: job}
		}
	}
	return null
}

App.JobManager.getById = function(id) {
	var rec = App.JobManager.getRecordById(id)
	return rec.job
}

App.JobManager.getMinAndMaxCalendarHours = function(calendar) {
	var min = 100
	var max = -1
	for (var i = 0; i < calendar.length; i++) {
		var day = calendar[i]
		for (var j = 0; j < day.length; j++) {
			var hour = day[j]
			min = Math.min(min, hour)
			max = Math.max(max, hour)
		}
	}

	return {min: min, max: max}
}

App.JobManager.isRequirementMet = function(req) {
	var res = false
	if (req.name == 'loyalty') {
		res = (App.Player.loyalty >= req.value)
	} else if (req.name == 'workHours') {
		res = (App.Player.workHours >= req.value)
	}

	return res
}

App.JobManager.getHoursPerWeek = function(job) {
	var hoursPerWeek = 0
	for (var j = 0; j < job.calendar.length; j++) {
		var day = job.calendar[j]
		for (var k = 0; k < day.length; k++) {
			hoursPerWeek++
		}
	}
	return hoursPerWeek
}

App.JobManager.getRelation = function(jr) {
	var res = {
		'areReqsMet': false,
		'isCurr': false,
		'isOpen': false,
		'isLastOpen': false,
		'isNext': false,
		'canTake': false
	}

	var job = jr.job
	var reqs = job.requirements

	var areReqsMet = true
	for (var i = 0; i < reqs.length; i++) {
		if (!App.JobManager.isRequirementMet(reqs[i])) {
			areReqsMet = false
			break
		}
	}

	res.areReqsMet = areReqsMet
	res.isCurr = (App.Player.jobId == job.id)
	res.isOpen = (jr.idx <= App.Game.lastOpenJobIdx)
	res.isLastOpen = (jr.idx == App.Game.lastOpenJobIdx)
	res.isNext = (jr.idx == App.Game.lastOpenJobIdx+1)
	res.canTake = res.isOpen && !res.isCurr && res.areReqsMet

	return res
}

/* --- PLAYER MANAGER --- */

App.PlayerManager = {}

App.PlayerManager.hasJob = function() {
	return App.Player.jobId != null
}

App.PlayerManager.hasThisJob = function(id) {
	return App.Player.jobId == id
}

App.PlayerManager.getCurrentJob = function() {
	if (!App.Player.jobId) {
		return null
	}

	var job = App.JobManager.getById(App.Player.jobId)
	return job
}

App.PlayerManager.takeJob = function(job) {
	App.Player.jobId = job.id
	App.Emitter.emit('JobTaken', {job: job})
}

App.PlayerManager.quitJob = function(job) {
	App.Player.jobId = null
	App.Emitter.emit('JobQuitted', {job: job})
}

App.PlayerManager.takeOrQuitJob = function(job) {
	if (App.PlayerManager.hasJob()) {
		if (App.PlayerManager.hasThisJob(job.id)) {
			App.PlayerManager.quitJob(job) 
		} else {
			App.PlayerManager.takeJob(job)
		}
	} else {
		App.PlayerManager.takeJob(job)
	}

}


App.PlayerManager.incLoyalty = function(val) {
	App.Player.loyalty += val
	if (App.Player.loyalty < 0) {
		App.Player.loyalty = 0
	} else if (App.Player.loyalty >= 100) {
		App.Player.loyalty = 100
	}
	App.Emitter.emit('LoyaltyChanged')
}

App.PlayerManager.decLoyaltyPerHour = function() {
	App.PlayerManager.incLoyalty(-App.Cfg.loyaltyStep)
}

App.PlayerManager.incAllMoneyEarned = function(val) {
	App.Player.moneyAll += val
}

App.PlayerManager.incMoney = function(val) {
	App.Player.money += val
	App.Emitter.emit('MoneyChanged')
}

App.PlayerManager.incExperienceDays = function(val) {
	App.Player.experienceDays++
	App.Player.experienceDaysAddedAt = moment(App.Game.currDate)
	App.Emitter.emit('ExperienceDaysChanged')
}

App.PlayerManager.incExperienceHours = function(val) {
	App.Player.experienceHours += val
	App.Emitter.emit('ExperienceHoursChanged')
}


App.PlayerManager.addMoneyAndExperiencePerHour = function() {
	var job = App.PlayerManager.getCurrentJob()
	if (!job) {
		return
	}

	App.PlayerManager.incMoney(job.rate)
	App.PlayerManager.incAllMoneyEarned(job.rate)
	App.PlayerManager.incExperienceHours(1)

	if (!App.Player.experienceDaysAddedAt || 
		!App.Utils.sameDay(App.Player.experienceDaysAddedAt, App.Game.currDate)) {
		App.PlayerManager.incExperienceDays(1)
	}
}

App.PlayerManager.useItem = function(item) {
	if (item.price) {
		App.PlayerManager.incMoney(-1 * item.price)
	}

	if (item.loyalty) {
		App.PlayerManager.incLoyalty(item.loyalty)
	}
}


/* --- PUB MANAGER --- */

App.PubManager = {}

App.PubManager.isOpen = function() {
	return App.Game.isPubOpen
}

App.PubManager.open = function() {
	App.Game.isPubOpen = true
	App.Emitter.emit('PubOpened')
}

App.PubManager.close = function() {
	App.Game.isPubOpen = false
	App.Emitter.emit('PubClosed')
}

App.PubManager.buyBeer = function() {
	App.PlayerManager.useItem(App.Pub.items.beer)
}

/* --- GAME MANAGER --- */
App.GameManager = {}

App.GameManager.isLive = function() {
	return App.Game.isLive
}

App.GameManager.checkIfLost = function() {
	var lost = null
	
	if (App.Player.loyalty <= 0) {
		lost = 'loyalty'
	}

	if (lost) {
		App.Game.isLive = false
		App.Engine.stopTime()
		App.Emitter.emit('GameLost', {'type': lost})
	}
}

