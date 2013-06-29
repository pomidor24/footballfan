
/* --- HTML --- */

App.Html = {}


App.Html.getJobRequirementText = function(req) {
	var res = ''

	if (req.name == 'loyalty') {
		res = App.Skills[req.name].name + ' - ' + req.value + '%'
	} else if (req.name == 'workHours') {
		res = 'Any work experience - ' + req.value + ' hours'
	}

	return res
}

App.Html.getCalendar = function(calendar) {
	var tbl = '<table class="text_small calendar"><tr>'

	var obj = App.JobManager.getMinAndMaxCalendarHours(calendar)

	tbl += '</tr><tr><td class="header">day/hour</td>'

	for (var i = obj.min; i <= obj.max; i++) {
		tbl += '<td class="header">'+i.mod(23)+'</td>'
	}

	tbl += '</tr>'

	for (var d = 0; d < 7; d++) {
		var row = '<tr><td class="header">{0}</td>'.format(App.Cfg.weekDays[d])
		var calRow = calendar[d]
		if (!calRow || calRow.length == 0) {
			continue
		}

		for (var i = obj.min; i <= obj.max; i++) {
			var isSelected = (calRow && calRow.indexOf(i) != -1)
			var td = '<td class="{0}"></td>'
			row += td.format(isSelected ? 'selected' : '')
		}
		row += '</tr>'
		tbl += row
	}
	tbl += '</table>'

	return tbl
}

/* --- PRINT --- */

App.Print = {}

App.Print.date = function() {
	var dateStr = App.Game.currDate.format(App.Cfg.printDateFormat)
	$('#game #curr_date').html(dateStr)
}

App.Print.loyalty = function() {
	$('#game #loyalty').html(Math.round(App.Player.loyalty * 10) / 10)
}

App.Print.respect = function() {
	$('#game #respect').html(App.Player.respect)
}

App.Print.money = function() {
	$('#game #money').html(App.Player.money)
}

App.Print.pubOpen = function() {
	$('#game #go_to_pub').button('enable')
}

App.Print.pubClose = function() {
	$('#game #go_to_pub').button('disable')
}

App.Print.jobExperienceHours = function() {
	$('#game #player_exp_hours').html(App.Player.experienceHours)
}

App.Print.jobExperienceDays = function() {
	$('#game #player_exp_days').html(App.Player.experienceDays)
}

App.Print.jobTitle = function() {
	var str = ''
	if (App.PlayerManager.hasJob()) {
		var job = App.PlayerManager.getCurrentJob()
		str = job.name
	} 
	$('#game #player_job').html(str)	
}

App.Print.job = function() {
	App.Print.jobExperienceHours()
	App.Print.jobExperienceDays()
	App.Print.jobTitle()
}


/* --- SHOW --- */

App.Show = {}

App.Show.readyGame = function() {
	var stepMillisec = 1000

	for (var i in [0,1,2,3]) {
		
		(function(i) {
			setTimeout(function() {
				var id = '#start_' + i
				var role = 'dialog'
				if (i == 3) {
					id = '#game'
					role = 'page'
				}
				$.mobile.changePage(id, { transition: "flip", role: role} )
			}, stepMillisec * i)			
		})(i);

	}
}

App.Show.game = function() {
	App.Print.date()
	App.Print.loyalty()
	App.Print.respect()
	App.Print.money()
	$('#game #money_sign').html(App.Cfg.currencySign)
}

App.Show.gameLost = function(type) {
	var map = {
		'loyalty': 'You became a hater by losing all your loyalty level'
	}

	var txt = map[type] || 'You lost the game!'

	$('#game_lost_page #lost_reason').html(txt)
}

App.Show.job = function(id) {
	var jobRec = App.JobManager.getRecordById(id)
	var job = jobRec.job
	var relation = App.JobManager.getRelation(jobRec)
	var hoursPerWeek = App.JobManager.getHoursPerWeek(job)

	$('#page_job ul [data-app-type="req"]').remove()

	var name = job.name 
	if (relation.isCurr) {
		name += '<img src="vendors/glyphish/icons-gray/258-checkmark@2x.png" class="job_status"/>'
	} else if (!relation.isOpen) {
		name += '<img src="vendors/glyphish/icons-gray/237-key@2x.png" class="job_status"/>'
	}

	var template = '<li class="text_medium" data-app-type="req"><a href="#">{0}</a><a href="#" data-icon="{1}" data-theme="c"></a>'
	var str

	if (job.requirements.length == 0) {
        str = template.format('No special requirements', 'check')
		$(str).insertAfter($('#page_job #header_requirements'))
	} else {
		for (var i = 0; i < job.requirements.length; i++) {
			var req = job.requirements[i]
			str = template.format(
				App.Html.getJobRequirementText(req),
				App.JobManager.isRequirementMet(req) ? 'check' : 'delete'
			)

			$(str).insertAfter($('#page_job #header_requirements'))
		}
	}

	var reqsHeaderStr = 'Requirements'
	if (!relation.areReqsMet) {
		reqsHeaderStr += "<span><img src='vendors/glyphish/icons-gray/184-warning@2x.png' class='job_status'/></span>"
	}

	var buttonText = ''
	var applicationProcessText = ''

	var buttonDataTheme = 'c'
	if (relation.isCurr) {
		buttonText = 'Quit Job'
	} else if (job.applicationHours == 0) {
		buttonText = 'Take it!'
		buttonDataTheme = 'b'
	} else if (job.applicationHours > 0) {
		buttonText = 'Apply'
		buttonDataTheme = 'b'
		applicationProcessText = (job.applicationHours > 24) ? (job.applicationHours / 24 + 'd') : (job.applicationHours + 'h')
		applicationProcessText += ' process time'
	}

	var buttonEnabled = relation.canTake || relation.isCurr

	$('#page_job #job_app_time').html(applicationProcessText)
	$('#page_job #job_title').html(name)
	$('#page_job #job_description').html(job.description)
	$('#page_job #job_rate').html(job.rate+App.Cfg.currencySign+'/h')
	$('#page_job #job_per_week').html(hoursPerWeek+'h/w')
	$('#page_job #job_image').html('<img src="{0}"/>'.format(job.image1))
	$('#page_job #job_calendar').html(App.Html.getCalendar(job.calendar))
	$('#page_job #header_requirements').html(reqsHeaderStr)
	
	$('#page_job #job_apply_release').attr('data-app-id', job.id)
	$('#page_job #job_apply_release').val(buttonText)
	$('#page_job #job_apply_release').button(buttonEnabled ? 'enable' : 'disable')
	$('#page_job #job_apply_release').button({'theme': buttonDataTheme})
	$('#page_job #job_apply_release').button('refresh')

	$('#page_job #job_details').listview('refresh')
}


App.Show.jobsList = function() {
	var str = ''

	var lastOpenIdx
	for (var i = 0; i < App.Jobs.length; i++) {
		var jobRec = App.JobManager.getRecordByIdx(i)
		var job = jobRec.job
		var relation = App.JobManager.getRelation(jobRec)

		var hoursPerWeek = App.JobManager.getHoursPerWeek(job)

		var row = 
			'<li id="{0}" data-theme="{1}" class="{2}" data-icon="arrow-r">'
				+'<a href="#page_job?id={0}" data-transition="slide">'
					+ '<img src="{3}" class="ui-li-icon"/>{4}'
					+ '<img src="{5}" class="job_status"/>'
					+ '<br/><span class="text_medium">{6}</span>'
					+ '<div class="ui-li-aside">{7}/h<br/><span class="text_medium">{8}h/w</span></div>'
				+'</a>'
			+'</li>'

		var img = 'vendors/glyphish/icons-gray/237-key@2x.png' 
		if (relation.canTake) {
			img = 'vendors/glyphish/icons-gray/117-todo@2x.png'
		} else if (relation.isCurr) {
			img = 'vendors/glyphish/icons-white/258-checkmark@2x.png'
		} else if (relation.isOpen && !relation.areReqsMet) {
			img = 'vendors/glyphish/icons-gray/184-warning@2x.png'
		}

		str += row.format(
			job.id, 
			relation.isCurr ? 'b' : 'c', 
			(relation.isOpen || relation.isNext) ? '' : 'ui-disabled blurred',
			relation.isCurr ? job.image2 : job.image1, 
			job.name, 
			img,
			job.description || '', 
			job.rate+App.Cfg.currencySign,
			hoursPerWeek
		)
	}
	$('#page_jobs #job_list').html(str)
	$('#page_jobs #job_list').listview('refresh')
}
