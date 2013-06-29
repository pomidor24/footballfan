
App.Cfg = {
	'playerMoney': 100,
	'playerLoyalty': 100,
	'TUEqualsMins': 15, 			// dolzhno delitetelem 60! 2 3 5 6 10 15 20 30
	'TUinMillisec':  250,
	'printDateTU': 1, 
	'printDateFormat': 'dddd, MMMM Do YYYY, HH:mm',
	'currencySign': '£',
	'loyaltyStep': 0.3,
	'loyaltyStepTU': 4, 
	'startDate': [2013, 5, 3, 12],
	'pubOpensAt': 10,
	'pubClosesAt': 4,
	'jobRateTU': 4, // 1 chas
	'weekDays': ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
}

App.Cfg.TUsinHour = Math.floor(60 / App.Cfg.TUEqualsMins)

App.Pub = {
	'calendarInterval': [
		[11000, 20100], [21000, 20300], [31000, 40300], [41000, 50400], [51000, 60500], [60900, 70600], [71100, 72200]
	],
	'items': {
		'beer': {
			'name': 'Beer',
			'price': 3,
			'loyalty': 2
		}
	}
}

App.Skills = {
	'loyalty': {
		'name': 'Loyalty'
	}
}

App.Jobs = [
	{
		'id': 'flyer_distributor', 
		'name': 'Flyer distributor',
		'description': 'Distribute club warehouse, museum and footbal flyers on the streets', 
		'rate': 5,
		'image1': 'vendors/glyphish/icons-gray/256-box2@2x.png',
		'image2': 'vendors/glyphish/icons-white/256-box2@2x.png',
		'calendar': [
			[10, 11, 14, 15],
			[14, 15, 16],
			[10, 11, 14, 15],
			[14, 15, 16],
			[10, 11, 14, 15],
			[10, 11],
			[]
		],
		'applicationHours': 0,
		'requirements': [
			{'name': 'loyalty', 'value': 75}
		]
	},
	{
		'id': 'museum_worker', 
		'name': 'Museum Worker', 
		'description': 'Work as a historical guy in the museum. You will need to have a good memory for facts, figures and events.',
		'rate': 7,
		'image1': 'vendors/glyphish/icons-gray/131-tower@2x.png',
		'image2': 'vendors/glyphish/icons-white/131-tower@2x.png',
		'calendar': [
			[10, 11, 12, 15, 16,],
			[10, 11, 12, 15, 16],
			[10, 11, 12, 15, 16],
			[10, 11, 12, 15, 16],
			[10, 11, 12, 15, 16],
			[],
			[]
		],
		'applicationHours': App.Cfg.TUsinHour * 24 * 2,
		'requirements': [
			{'name': 'loyalty', 'value': 75},
			{'name': 'workHours', 'value': 300}
		]
	},
	{
		'id': 'security', 
		'name': 'Stadium Security', 
		'description': 'Guard the stadium during the matches, trainings and average days',
		'rate': 10,
		'image1': 'vendors/glyphish/icons-gray/134-viking@2x.png',
		'image2': 'vendors/glyphish/icons-white/134-viking@2x.png',
		'calendar': [
			[10, 11, 12, 15, 16],
			[10, 11, 12, 15, 16],
			[10, 11, 12, 15, 16],
			[10, 11, 12, 15, 16],
			[10, 11, 12, 15, 16],
			[],
			[]
		],
		'applicationHours': App.Cfg.TUsinHour * 24 * 3,
		'requirements': []
	},
	{
		'id': 'builder', 
		'name': 'Stadium Builder', 
		'description': 'Maintain stadium in the perfect condition',
		'rate': 15,
		'image1': 'vendors/glyphish/icons-gray/157-wrench@2x.png',
		'image2': 'vendors/glyphish/icons-white/157-wrench@2x.png',
		'calendar': [
			[10, 11, 12, 15, 16],
			[10, 11, 12, 15, 16],
			[10, 11, 12, 15, 16],
			[10, 11, 12, 15, 16],
			[10, 11, 12, 15, 16],
			[],
			[]
		],
		'applicationHours': App.Cfg.TUsinHour * 24,
		'requirements': []
	},
]


