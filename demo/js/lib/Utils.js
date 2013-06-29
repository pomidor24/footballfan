
App.Utils = {}

App.Utils.sameDay = function(moment1, moment2) {
	var today = ''+moment1.year()+''+moment1.month()+''+moment1.day()
	var notToday = ''+moment2.year()+''+moment2.month()+''+moment2.day()

	return (today == notToday)
}