/* --- GO --- */
App.Go = {}

App.Go.gameLost = function(type) {
	$.mobile.changePage('#game_lost_page?type='+type, { transition: "flip", role: "dialog", reverse: false} )
}

App.Go.page = function(pageId) {
	$.mobile.changePage(pageId, { transition: "flip", role: "page", reverse: false} )	
}


App.Nav = {}

App.Nav.init = function() {
	App.Nav.general()
	App.Nav.menu()
	App.Nav.jobPage()
	App.Nav.pubPage()
}

App.Nav.general = function() {
	$(document).on('pageinit', '#game', function() {
		App.Emitter.emit('GameStarted')
	})

	$(document).on('pageshow', "#game", function() {
		App.Engine.startTime()
	})

	$(document).on('pagebeforeshow', '#page_jobs', function() {
		App.Show.jobsList()
	})

	$(document).on('pagebeforeshow', '#page_job', function() {
		App.Show.job($.mobile.pageData.id)
	})

	$(document).on('pagebeforeshow', '#game_lost', function() {
		App.Show.gameLost($.mobile.pageData.type)
	})

}

App.Nav.menu = function() {
	$('body').on('vclick', "[data-app-time='stop']", function (e) {
		e.preventDefault()
		App.Engine.stopTime()
	})

	$('body').on('vclick', "[data-app-link='start_from_scrach']", function (e) {
		e.preventDefault()
		App.Engine.startNewGame()
	})

	$('body').on('vclick', '[data-app-link]', function(e) {
		e.preventDefault()
		var pageId = $(this).attr('data-app-link')
		App.Go.page('#'+pageId)
	})

}

App.Nav.jobPage = function() {
	$('body').on('vclick', '#job_apply_release', function(e) {
		e.preventDefault()
		var id = $(this).attr('data-app-id')
		var job = App.JobManager.getById(id)
		App.PlayerManager.takeOrQuitJob(job)
		history.back()
	})	
}

App.Nav.pubPage = function() {
	$('body').on('vclick', '#pub_drink', function(e) {
		e.preventDefault()
		App.PubManager.buyBeer()
	})
}