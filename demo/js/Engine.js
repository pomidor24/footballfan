App.Engine = {}


/*
	start new game
*/
App.Engine.startNewGame = function() {
	App.Engine.initNewGame()
	App.Workflow.init()
	App.Show.readyGame()
}

/*
	initalize from scratch
*/
App.Engine.initNewGame = function() {

	App.Player = {
		'moneyAll': 0,
		'money': App.Cfg.playerMoney,
		'loyalty': App.Cfg.playerLoyalty,
		'respect': 0,
		'jobId': null,
		'experienceHours': 0,
		'experienceDays': 0,
		'experienceDaysAddedAt': null
	}

	App.Game = {
		'TUCount': 0,
		'isLive': true,
		'isPubOpen': false,
		'currDate' : moment(App.Cfg.startDate),
		'prevDate' : null,
		'lastOpenJobIdx': 0,
	}

	if (App.TimeEngine) {  // na vsiakij sluchaj
		App.TimeEngine.stop()
	}

	App.TimeEngine = new TimeEngine(
		0, App.Cfg.TUinMillisec, 
		App.Cfg.TUEqualsMins, App.Game.prevDate, App.Game.currDate
	)

	App.Emitter = new EventEmitter()

	App.Show.game()
}


App.Engine.startTime = function() {
	if (App.GameManager.isLive()) {
		App.TimeEngine.startIfNot()
	}
}

App.Engine.stopTime = function() {
	App.TimeEngine.stop()
}


